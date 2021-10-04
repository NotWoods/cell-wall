import type { Device } from 'appium-adb';
import { ADB } from 'appium-adb';
import type { Readable } from 'svelte/store';
import { writable } from 'svelte/store';
import type { StartIntentOptions } from './adb-action';
import { checkIfOn, startIntent, togglePower } from './adb-action';

export type DeviceMap = ReadonlyMap<string, ADB>;
export type DeviceCallback<T> = (adb: ADB, udid: string) => Promise<T>;

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
		const devices: Device[] = await adbGlobal.getConnectedDevices();

		const clients = await Promise.all(
			devices.map(async (device) => {
				const adb = await ADB.createADB();
				adb.setDevice(device);
				return [device.udid, adb] as const;
			})
		);

		const result = new Map(clients);
		this._devices.set(result);
		return result;
	}

	async checkIfOn(serial: string): Promise<boolean> {
		const adb = this._lastMap.get(serial);
		if (!adb) return false;

		return checkIfOn(adb);
	}

	async togglePower(serial: string): Promise<boolean> {
		const adb = this._lastMap.get(serial);
		if (!adb) return false;

		await togglePower(adb);
		return true;
	}

	async startIntent(serial: string, options: StartIntentOptions): Promise<boolean> {
		const adb = this._lastMap.get(serial);
		if (!adb) return false;

		await startIntent(adb, options);
		return true;
	}
}
