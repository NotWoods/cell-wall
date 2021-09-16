import type { Auth } from 'googleapis';
import { derived, get, Readable, writable } from 'svelte/store';
import { DeviceManager, DeviceMap } from '../android/device-manager';
import { setPower } from '../android/power';
import { CellManager, CellState, toUri } from '../cells';
import { Cell, database } from '../database';
import { PACKAGE_NAME, SERVER_ADDRESS, SQLITE_FILENAME } from '../env';
import { asArray, getAll } from '../map/get';
import { subscribeToMapStore } from '../map/subscribe';

export interface CellData {
	serial: string;
	info?: Cell;
	state?: CellState;
	connected: boolean;
}

type CellDataMap = ReadonlyMap<string, CellData>;

export interface Repository {
	cellData: Readable<CellDataMap>;
	refreshDevices(): Promise<DeviceMap>;
	getTokens(): Promise<Auth.Credentials | undefined>;
	insertTokens(token: Auth.Credentials): Promise<void>;
	getPower(serial: string): Promise<boolean>;
	setPower(serial: string | readonly string[], on: boolean | 'toggle'): Promise<boolean>;
	setState(serial: string, state: CellState): Promise<void>;
	setStates(states: { [serial: string]: CellState } | Map<string, CellState>): Promise<void>;
}

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
		}
	);
}

export function repository(): Repository {
	const dbPromise = database(SQLITE_FILENAME);
	const tokenDaoPromise = dbPromise.then((db) => db.tokenDao());
	const cellDaoPromise = dbPromise.then((db) => db.cellDao());

	const deviceManager = new DeviceManager();
	let deviceManagerPromise = deviceManager.refreshDevices().then(() => deviceManager);
	const cellManagerPromise = cellDaoPromise.then((cellDao) => new CellManager(cellDao));

	const cellData = writable<CellDataMap>(new Map());

	// Send intents whenever cell state changes
	Promise.all([cellManagerPromise, deviceManagerPromise]).then(([cellManager, deviceManager]) => {
		sendIntentOnStateChange(cellManager, deviceManager);
		deriveCellInfo(cellManager, deviceManager).subscribe(cellData.set);
	});

	return {
		cellData,
		refreshDevices() {
			const refreshPromise = deviceManager.refreshDevices();
			deviceManagerPromise = refreshPromise.then(() => deviceManager);
			return refreshPromise;
		},
		async getTokens() {
			const tokenDao = await tokenDaoPromise;
			const allString = await tokenDao.getToken('all_tokens');
			return allString ? JSON.parse(allString) : undefined;
		},
		async insertTokens(json) {
			const tokenDao = await tokenDaoPromise;
			return tokenDao.insertToken('all_tokens', JSON.stringify(json));
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
