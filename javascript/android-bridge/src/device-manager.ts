import ADB, { Device } from 'appium-adb';

export type DeviceMap = Map<string, ADB>;
export type DeviceCallback<T> = (adb: ADB, udid: string) => Promise<T>;

export class DeviceManager {
  devices = new Map<string, ADB>();
  devicesLoading = true;

  async refreshDevices() {
    this.devicesLoading = true;

    const adbGlobal = await ADB.createADB();
    const devices: Device[] = await adbGlobal.getConnectedDevices();

    const clients = await Promise.all(
      devices.map(async (device) => {
        const adb = await ADB.createADB();
        adb.setDevice(device);
        return [device.udid, adb] as const;
      }),
    );

    this.devices = new Map(clients);
    this.devicesLoading = false;
    return this.devices;
  }
}
