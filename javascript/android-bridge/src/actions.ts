import ADB from 'appium-adb';
import { checkIfOn, togglePower } from './device-action';
import { DeviceMap } from './device-manager';

/**
 * Turn all devices on or off.
 */
export async function setPower(device: ADB | DeviceMap, on: boolean) {
  async function setPowerOne(client: ADB) {
    const isOn = await checkIfOn(client);
    if (isOn !== on) {
      await togglePower(client);
    }
  }

  if (device instanceof Map) {
    await Promise.all(Array.from(device.values()).map(setPowerOne));
  } else {
    await setPowerOne(device);
  }
}
