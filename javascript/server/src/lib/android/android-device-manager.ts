import type { CellState } from '@cell-wall/shared';
import { get } from 'svelte/store';
import { toUri } from '../cells/state';
import { PACKAGE_NAME, PORT } from '../env';
import { transformMapAsync } from '../map/transform';
import { startIntent } from './adb-actions';
import { adbDevicesStore } from './adb-devices';
import { androidPowered } from './android-powered';
import { androidProperties } from './android-properties';

export class AndroidDeviceManager {
	readonly devices = adbDevicesStore();
	readonly properties = androidProperties(this.devices);
	readonly powered = androidPowered(this.devices);

	/**
	 * Launch the CellWall Android client app by sending an Intent over ADB.
	 * @param serial ID of the device to send the intent to.
	 * @param host URL of the host server, as far as the target device is aware.
	 * Useful if the target device is running a different network.
	 * @param state Cell state to display using the Android client, instead of the Svelte web client.
	 * Planning to deprecate this.
	 * If not set, the intent will open the Svelte web client via the Android app.
	 */
	async launchClient(serial: string, host: URL | string, state?: CellState) {
		const adb = get(this.devices).get(serial);
		if (!adb) return;

		let dataUri: URL;
		if (state) {
			dataUri = toUri(state, host);
		} else {
			dataUri = new URL(`/cell?id=${serial}&autojoin`, host);
		}

		await startIntent(adb, {
			action: `${PACKAGE_NAME}.DISPLAY`,
			dataUri,
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
			? new Map(Array.from($devices).filter(([serial]) => targetDevices.has(serial)))
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
	async connectOverUsb(serial: string, devicePort: number = PORT) {
		const adb = get(this.devices).get(serial);
		if (!adb) return;

		await adb.reversePort(devicePort, PORT);
	}
}
