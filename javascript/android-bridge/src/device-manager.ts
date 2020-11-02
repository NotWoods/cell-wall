import ADB, { Device } from 'appium-adb';

export class DeviceManager {
  devices = new Map<Device['uuid'], ADB>();
  devicesLoading = true;

  async refreshDevices() {
    this.devicesLoading = true;

    const adbGlobal = await ADB.createADB();
    const devices: Device[] = await adbGlobal.getConnectedDevices();

    const clients = await Promise.all(
      devices.map(async (device) => {
        const adb = await ADB.createADB();
        adb.setDevice(device);
        return [device.uuid, adb] as const;
      }),
    );

    this.devices = new Map(clients);
    this.devicesLoading = false;
    return this.devices;
  }

  /**
   * Calls a defined callback function on each device.
   */
  async map<T>(callback: (adb: ADB, uuid: Device['uuid']) => Promise<T>) {
    const results: Promise<T>[] = [];
    for (const [uuid, adb] of this.devices) {
      results.push(callback(adb, uuid));
    }
    return await Promise.all(results);
  }
}
