import type { ADB } from 'appium-adb';
import { checkIfOn } from './adb-action';
import type { DeviceMap } from './device-manager';

export type Power = boolean | 'toggle';

const KEYCODE_POWER = 26;

export function asPower(primitive: unknown): Power | undefined {
	switch (primitive) {
		case 'toggle':
		case true:
		case false:
			return primitive;
		case 'true':
		case 'false':
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
export async function setPower(device: ADB | DeviceMap, on: Power): Promise<boolean> {
	if (device instanceof Map) {
		const devices = device as DeviceMap;
		let allOn: boolean;
		if (on === 'toggle') {
			const powerStates = await Promise.all(
				Array.from(devices.values()).map(async ({ adb: client }) => ({
					on: await checkIfOn(client),
					client
				}))
			);
			const numOn = powerStates.filter((state) => state.on).length;
			const numOff = powerStates.length - numOn;
			allOn = numOn < numOff;
		} else {
			allOn = on;
		}

		await Promise.all(
			Array.from(devices.values()).map(({ adb: client }) => setPowerOne(client, allOn))
		);
		return allOn;
	} else {
		return await setPowerOne(device as ADB);
	}
}
