import type { CellData } from '@cell-wall/shared';
import { derived, get, type Readable, type Unsubscriber } from 'svelte/store';
import { DeviceManager } from '../android/device-manager';
import { setPower } from '../android/power';
import { CellManager, cellStateStore } from '../cells';
import { DATABASE_FILENAME, PACKAGE_NAME, SERVER_ADDRESS } from '../env';
import { SplitImageCache } from '../image/cache';
import { asArray, getAll } from '../map/get';
import { transformMap } from '../map/transform';
import { onlyNewEntries } from '../store/changes';
import { deriveCellData } from './combine-cell';
import { database } from './database';
import type { Repository } from './interface';
import { webSocketStore } from './socket-store';
import { thirdPartyConnectRepository } from './third-party-connect';

function sendIntentOnStateChange(
	cellData: Readable<ReadonlyMap<string, CellData>>,
	deviceManager: DeviceManager
): Unsubscriber {
	const connectionInfoStore = derived(cellData, (data) =>
		transformMap(data, (cellData) => ({
			server: cellData.info?.server,
			connection: new Set(cellData.connection)
		}))
	);

	const cellStates = onlyNewEntries(
		derived(cellData, (data) => transformMap(data, (cellData) => cellData.state))
	);

	return cellStates.subscribe((stateChanges) => {
		const connectionInfo = get(connectionInfoStore);

		Promise.all(
			Array.from(stateChanges).map(async ([serial, state]) => {
				const { server = SERVER_ADDRESS, connection = new Set() } =
					connectionInfo.get(serial) ?? {};

				// WebSocket connections override Android connections
				if (state && connection.has('android') && !connection.has('web')) {
					await deviceManager.startAndroidClient(serial, server, state);
				}
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
	const cellData = deriveCellData({
		info: cellManager,
		state: cellState,
		devices: deviceManager,
		webSockets
	});
	sendIntentOnStateChange(cellData, deviceManager);
	cellData.subscribe((state) => console.info('CellData', state));

	const thirdParty = thirdPartyConnectRepository(dbPromise);

	return {
		cellData,
		cellState,
		images: new SplitImageCache(),
		webSockets,
		thirdParty,
		refreshDevices() {
			const refreshPromise = deviceManager.refreshDevices();
			deviceManagerPromise = refreshPromise.then(() => deviceManager);
			return refreshPromise;
		},
		async installApk(tag) {
			const apkPath = await thirdParty.github.downloadApk(tag);
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
		},
		async openClientOnDevice(serial) {
			const deviceManager = await deviceManagerPromise;
			const { server = SERVER_ADDRESS, deviceName = '' } = get(cellData).get(serial)?.info ?? {};

			await deviceManager.startWebClient(serial, server, deviceName);
		}
	};
}
