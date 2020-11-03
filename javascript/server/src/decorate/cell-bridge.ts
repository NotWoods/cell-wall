import { startIntent, DeviceManager } from '@cell-wall/android-bridge';
import { CellManager, CellData } from '@cell-wall/cells';

export function cellBridge(deviceManager: DeviceManager, cells: CellManager) {
  cells.on('state', async (data: CellData) => {
    const device = deviceManager.devices.get(data.serial);
    if (!device) return;

    await startIntent(device, {
      action: 'com.tigeroakes.cellwallclient.DISPLAY',
      extras: {
        EXTRA_STATE: JSON.stringify(data.state),
      },
    });
  });
}
