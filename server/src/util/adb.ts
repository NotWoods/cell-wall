import ADB from 'appium-adb';

export class Devices {
    static async create() {
        const devices = new Devices();
        await devices.ready;
        await devices.refreshDevices();
        return devices;
    }

    private ready: Promise<ADB>;
    private adb: ADB | undefined;
    private devices = new Map<string, ADB>();
    private constructor() {
        this.ready = ADB.createADB().then(adb => {
            this.adb = adb;
            return adb;
        });
    }

    async refreshDevices() {
        const devices = await this.adb!.getConnectedDevices();

        const seenDevices = new Set<string>(this.devices.keys());
        await Promise.all(
            devices.map(async ({ udid }) => {
                seenDevices.delete(udid);

                if (this.devices.has(udid)) {
                    const adb = await ADB.createADB();
                    adb.setDeviceId(udid);
                    this.devices.set(udid, adb);
                }
            }),
        );

        seenDevices.forEach(udid => this.devices.delete(udid));
    }

    /**
     * Run a command on each connected device.
     */
    async forEachDevice(cb: (adb: ADB) => Promise<void>) {
        await Promise.all(Array.from(this.devices.values(), cb));
    }
}

const KEYCODE_POWER = 26;

/**
 * Checks if the screen for a device is turned on.
 */
export async function isScreenOn(adb: ADB) {
    const dumpsysOutput = await adb.shell(['dumpsys', 'power']);
    const match = dumpsysOutput.match(/mWakefulness=(\w+)/);
    return match != null && match[1] === 'Awake';
}

/**
 * Turns on the screen of a device, if not yet turned on.
 * @param on If false, turn off the screen instead.
 */
export async function turnOn(adb: ADB, on = true) {
    const isOn = await isScreenOn(adb);
    if (isOn !== on) await adb.keyevent(KEYCODE_POWER);
}
