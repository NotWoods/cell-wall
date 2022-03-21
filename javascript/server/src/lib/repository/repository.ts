import type { CellData } from '@cell-wall/shared';
import { derived, get } from 'svelte/store';
import { AndroidDeviceManager } from '../android/android-device-manager';
import { cellStateStore } from '../cells/state';
import { DATABASE_FILENAME, SERVER_ADDRESS } from '../env';
import { filterMap, transformMap } from '../map/transform';
import { deriveCellData } from './combine-cell';
import { addCellInfo, database } from './database';
import type { Repository } from './interface';
import { webSocketStore } from './socket-store';
import { thirdPartyConnectRepository } from './third-party-connect';

/**
 * Returns server info for only Android cells.
 */
export function androidConnections(
	data: ReadonlyMap<string, CellData>
): ReadonlyMap<string, { server: string | undefined }> {
	const connectionInfo = transformMap(data, (cellData) => ({
		server: cellData.info?.server,
		connection: new Set(cellData.connection)
	}));

	return filterMap(
		connectionInfo,
		({ connection }) => connection.has('android') && !connection.has('web')
	);
}

export function repository(): Repository {
	const db = database(DATABASE_FILENAME);
	const cellState = cellStateStore();
	const webSockets = webSocketStore();

	const deviceManager = new AndroidDeviceManager();
	let deviceManagerPromise = deviceManager.devices.refresh().then(() => deviceManager);

	// Send intents whenever cell state changes
	const cellData = deriveCellData({
		info: derived(db, (data) => new Map(Object.entries(data.cells))),
		state: cellState,
		androidProperties: deviceManager.properties,
		webSockets
	});
	const android = derived(cellData, androidConnections);
	cellData.subscribe((state) => console.info('CellData', state));

	const thirdParty = thirdPartyConnectRepository(db);

	return {
		cellData,
		cellState,
		androidConnections: android,
		powered: deviceManager.powered,
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

			await db.update(addCellInfo(serial, { server: `http://localhost:${port}` }));
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
			await db.update(addCellInfo(info.serial, info));
		},
		async openClientOnDevice(serial) {
			const deviceManager = await deviceManagerPromise;
			const { server = SERVER_ADDRESS } = get(cellData).get(serial)?.info ?? {};

			await deviceManager.launchClient(serial, server);
		}
	};
}
