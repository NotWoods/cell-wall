import type { Device, InstallOrUpgradeResult } from 'appium-adb';
import { ADB } from 'appium-adb';
import type { Readable } from 'svelte/store';
import { writable } from 'svelte/store';
import { transformMapAsync } from '../map/transform';
import type { StartIntentOptions } from './adb-action';
import { checkIfOn, startIntent } from './adb-action';

interface AdbDevice {
	adb: ADB;
	model: string;
	manufacturer: string;
}

export type DeviceMap = ReadonlyMap<string, AdbDevice>;
export type DeviceCallback<T> = (adb: ADB, udid: string) => Promise<T>;

function noDeviceError(err: unknown): err is Error {
	return err instanceof Error && err.message.includes('Could not find a connected Android device');
}

export class DeviceManager {
	private readonly _devices = writable<DeviceMap>(new Map());
	private _lastMap!: DeviceMap;

	constructor() {
		this.devices.subscribe((map) => {
			this._lastMap = map;
		});
	}

	get devices(): Readable<DeviceMap> {
		return this._devices;
	}

	async refreshDevices(): Promise<DeviceMap> {
		const adbGlobal = await ADB.createADB({
			allowOfflineDevices: false
		});
		let devices: Device[];
		try {
			devices = await adbGlobal.getDevicesWithRetry();
		} catch (err) {
			if (noDeviceError(err)) {
				devices = [];
			} else {
				throw err;
			}
		}

		const clients = await Promise.all(
			devices.map(async (device) => {
				const adb = await ADB.createADB();
				adb.setDevice(device);

				const [model, manufacturer] = await Promise.all([adb.getModel(), adb.getManufacturer()]);
				const adbDevice = {
					adb,
					model,
					manufacturer
				};
				return [device.udid, adbDevice] as const;
			})
		);

		const result = new Map(clients);
		this._devices.set(result);
		return result;
	}

	async installApkToAll(
		path: string,
		pkg?: string | null
	): Promise<Map<string, InstallOrUpgradeResult>> {
		return transformMapAsync(this._lastMap, ({ adb }) =>
			adb.installOrUpgrade(path, pkg, {
				enforceCurrentBuild: true
			})
		);
	}

	private async run(
		serial: string,
		action: (adb: ADB) => boolean | PromiseLike<boolean>
	): Promise<boolean> {
		const { adb } = this._lastMap.get(serial) ?? {};
		if (!adb) return false;

		return action(adb);
	}

	async checkIfOn(serial: string): Promise<boolean> {
		return this.run(serial, checkIfOn);
	}

	async togglePower(serial: string): Promise<boolean> {
		return this.run(serial, async (adb) => {
			await adb.cycleWakeUp();
			return true;
		});
	}

	async startIntent(serial: string, options: StartIntentOptions): Promise<boolean> {
		return this.run(serial, async (adb) => {
			await startIntent(adb, options);
			return true;
		});
	}
}
