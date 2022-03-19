import type { ADB } from 'appium-adb';
import { checkIfOn } from './adb-action';
import type { DeviceMap } from './device-manager';

const KEYCODE_POWER = 26;

export function asPower(primitive: unknown): boolean | undefined {
	switch (primitive) {
		case true:
		case false:
			return primitive;
		case 'false':
			return false;
		case 0:
		case 1:
		case 'true':
			return Boolean(primitive);
		default:
			return undefined;
	}
}

async function setPowerOne(client: ADB, on?: boolean) {
	const isOn = await checkIfOn(client);
	if (isOn !== on) {
		if (on === false) {
			await client.keyevent(KEYCODE_POWER);
		} else {
			await client.cycleWakeUp();
		}
		return !isOn;
	}
	return on;
}

/**
 * Turn all devices on or off.
 */
export async function setPower(device: ADB | DeviceMap, on: boolean): Promise<boolean> {
	if (device instanceof Map) {
		const devices: DeviceMap = device;
		await Promise.all(
			Array.from(devices.values()).map(({ adb: client }) => setPowerOne(client, on))
		);
		return on;
	} else {
		return await setPowerOne(device as ADB);
	}
}
