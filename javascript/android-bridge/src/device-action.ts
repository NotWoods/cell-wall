import ADB from 'appium-adb';

const POWER_BUTTON = 26;

/**
 * Checks if an Android device is on.
 */
export async function checkIfOn(
  adb: ADB,
  cmdOutput: string | undefined = undefined,
) {
  const stdout = cmdOutput || (await adb.shell(['dumpsys', 'power']));
  const wakefulness = /mWakefulness=(\w+)/.exec(stdout)?.[1];
  return wakefulness === 'Awake';
}

/**
 * Press the power button on the given Android device.
 */
export async function togglePower(adb: ADB) {
  await adb.keyevent(POWER_BUTTON);
}
