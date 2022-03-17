import type { CellInfo, CellState } from '@cell-wall/shared';
import { memo } from '@cell-wall/shared';
import { get, Readable } from 'svelte/store';
import { DeviceManager } from '../android/device-manager';
import { GithubApi } from '../android/github';
import { setPower } from '../android/power';
import { CellManager, cellStateStore, toUri } from '../cells';
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
import { deriveCellData } from './combine-cell';
import { database } from './database';
import type { Repository } from './interface';
import { webSocketStore } from './socket-store';

function sendIntentOnStateChange(
	stores: {
		info: Readable<ReadonlyMap<string, CellInfo>>;
		state: Readable<ReadonlyMap<string, CellState>>;
	},
	deviceManager: DeviceManager
) {
	subscribeToMapStore(stores.state, (newStates, oldStates) => {
		const changes = new Map(newStates);
		if (oldStates) {
			// Delete state if it was already present
			for (const [serial, state] of oldStates) {
				if (changes.get(serial) === state) {
					changes.delete(serial);
				}
			}
		}

		const info = get(stores.info);
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

export function repository(): Repository {
	const dbPromise = database(DATABASE_FILENAME);
	const cellState = cellStateStore();
	const webSockets = webSocketStore();

	const deviceManager = new DeviceManager();
	let deviceManagerPromise = deviceManager.refreshDevices().then(() => deviceManager);
	const cellManager = new CellManager();
	const cellManagerPromise = dbPromise.then((db) => cellManager.loadInfo(db));

	// Send intents whenever cell state changes
	sendIntentOnStateChange({ info: cellManager, state: cellState }, deviceManager);
	const cellData = deriveCellData({
		info: cellManager,
		state: cellState,
		devices: deviceManager,
		webSockets
	});
	cellData.subscribe((state) => console.info('CellData', state));

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
		cellState,
		images: new SplitImageCache(),
		webSockets,
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
		async connectDevicePort(serial, port) {
			const deviceManager = await deviceManagerPromise;
			if (await deviceManager.connectPort(serial, port)) {
				const cellManager = await cellManagerPromise;
				cellManager.registerServer(serial, `http://localhost:${port}`);

				const db = await dbPromise;
				await cellManager.writeInfo(db);

				return true;
			} else {
				return false;
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
			const devices = get(deviceManager);
			const serialList = asArray(serial);
			return setPower(getAll(devices, serialList), on);
		},
		async registerCell(info) {
			const cellManager = await cellManagerPromise;
			cellManager.register(info.serial, info);

			const db = await dbPromise;
			await cellManager.writeInfo(db);
		}
	};
}
