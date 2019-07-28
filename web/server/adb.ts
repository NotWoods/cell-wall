import ADB from 'appium-adb';

export const ACTION_VIEW_CELLWALL = 'com.tigeroakes.cellwallclient.VIEW';

/**
 * Returns an ADB client for each device connected to the server.
 */
export async function getClients() {
    const adb = await ADB.createADB();
    const devices = await adb.getConnectedDevices();
    return await Promise.all(
        devices.map(async device => {
            const adb = await ADB.createADB();
            adb.setDevice(device);
            return { adb, device };
        }),
    );
}

interface IntentArgs {
    action?: string;
    data?: string;
}

/**
 * Fire an intent on the device to start an activity.
 *
 * @param adb ADB client corresponding to a device.
 * @param options.action The general action to be performed, such as
 * ACTION_VIEW, ACTION_EDIT, ACTION_MAIN, etc.
 * @param options.data The data to operate on, such as a person record in the
 * contacts database, expressed as a Uri.
 */
export function intent(adb: ADB, options: IntentArgs) {
    const args = ['am', 'start'];
    if (options.action) {
        args.push('-a', options.action);
    }
    if (options.data) {
        args.push('-d', options.data);
    }
    return adb.shell(args);
}
