import { GoogleClient, initializeGoogle } from '$lib/google';
import type { Auth } from 'googleapis';
import type { Readable } from 'svelte/store';
import { derived, get, writable } from 'svelte/store';
import { DeviceManager } from '../android/device-manager';
import { setPower } from '../android/power';
import { CellManager, toUri } from '../cells';
import { database } from '../database';
import {
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	PACKAGE_NAME,
	SERVER_ADDRESS,
	SQLITE_FILENAME
} from '../env';
import { asArray, getAll } from '../map/get';
import { subscribeToMapStore } from '../map/subscribe';
import type { CellData, CellDataMap, Repository } from './interface';

function sendIntentOnStateChange(cellManager: CellManager, deviceManager: DeviceManager) {
	subscribeToMapStore(cellManager.state, (newStates, oldStates) => {
		const changes = new Map(newStates);
		if (oldStates) {
			// Delete state if it was already present
			for (const [serial, state] of oldStates) {
				if (changes.get(serial) === state) {
					changes.delete(serial);
				}
			}
		}

		const info = get(cellManager.info);
		Promise.all(
			Array.from(changes).map(([serial, state]) => {
				console.log(serial, state);
				const base = info.get(serial)?.server || SERVER_ADDRESS;

				return deviceManager.startIntent(serial, {
					action: `${PACKAGE_NAME}.DISPLAY`,
					dataUri: toUri(state, base).replace(/&/g, '\\&').replace(/'/g, '%27')
				});
			})
		);
	});
}

function deriveCellInfo(
	cellManager: CellManager,
	deviceManager: DeviceManager
): Readable<CellDataMap> {
	return derived(
		[cellManager.info, cellManager.state, deviceManager.devices],
		([infoMap, states, devices]) => {
			const cellInfoMap = new Map<string, CellData>();
			for (const [serial, info] of infoMap) {
				cellInfoMap.set(serial, { serial, info, connected: false });
			}
			for (const [serial, state] of states) {
				const existing = cellInfoMap.get(serial);
				if (existing) {
					existing.state = state;
				} else {
					cellInfoMap.set(serial, { serial, state, connected: false });
				}
			}
			for (const serial of devices.keys()) {
				const existing = cellInfoMap.get(serial);
				if (existing) {
					existing.connected = true;
				} else {
					cellInfoMap.set(serial, { serial, connected: true });
				}
			}
			return cellInfoMap;
		},
		new Map()
	);
}

export function repository(): Repository {
	const dbPromise = database(SQLITE_FILENAME);

	const deviceManager = new DeviceManager();
	let deviceManagerPromise = deviceManager.refreshDevices().then(() => deviceManager);
	const cellManager = new CellManager();
	const cellManagerPromise = dbPromise
		.then((db) => cellManager.loadInfo(db))
		.then(() => cellManager);

	const cellData = writable<CellDataMap>(new Map());

	// Send intents whenever cell state changes
	sendIntentOnStateChange(cellManager, deviceManager);
	deriveCellInfo(cellManager, deviceManager).subscribe(cellData.set);

	let googleClient: Promise<GoogleClient> | undefined;

	const tokens = {
		async getTokens() {
			const db = await dbPromise;
			const allString = await db.getToken();
			return allString ? JSON.parse(allString) : undefined;
		},
		async insertTokens(json: Auth.Credentials) {
			const db = await dbPromise;
			return db.insertToken(JSON.stringify(json));
		}
	};

	return {
		...tokens,
		cellData,
		refreshDevices() {
			const refreshPromise = deviceManager.refreshDevices();
			deviceManagerPromise = refreshPromise.then(() => deviceManager);
			return refreshPromise;
		},
		googleAuth() {
			if (!googleClient) {
				googleClient = initializeGoogle(tokens, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);
			}
			return googleClient;
		},
		async getPower(serial) {
			const deviceManager = await deviceManagerPromise;
			return deviceManager.checkIfOn(serial);
		},
		async setPower(serial, on) {
			const deviceManager = await deviceManagerPromise;
			const devices = get(deviceManager.devices);
			const serialList = asArray(serial);
			return setPower(getAll(devices, serialList), on);
		},
		async setState(serial, state) {
			const cellManager = await cellManagerPromise;
			cellManager.setState(serial, state);
		},
		async setStates(states) {
			const cellManager = await cellManagerPromise;
			cellManager.setStateMap(states);
		}
	};
}
