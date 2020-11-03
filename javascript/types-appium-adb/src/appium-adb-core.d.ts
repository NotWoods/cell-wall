import { EventEmitter } from 'events';

export const enum APP_INSTALL_STATE {
  UNKNOWN = 'unknown',
  NOT_INSTALLED = 'notInstalled',
  NEWER_VERSION_INSTALLED = 'newerVersionInstalled',
  SAME_VERSION_INSTALLED = 'sameVersionInstalled',
  OLDER_VERSION_INSTALLED = 'olderVersionInstalled',
}

export interface Log {
  timestamp: number;
  level: string;
  message: string;
}

export class Logcat extends EventEmitter {
  startCapture(): Promise<void>;
  outputHandler(output: string, prefix?: string): void;
  stopCapture(): Promise<void>;
  getLogs(): Log[];
  getAllLogs(): Log[];
  clear(): Promise<void>;
}

export interface ADBVersion {
  /** ADB version as a string. */
  versionString: string;
  /** Version number as float value (useful for comparison). */
  versionFloat: number;
  /** Major version number. */
  major: number;
  /** Minor version number. */
  minor: number;
  /** Patch version number. */
  patch: number | undefined;
}

export interface KeyboardState {
  /** Whether soft keyboard is currently visible. */
  isKeyboardShown: boolean;
  /** Whether the keyboard can be closed. */
  canCloseKeyboard: boolean;
}

export interface Location {
  /** Valid longitude value */
  longitude: number | string;
  /** Valid latitude value */
  latitude: number | string;
  /** Valid altitude value */
  altitude?: number | string;
}

export interface APKInfo {
  /** The name of application package, for example 'com.acme.app'. */
  apkPackage: string;
  /** The name of main application activity. */
  apkActivity: string;
}

export interface Device {
  /** The device udid. */
  udid: string;
  /** Current device state, as it is visible in _adb devices -l_ output. */
  state: string;
}

export interface ScreenrecordOptions {
  /**
   * The format is widthxheight.
   *                  The default value is the device's native display resolution (if supported),
   *                  1280x720 if not. For best results,
   *                  use a size supported by your device's Advanced Video Coding (AVC) encoder.
   *                  For example, "1280x720"
   */
  videoSize?: string;
  /**
   * Set it to `true` in order to display additional information on the video overlay,
   *                                  such as a timestamp, that is helpful in videos captured to illustrate bugs.
   *                                  This option is only supported since API level 27 (Android P).
   */
  bugReport?: boolean;
  /**
   * The maximum recording time, in seconds.
   *                                        The default (and maximum) value is 180 (3 minutes).
   */
  timeLimit?: string | number;
  /**
   * The video bit rate for the video, in megabits per second.
   *                The default value is 4. You can increase the bit rate to improve video quality,
   *                but doing so results in larger movie files.
   */
  bitRate?: string | number;
}

export interface StartAppOptions {
  /** The name of the main application activity */
  activity: string;
  /** The name of the application package */
  pkg: string;
  /**
   * @default [true] - If this property is set to `true`
   * and the activity name does not start with '.' then the method
   * will try to add the missing dot and start the activity once more
   * if the first startup try fails.
   */
  retry?: boolean;
  /**
   * @default [true] - Set it to `true` in order to forcefully
   * stop the activity if it is already running.
   */
  stopApp?: boolean;
  /**
   * The name of the package to wait to on startup
   * (this only makes sense if this name is different from the one,
   * which is set as `pkg`)
   */
  waitPkg?: string;
  /**
   * The name of the activity to wait to on startup
   * (this only makes sense if this name is different from the one,
   * which is set as `activity`)
   */
  waitActivity?: string;
  /**
   * The number of milliseconds to wait until the
   * `waitActivity` is focused
   */
  waitDuration?: string;
  /**
   * The number of the user profile to start
   * the given activity with. The default OS user profile (usually zero) is used
   * when this property is unset
   */
  user?: string | number;
}

export interface PackageActivityInfo {
  /** The name of application package, for example 'com.acme.app'. */
  appPackage: string | null;
  /** The name of main application activity. */
  appActivity: string | null;
}

export interface InstallOptions {
  /**
   * @default [60000] The count of milliseconds to wait until the
   * app is installed.
   */
  timeout?: number;
  /**
   * @default [false] Set to true in order to allow test
   * packages installation.
   */
  allowTestPackages?: boolean;
  /**
   * @default [false] Set to true to install the app on sdcard
   * instead of the device memory.
   */
  useSdcard?: false;
  /**
   * @default [false] Set to true in order to grant all the
   * permissions requested in the application's manifest
   * automatically after the installation is completed
   * under Android 6+.
   */
  grantPermissions?: boolean;
  /**
   * @default [true] Set it to false if you don't want
   * the application to be upgraded/reinstalled
   * if it is already present on the device.
   */
  replace?: boolean;
}

export interface InstallOrUpgradeOptions {
  /**
   * @default [60000] The count of milliseconds to wait until the
   * app is installed.
   */
  timeout?: number;
  /**
   * @default [false] Set to true in order to allow test
   * packages installation.
   */
  allowTestPackages?: boolean;
  /**
   * @default [false] Set to true to install the app on sdcard
   * instead of the device memory.
   */
  useSdcard?: false;
  /**
   * @default [false] Set to true in order to grant all the
   * permissions requested in the application's manifest
   * automatically after the installation is completed
   * under Android 6+.
   */
  grantPermissions?: boolean;
  /**
   * @default [false] Set to `true` in order to always prefer
   * the current build over any installed packages having
   * the same identifier
   */
  enforceCurrentBuild?: boolean;
}

export interface InstallOrUpgradeResult {
  /**
   * Equals to `true` if the target app has been uninstalled
   * before being installed
   */
  wasUninstalled: boolean;
  /**
   * One of `adb.APP_INSTALL_STATE` states, which reflects
   * the state of the application before being installed.
   */
  appState: APP_INSTALL_STATE;
}

export interface UninstallOptions {
  /**
   * @default [20000] The count of milliseconds to wait until the
   * app is uninstalled.
   */
  timeout?: number;
  /**
   * @default [false] Set to true in order to keep the
   * application data and cache folders after uninstall.
   */
  keepData?: boolean;
}

export interface InstallApksOptions {
  /**
   * @default [20000] The count of milliseconds to wait until the
   * installation is completed
   */
  timeout?: number;
  /**
   * @default [false] Set to true in order to allow test
   * packages installation.
   */
  allowTestPackages?: boolean;
  /**
   * @default [false] Set to true to install the app on sdcard
   * instead of the device memory.
   */
  useSdcard?: false;
  /**
   * @default [false] Set to true in order to grant all the
   * permissions requested in the application's manifest
   * automatically after the installation is completed
   * under Android 6+.
   */
  grantPermissions?: boolean;
}

export interface AppInfo {
  /**
   * Package name, for example 'com.acme.app'.
   */
  name: string;
  /**
   * Version code.
   */
  versionCode: number;
  /**
   * Version name, for example '1.0'.
   */
  versionName: string;
}
