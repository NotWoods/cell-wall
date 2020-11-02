import ADB, { Device } from 'appium-adb';

export class DeviceManager {
  devices: Device[] = [];
  devicesLoading = true;

  constructor(private adb: ADB) {}

  async refreshDevices() {
    this.devicesLoading = true;
    this.devices = await this.adb.getConnectedDevices();
    this.devicesLoading = false;
  }
}
