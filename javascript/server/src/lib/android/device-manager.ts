import type { CellState } from '@cell-wall/shared';
import type { Device, InstallOrUpgradeResult } from 'appium-adb';
import { ADB } from 'appium-adb';
import type { Readable, Subscriber, Unsubscriber } from 'svelte/store';
import { writable } from 'svelte/store';
import { toUri } from '../cells/state';
import { PACKAGE_NAME, PORT } from '../env';
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

export class DeviceManager implements Readable<DeviceMap> {
	private readonly _devices = writable<DeviceMap>(new Map());
	private _lastMap!: DeviceMap;

	constructor() {
		this._devices.subscribe((map) => {
			this._lastMap = map;
		});
	}

	subscribe(run: Subscriber<DeviceMap>, invalidate?: (value?: DeviceMap) => void): Unsubscriber {
		return this._devices.subscribe(run, invalidate);
	}

	async refreshDevices(): Promise<DeviceMap> {
		const adbGlobal = await ADB.createADB({
			allowOfflineDevices: process.env['NODE_ENV'] !== 'production'
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

	private async startIntent(serial: string, options: StartIntentOptions): Promise<boolean> {
		return this.run(serial, async (adb) => {
			try {
				await startIntent(adb, options);
				return true;
			} catch (err) {
				console.warn(err);
				return false;
			}
		});
	}

	async connectPort(serial: string, devicePort: number): Promise<boolean> {
		return this.run(serial, async (adb) => {
			await adb.reversePort(devicePort, PORT);
			return true;
		});
	}

	async startWebClient(serial: string, server: URL | string) {
		return this.startIntent(serial, {
			action: 'android.intent.action.VIEW',
			dataUri: new URL(`/cell?id=${serial}&autojoin`, server),
			waitForLaunch: true
		});
	}

	async startAndroidClient(serial: string, server: URL | string, state: CellState) {
		return this.startIntent(serial, {
			action: `${PACKAGE_NAME}.DISPLAY`,
			dataUri: toUri(state, server),
			waitForLaunch: true
		});
	}
}
