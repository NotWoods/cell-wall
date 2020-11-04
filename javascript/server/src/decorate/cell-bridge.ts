import { startIntent, DeviceManager } from '@cell-wall/android-bridge';
import { CellManager, CellData } from '@cell-wall/cells';
import { stringify } from 'querystring';

export function cellBridge(deviceManager: DeviceManager, cells: CellManager) {
  cells.on('state', async (data: CellData) => {
    const device = deviceManager.devices.get(data.serial);
    if (!device) return;

    const { type, ...props } = data.state;

    await startIntent(device, {
      action: 'com.tigeroakes.cellwallclient.DISPLAY',
      dataUri: `cellwall://${type}?${stringify(props as any, '\\&')}`,
    });
  });
}
