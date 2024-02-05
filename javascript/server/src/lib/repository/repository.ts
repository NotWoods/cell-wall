import type { CellData } from '@cell-wall/shared';
import { derived, get } from 'svelte/store';
import { AndroidDeviceManager } from '../android/android-device-manager';
import type { Serial } from '../android/opaque';
import { cellStateStore } from '../cells/state';
import { DATABASE_FILENAME, PORT, SERVER_ADDRESS } from '../env';
import { allSettledMap, filterMap } from '@notwoods/webish';
import { deriveCellData } from './combine-cell';
import { addCellInfo, database } from './database';
import type { OpenClientOptions, Repository } from './interface';
import { webSocketStore } from './socket-store';
import { logState } from './state-log';
import { thirdPartyConnectRepository } from './third-party-connect';

function isAndroidOnlyConnection(cell: CellData) {
	return cell.connection.includes('android') && !cell.connection.includes('web');
}

export function repository(): Repository {
	const db = database(DATABASE_FILENAME);
	const cellState = cellStateStore();
	const webSockets = webSocketStore();

	const deviceManager = new AndroidDeviceManager();

	// Send intents whenever cell state changes
	const cellData = deriveCellData({
		database: derived(db, (data) => new Map(Object.entries(data.cells))),
		state: cellState,
		androidProperties: deviceManager.properties,
		webSockets
	});

	const thirdParty = thirdPartyConnectRepository(db);

	async function openClientOnDevice({ serial, portReverse }: OpenClientOptions = {}) {
		await deviceManager.refreshed;
		const $cellData = get(cellData);

		async function openOnSingleDevice(cell: CellData, serial: string) {
			const { server = SERVER_ADDRESS } = cell.info ?? {};
			if (portReverse) {
				await deviceManager.connectOverUsb(serial as Serial, PORT);
			}
			return deviceManager.launchClient(serial as Serial, server);
		}

		if (serial) {
			// Launch client for specific device
			const singleItem = filterMap($cellData, (_, key) => key === serial);
			return allSettledMap(singleItem, openOnSingleDevice);
		} else {
			// Launch client on Android devices without the web client open
			const androidOnly = filterMap($cellData, isAndroidOnlyConnection);
			return allSettledMap(androidOnly, openOnSingleDevice);
		}
	}

	logState(cellData, deviceManager);
	openClientOnDevice();

	return {
		cellData,
		cellState,
		powered: deviceManager.powered,
		webSockets,
		thirdParty,
		refreshDevices: deviceManager.refreshDevices,
		async installApk(tag) {
			const apkPath = await thirdParty.github.downloadApk(tag);
			if (apkPath) {
				return await deviceManager.updateClient(apkPath);
			} else {
				return new Map();
			}
		},
		async connectDevicePort(serial, port) {
			await deviceManager.refreshed;
			await deviceManager.connectOverUsb(serial, port);

			await db.update(addCellInfo(serial, { server: `http://localhost:${port}` }));
		},
		async setPower(serials, on) {
			await deviceManager.refreshed;
			return deviceManager.powered.update((oldSet) => {
				const newSet = new Set(oldSet);
				if (on) {
					serials.forEach((serial) => newSet.add(serial as Serial));
				} else {
					serials.forEach((serial) => newSet.delete(serial as Serial));
				}
				return newSet;
			});
		},
		async registerCell(info) {
			await db.update(addCellInfo(info.serial, info));
		},
		openClientOnDevice
	};
}
