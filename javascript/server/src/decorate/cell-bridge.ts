import { startIntent, DeviceManager } from '@cell-wall/android-bridge';
import { toUri, CellManager, CellData } from '@cell-wall/cells';

export const PACKAGE_NAME = 'com.tigeroakes.cellwall.client';

String.prototype.replaceAll = function replaceAll(
  this: string,
  str: string | RegExp,
  newStr: any,
) {
  // If a regex pattern
  if (Object.prototype.toString.call(str).toLowerCase() === '[object regexp]') {
    return this.replace(str, newStr);
  }

  // If a string
  return this.replace(new RegExp(str, 'g'), newStr);
};

export function cellBridge(deviceManager: DeviceManager, cells: CellManager) {
  cells.on('state', async (data: CellData) => {
    const device = deviceManager.devices.get(data.serial);
    if (!device) return;

    console.log(data);
    const base = data.info?.server || process.env.SERVER_ADDRESS;

    await startIntent(device, {
      action: `${PACKAGE_NAME}.DISPLAY`,
      dataUri: toUri(data.state, base)
        .replaceAll(`&`, '\\&')
        .replaceAll(`&`, '%27'),
    });
  });
}
