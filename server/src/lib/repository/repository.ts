import type { Readable } from 'svelte/store';
import { derived, get } from 'svelte/store';
import { DeviceManager } from '../android/device-manager';
import { GithubApi } from '../android/github';
import { setPower } from '../android/power';
import { CellManager, toUri } from '../cells';
import {
	DATABASE_FILENAME,
	GITHUB_TOKEN,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	PACKAGE_NAME,
	SERVER_ADDRESS
} from '../env';
import type { GoogleClient } from '../google';
import { authenticateGoogle, initializeGoogle } from '../google';
import { SplitImageCache } from '../image/cache';
import { asArray, getAll } from '../map/get';
import { subscribeToMapStore } from '../map/subscribe';
import { memo } from '../memo';
import { database } from './database';
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
					dataUri: toUri(state, base),
					waitForLaunch: true
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
			for (const [serial, { model, manufacturer }] of devices) {
				const automaticDeviceName = `${manufacturer} ${model}`;
				const existing = cellInfoMap.get(serial);
				if (existing) {
					existing.connected = true;
					existing.info ||= {
						serial,
						deviceName: automaticDeviceName
					};
				} else {
					cellInfoMap.set(serial, {
						serial,
						connected: true,
						info: {
							serial,
							deviceName: automaticDeviceName
						}
					});
				}
			}
			return cellInfoMap;
		},
		new Map()
	);
}

export function repository(): Repository {
	const dbPromise = database(DATABASE_FILENAME);

	const deviceManager = new DeviceManager();
	let deviceManagerPromise = deviceManager.refreshDevices().then(() => deviceManager);
	const cellManager = new CellManager();
	const cellManagerPromise = dbPromise.then((db) => cellManager.loadInfo(db));

	// Send intents whenever cell state changes
	sendIntentOnStateChange(cellManager, deviceManager);
	const cellData = deriveCellInfo(cellManager, deviceManager);

	const googleApi = memo(async function googleApi(): Promise<GoogleClient> {
		if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
			throw new Error(`Missing Google API keys`);
		}

		const db = await dbPromise;
		const credentials = await db.getGoogleCredentials();
		const googleClient = initializeGoogle(credentials, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);

		if (googleClient.authorizeUrl) {
			console.log(`\n---\nAuthenticate with Google:\n${googleClient.authorizeUrl}\n---\n`);
		}

		return googleClient;
	});

	const github = memo(() => {
		if (!GITHUB_TOKEN) {
			throw new Error(`Missing GitHub API keys`);
		}

		return new GithubApi({ auth: GITHUB_TOKEN });
	});

	return {
		cellData,
		cellDataJson: derived(cellData, (map) => JSON.stringify(Object.fromEntries(map))),
		images: new SplitImageCache(),
		refreshDevices() {
			const refreshPromise = deviceManager.refreshDevices();
			deviceManagerPromise = refreshPromise.then(() => deviceManager);
			return refreshPromise;
		},
		async installApk(tag) {
			const apkPath = await github().downloadApk(tag);
			if (apkPath) {
				return await deviceManager.installApkToAll(apkPath, PACKAGE_NAME);
			} else {
				return new Map();
			}
		},
		googleApi,
		async authenticateGoogleApi(code: string) {
			const db = await dbPromise;
			const googleClient = await googleApi();
			const credentials = await authenticateGoogle(googleClient.client, code);
			await db.setGoogleCredentials(credentials);
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
		},
		async registerCell(info) {
			const cellManager = await cellManagerPromise;
			cellManager.register(info.serial, info);

			const db = await dbPromise;
			await cellManager.writeInfo(db);
		}
	};
}
