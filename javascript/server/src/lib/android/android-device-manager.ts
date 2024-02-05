import type { CellState } from '@cell-wall/shared';
import { get } from 'svelte/store';
import { PACKAGE_NAME, PORT } from '../env';
import { filterMap, transformMapAsync } from '@notwoods/webish';
import { startIntent } from './adb-actions';
import { adbDevicesStore } from './adb-devices';
import { androidPowered } from './android-powered';
import { androidProperties } from './android-properties';
import type { Serial } from './opaque';

export class AndroidDeviceManager {
	readonly devices = adbDevicesStore();
	readonly properties = androidProperties(this.devices);
	readonly powered = androidPowered(this.devices);

	/**
	 * Promise indicating if last device refresh is finished
	 */
	refreshed!: Promise<void>;

	constructor() {
		this.refreshDevices();
	}

	/**
	 * Poll for the current list of connected ADB devices.
	 * @see refreshed
	 */
	refreshDevices = () => {
		this.refreshed = this.devices.refresh();
		return this.refreshed;
	};

	/**
	 * Launch the CellWall Android client app by sending an Intent over ADB.
	 * Opens a GeckoView browser pointing at the Svelte web client (`http://address:3000/cell?id=serial`).
	 * @param serial ID of the device to send the intent to.
	 * @param host URL of the host server, as far as the target device is aware.
	 * Useful if the target device is running a different network.
	 */
	async launchClient(serial: Serial, host: URL | string) {
		const adb = get(this.devices).get(serial);
		if (!adb) return;

		await startIntent(adb, {
			action: `${PACKAGE_NAME}.DISPLAY`,
			dataUri: new URL(`/cell?id=${serial}&autojoin`, host),
			waitForLaunch: true
		});
	}

	/**
	 * Update the installed Android client app.
	 * @param apkPath APK to install is loaded from this path on the server.
	 * @param targetDevices If provided, the APK is only updated on the specified devices.
	 * If not provided, all devices are updated.
	 */
	async updateClient(apkPath: string, targetDevices?: ReadonlySet<string>) {
		const $devices = get(this.devices);
		const devicesToUpdate = targetDevices
			? filterMap($devices, (_, serial) => targetDevices.has(serial))
			: $devices;

		return transformMapAsync(devicesToUpdate, (adb) =>
			adb.installOrUpgrade(apkPath, PACKAGE_NAME, { enforceCurrentBuild: true })
		);
	}

	/**
	 * Instruct the Android client app to use ADB/USB for its network connection.
	 * Makes `localhost:{devicePort}` on the Android device point to this server.
	 * @param serial ID of the device to modify.
	 * @param devicePort Port on the device to forward to. Defaults to server port.
	 */
	async connectOverUsb(serial: Serial, devicePort: number = PORT) {
		const adb = get(this.devices).get(serial);
		if (!adb) return;

		await adb.reversePort(devicePort, PORT);
	}

	async sendDisplayIntent(serial: Serial, state: CellState) {
		const adb = get(this.devices).get(serial);
		if (!adb) return;

		const stateUrl = new URL(`cellwall://${state.type.toLowerCase()}`);
		Object.entries(state)
			.filter(([key, value]) => key !== 'type' && typeof value === 'string')
			.forEach(([key, value]) => {
				stateUrl.searchParams.set(key, value);
			});

		await startIntent(adb, {
			action: `${PACKAGE_NAME}.DISPLAY`,
			dataUri: stateUrl.href,
			waitForLaunch: true
		});
	}
}
