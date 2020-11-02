import 'iterator-polyfill';
import { checkIfOn, togglePower } from './device-action';
import { DeviceMap } from './device-manager';

/**
 * Turn all devices on or off.
 */
export async function setPower(devices: DeviceMap, on: boolean) {
  await Promise.all(
    Array.from(devices.values()).map(async (client) => {
      const isOn = await checkIfOn(client);
      if (isOn !== on) {
        await togglePower(client);
      }
    }),
  );
}
