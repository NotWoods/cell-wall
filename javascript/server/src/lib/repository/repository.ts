import type { CellData } from '@cell-wall/shared';
import { derived, get, type Readable, type Unsubscriber } from 'svelte/store';
import { AndroidDeviceManager } from '../android/android-device-manager';
import { CellManager, cellStateStore } from '../cells';
import { DATABASE_FILENAME, SERVER_ADDRESS } from '../env';
import { SplitImageCache } from '../image/cache';
import { transformMap } from '../map/transform';
import { onlyNewEntries } from '../store/changes';
import { deriveCellData } from './combine-cell';
import { database } from './database';
import type { Repository } from './interface';
import { webSocketStore } from './socket-store';
import { thirdPartyConnectRepository } from './third-party-connect';

function sendIntentOnStateChange(
	cellData: Readable<ReadonlyMap<string, CellData>>,
	deviceManager: AndroidDeviceManager
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
					await deviceManager.launchClient(serial, server, state);
				}
			})
		);
	});
}

export function repository(): Repository {
	const dbPromise = database(DATABASE_FILENAME);
	const cellState = cellStateStore();
	const webSockets = webSocketStore();

	const deviceManager = new AndroidDeviceManager();
	let deviceManagerPromise = deviceManager.devices.refresh().then(() => deviceManager);

	const cellManager = new CellManager();
	const cellManagerPromise = dbPromise.then((db) => cellManager.loadInfo(db));

	// Send intents whenever cell state changes
	const cellData = deriveCellData({
		info: cellManager,
		state: cellState,
		androidProperties: deviceManager.properties,
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
			const refreshPromise = deviceManager.devices.refresh();
			deviceManagerPromise = refreshPromise.then(() => deviceManager);
			return refreshPromise;
		},
		async installApk(tag) {
			const apkPath = await thirdParty.github.downloadApk(tag);
			if (apkPath) {
				return await deviceManager.updateClient(apkPath);
			} else {
				return new Map();
			}
		},
		async connectDevicePort(serial, port) {
			const deviceManager = await deviceManagerPromise;
			await deviceManager.connectOverUsb(serial, port);

			const cellManager = await cellManagerPromise;
			cellManager.registerServer(serial, `http://localhost:${port}`);

			const db = await dbPromise;
			await cellManager.writeInfo(db);
		},
		async getPower(serial, refresh) {
			const deviceManager = await deviceManagerPromise;
			if (refresh) {
				await deviceManager.powered.refresh();
			}
			return get(deviceManager.powered).has(serial);
		},
		async setPower(serials, on) {
			const deviceManager = await deviceManagerPromise;
			return deviceManager.powered.update((oldSet) => {
				const newSet = new Set(oldSet);
				if (on) {
					serials.forEach((serial) => newSet.add(serial));
				} else {
					serials.forEach((serial) => newSet.delete(serial));
				}
				return newSet;
			});
		},
		async registerCell(info) {
			const cellManager = await cellManagerPromise;
			cellManager.register(info.serial, info);

			const db = await dbPromise;
			await cellManager.writeInfo(db);
		},
		async openClientOnDevice(serial) {
			const deviceManager = await deviceManagerPromise;
			const { server = SERVER_ADDRESS } = get(cellData).get(serial)?.info ?? {};

			await deviceManager.launchClient(serial, server);
		}
	};
}
