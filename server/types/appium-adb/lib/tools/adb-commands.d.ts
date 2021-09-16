import { SubProcess, TeenProcessExecOptions } from '../../teen_process';
import { Log } from '../logcat';

export interface KeyboardState {
  /** Whether soft keyboard is currently visible. */
  isKeyboardShown: boolean;
  /** Whether the keyboard can be closed. */
  canCloseKeyboard: boolean;
}

export interface LogcatOpts {
  /**
   * The log print format, where <format> is one of:
   *   brief process tag thread raw time threadtime long
   * `threadtime` is the default value.
   */
  format?: string;
  /**
   * Series of <tag>[:priority]
   * where <tag> is a log component tag (or * for all) and priority is:
   *  V    Verbose
   *  D    Debug
   *  I    Info
   *  W    Warn
   *  E    Error
   *  F    Fatal
   *  S    Silent (supress all output)
   *
   * '*' means '*:d' and <tag> by itself means <tag>:v
   *
   * If not specified on the commandline, filterspec is set from ANDROID_LOG_TAGS.
   * If no filterspec is found, filter defaults to '*:I'
   */
  filterSpecs?: ReadonlyArray<string>;
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

export interface SetPropOptions {
  /**
   * Do we run setProp as a privileged command?
   * @default true
   */
  privileged?: boolean;
}

declare const methods: AdbCommands;
export default methods;

interface AdbCommands {
  /**
   * Get the path to adb executable amd assign it
   * to this.executable.path and this.binaries.adb properties.
   *
   * @return {string} Full path to adb executable.
   */
  getAdbWithCorrectAdbPath(): Promise<string>;

  /**
   * Get the full path to aapt tool and assign it to
   * this.binaries.aapt property
   */
  initAapt(): Promise<void>;

  /**
   * Get the full path to zipalign tool and assign it to
   * this.binaries.zipalign property
   */
  initZipAlign(): Promise<void>;

  /**
   * Get the full path to bundletool binary and assign it to
   * this.binaries.bundletool property
   */
  initBundletool(): Promise<void>;

  /**
   * Retrieve the API level of the device under test.
   *
   * @return {number} The API level as integer number, for example 21 for
   *                  Android Lollipop. The result of this method is cached, so all the further
   * calls return the same value as the first one.
   */
  getApiLevel(): Promise<number>;

  /**
   * Retrieve the platform version of the device under test.
   *
   * @return {string} The platform version as a string, for example '5.0' for
   * Android Lollipop.
   */
  getPlatformVersion(): Promise<string>;

  /**
   * Verify whether a device is connected.
   *
   * @return {boolean} True if at least one device is visible to adb.
   */
  isDeviceConnected(): Promise<boolean>;

  /**
   * Recursively create a new folder on the device under test.
   *
   * @param {string} remotePath - The new path to be created.
   * @return {string} mkdir command output.
   */
  mkdir(remotePath: string): Promise<string>;

  /**
   * Verify whether the given argument is a
   * valid class name.
   *
   * @param {string} classString - The actual class name to be verified.
   * @return {?Array.<Match>} The result of Regexp.exec operation
   *                          or _null_ if no matches are found.
   */
  isValidClass(classString: string): RegExpExecArray | null;

  /**
   * Force application to stop on the device under test.
   *
   * @param {string} pkg - The package name to be stopped.
   * @return {string} The output of the corresponding adb command.
   */
  forceStop(pkg: string): Promise<string>;

  /**
   * Kill application
   *
   * @param {string} pkg - The package name to be stopped.
   * @return {string} The output of the corresponding adb command.
   */
  killPackage(pkg: string): Promise<string>;

  /**
   * Clear the user data of the particular application on the device
   * under test.
   *
   * @param {string} pkg - The package name to be cleared.
   * @return {string} The output of the corresponding adb command.
   */
  clear(pkg: string): Promise<string>;

  /**
   * Grant all permissions requested by the particular package.
   * This method is only useful on Android 6.0+ and for applications
   * that support components-based permissions setting.
   *
   * @param {string} pkg - The package name to be processed.
   * @param {string} apk - The path to the actual apk file.
   * @throws {Error} If there was an error while granting permissions
   */
  grantAllPermissions(pkg: string, apk: string): Promise<void>;

  /**
   * Grant multiple permissions for the particular package.
   * This call is more performant than `grantPermission` one, since it combines
   * multiple `adb shell` calls into a single command.
   *
   * @param {string} pkg - The package name to be processed.
   * @param {Array<string>} permissions - The list of permissions to be granted.
   * @throws {Error} If there was an error while changing permissions.
   */
  grantPermissions(
    pkg: string,
    permissions: ReadonlyArray<string>,
  ): Promise<void>;

  /**
   * Grant single permission for the particular package.
   *
   * @param {string} pkg - The package name to be processed.
   * @param {string} permission - The full name of the permission to be granted.
   * @throws {Error} If there was an error while changing permissions.
   */
  grantPermission(pkg: string, permission: string): Promise<void>;

  /**
   * Revoke single permission from the particular package.
   *
   * @param {string} pkg - The package name to be processed.
   * @param {string} permission - The full name of the permission to be revoked.
   * @throws {Error} If there was an error while changing permissions.
   */
  revokePermission(pkg: string, permission: string): Promise<void>;

  /**
   * Retrieve the list of granted permissions for the particular package.
   *
   * @param {string} pkg - The package name to be processed.
   * @param {string} cmdOutput [null] - Optional parameter containing command output of
   *                                    _dumpsys package_ command. It may speed up the method execution.
   * @return {Array<String>} The list of granted permissions or an empty list.
   * @throws {Error} If there was an error while changing permissions.
   */
  getGrantedPermissions(
    pkg: string,
    cmdOutput?: string | null,
  ): Promise<string[]>;

  /**
   * Retrieve the list of denied permissions for the particular package.
   *
   * @param {string} pkg - The package name to be processed.
   * @param {string} cmdOutput [null] - Optional parameter containing command output of
   *                                    _dumpsys package_ command. It may speed up the method execution.
   * @return {Array<String>} The list of denied permissions or an empty list.
   */
  getDeniedPermissions(
    pkg: string,
    cmdOutput?: string | null,
  ): Promise<string[]>;

  /**
   * Retrieve the list of requested permissions for the particular package.
   *
   * @param {string} pkg - The package name to be processed.
   * @param {string} cmdOutput [null] - Optional parameter containing command output of
   *                                    _dumpsys package_ command. It may speed up the method execution.
   * @return {Array<String>} The list of requested permissions or an empty list.
   */
  getReqPermissions(pkg: string, cmdOutput?: string | null): Promise<string[]>;

  /**
   * Retrieve the list of location providers for the device under test.
   *
   * @return {Array.<String>} The list of available location providers or an empty list.
   */
  getLocationProviders(): Promise<string[]>;

  /**
   * Toggle the state of GPS location provider.
   *
   * @param {boolean} enabled - Whether to enable (true) or disable (false) the GPS provider.
   */
  toggleGPSLocationProvider(enabled: boolean): Promise<void>;

  /**
   * Set hidden api policy to manage access to non-SDK APIs.
   * https://developer.android.com/preview/restrictions-non-sdk-interfaces
   *
   * @param {number|string} value - The API enforcement policy.
   *     0: Disable non-SDK API usage detection. This will also disable logging, and also break the strict mode API,
   *        detectNonSdkApiUsage(). Not recommended.
   *     1: "Just warn" - permit access to all non-SDK APIs, but keep warnings in the log.
   *        The strict mode API will keep working.
   *     2: Disallow usage of dark grey and black listed APIs.
   *     3: Disallow usage of blacklisted APIs, but allow usage of dark grey listed APIs.
   */
  setHiddenApiPolicy(value: number | string): Promise<void>;

  /**
   * Reset access to non-SDK APIs to its default setting.
   * https://developer.android.com/preview/restrictions-non-sdk-interfaces
   */
  setDefaultHiddenApiPolicy(): Promise<void>;

  /**
   * Stop the particular package if it is running and clears its application data.
   *
   * @param {string} pkg - The package name to be processed.
   */
  stopAndClear(pkg: string): Promise<void>;

  /**
   * Retrieve the list of available input methods (IMEs) for the device under test.
   *
   * @return {Array.<String>} The list of IME names or an empty list.
   */
  availableIMEs(): Promise<string[]>;

  /**
   * Retrieve the list of enabled input methods (IMEs) for the device under test.
   *
   * @return {Array.<String>} The list of enabled IME names or an empty list.
   */
  enabledIMEs(): Promise<string[]>;

  /**
   * Enable the particular input method on the device under test.
   *
   * @param {string} imeId - One of existing IME ids.
   */
  enableIME(imeId: string): Promise<void>;

  /**
   * Disable the particular input method on the device under test.
   *
   * @param {string} imeId - One of existing IME ids.
   */
  disableIME(imeId: string): Promise<void>;

  /**
   * Set the particular input method on the device under test.
   *
   * @param {string} imeId - One of existing IME ids.
   */
  setIME(imeId: string): Promise<void>;

  /**
   * Get the default input method on the device under test.
   *
   * @return {string} The name of the default input method.
   */
  defaultIME(): Promise<string>;

  /**
   * Send the particular keycode to the device under test.
   *
   * @param {string|number} keycode - The actual key code to be sent.
   */
  keyevent(keycode: string | number): Promise<void>;

  /**
   * Send the particular text to the device under test.
   *
   * @param {string} text - The actual text to be sent.
   */
  inputText(text: string): Promise<void>;

  /**
   * Clear the active text field on the device under test by sending
   * special keyevents to it.
   *
   * @param {number} length [100] - The maximum length of the text in the field to be cleared.
   */
  clearTextField(length?: number): Promise<void>;

  /**
   * Send the special keycode to the device under test in order to lock it.
   */
  lock(): Promise<void>;

  /**
   * Send the special keycode to the device under test in order to emulate
   * Back button tap.
   */
  back(): Promise<void>;

  /**
   * Send the special keycode to the device under test in order to emulate
   * Home button tap.
   */
  goToHome(): Promise<void>;

  /**
   * @return {string} the actual path to adb executable.
   */
  getAdbPath(): string;

  /**
   * Retrieve current screen orientation of the device under test.
   *
   * @return {number} The current orientation encoded as an integer number.
   */
  getScreenOrientation(): Promise<number>;

  /**
   * Retrieve the screen lock state of the device under test.
   *
   * @return {boolean} True if the device is locked.
   */
  isScreenLocked(): Promise<boolean>;

  /**
   * Retrieve the state of the software keyboard on the device under test.
   *
   * @return {KeyboardState} The keyboard state.
   */
  isSoftKeyboardPresent(): Promise<KeyboardState>;

  /**
   * Send an arbitrary Telnet command to the device under test.
   *
   * @param {string} command - The command to be sent.
   *
   * @return {string} The actual output of the given command.
   */
  sendTelnetCommand(command: string): Promise<string>;

  /**
   * Check the state of Airplane mode on the device under test.
   *
   * @return {boolean} True if Airplane mode is enabled.
   */
  isAirplaneModeOn(): Promise<boolean>;

  /**
   * Change the state of Airplane mode in Settings on the device under test.
   *
   * @param {boolean} on - True to enable the Airplane mode in Settings and false to disable it.
   */
  setAirplaneMode(on: boolean): Promise<void>;

  /**
   * Broadcast the state of Airplane mode on the device under test.
   * This method should be called after {@link #setAirplaneMode}, otherwise
   * the mode change is not going to be applied for the device.
   *
   * @param {boolean} on - True to broadcast enable and false to broadcast disable.
   */
  broadcastAirplaneMode(on: boolean): Promise<void>;

  /**
   * Check the state of WiFi on the device under test.
   *
   * @return {boolean} True if WiFi is enabled.
   */
  isWifiOn(): Promise<boolean>;

  /**
   * Change the state of WiFi on the device under test.
   *
   * @param {boolean} on - True to enable and false to disable it.
   * @param {boolean} isEmulator [false] - Set it to true if the device under test
   *                                       is an emulator rather than a real device.
   */
  setWifiState(on: boolean, isEmulator?: boolean): Promise<void>;

  /**
   * Check the state of Data transfer on the device under test.
   *
   * @return {boolean} True if Data transfer is enabled.
   */
  isDataOn(): Promise<boolean>;

  /**
   * Change the state of Data transfer on the device under test.
   *
   * @param {boolean} on - True to enable and false to disable it.
   * @param {boolean} isEmulator [false] - Set it to true if the device under test
   *                                       is an emulator rather than a real device.
   */
  setDataState(on: boolean, isEmulator?: boolean): Promise<void>;

  /**
   * Change the state of WiFi and/or Data transfer on the device under test.
   *
   * @param {boolean} wifi - True to enable and false to disable WiFi.
   * @param {boolean} data - True to enable and false to disable Data transfer.
   * @param {boolean} isEmulator [false] - Set it to true if the device under test
   *                                       is an emulator rather than a real device.
   */
  setWifiAndData(
    options: { wifi?: boolean; data?: boolean },
    isEmulator?: boolean,
  ): Promise<void>;

  /**
   * Change the state of animation on the device under test.
   * Animation on the device is controlled by the following global properties:
   * [ANIMATOR_DURATION_SCALE]{@link https://developer.android.com/reference/android/provider/Settings.Global.html#ANIMATOR_DURATION_SCALE},
   * [TRANSITION_ANIMATION_SCALE]{@link https://developer.android.com/reference/android/provider/Settings.Global.html#TRANSITION_ANIMATION_SCALE},
   * [WINDOW_ANIMATION_SCALE]{@link https://developer.android.com/reference/android/provider/Settings.Global.html#WINDOW_ANIMATION_SCALE}.
   * This method sets all this properties to 0.0 to disable (1.0 to enable) animation.
   *
   * Turning off animation might be useful to improve stability
   * and reduce tests execution time.
   *
   * @param {boolean} on - True to enable and false to disable it.
   */
  setAnimationState(on: boolean): Promise<void>;

  /**
   * Check the state of animation on the device under test.
   *
   * @return {boolean} True if at least one of animation scale settings
   *                   is not equal to '0.0'.
   */
  isAnimationOn(): Promise<boolean>;

  /**
   * Forcefully recursively remove a path on the device under test.
   * Be careful while calling this method.
   *
   * @param {string} path - The path to be removed recursively.
   */
  rimraf(path: string): Promise<void>;

  /**
   * Send a file to the device under test.
   *
   * @param {string} localPath - The path to the file on the local file system.
   * @param {string} remotePath - The destination path on the remote device.
   * @param {object} opts - Additional options mapping. See
   *                        https://github.com/appium/node-teen_process,
   *                        _exec_ method options, for more information about available
   *                        options.
   */
  push(
    localPath: string,
    remotePath: string,
    opts?: TeenProcessExecOptions,
  ): Promise<void>;

  /**
   * Receive a file from the device under test.
   *
   * @param {string} remotePath - The source path on the remote device.
   * @param {string} localPath - The destination path to the file on the local file system.
   */
  pull(remotePath: string, localPath: string): Promise<void>;

  /**
   * Check whether the process with the particular name is running on the device
   * under test.
   *
   * @param {string} processName - The name of the process to be checked.
   * @return {boolean} True if the given process is running.
   * @throws {Error} If the given process name is not a valid class name.
   */
  processExists(processName: string): Promise<boolean>;

  /**
   * Get TCP port forwarding with adb on the device under test.
   * @return {Array.<String>} The output of the corresponding adb command. An array contains each forwarding line of output
   */
  getForwardList(): Promise<string[]>;

  /**
   * Setup TCP port forwarding with adb on the device under test.
   *
   * @param {string|number} systemPort - The number of the local system port.
   * @param {string|number} devicePort - The number of the remote device port.
   */
  forwardPort(
    systemPort: string | number,
    devicePort: string | number,
  ): Promise<void>;

  /**
   * Remove TCP port forwarding with adb on the device under test. The forwarding
   * for the given port should be setup with {@link #forwardPort} first.
   *
   * @param {string|number} systemPort - The number of the local system port
   *                                     to remove forwarding on.
   */
  removePortForward(systemPort: string | number): Promise<void>;

  /**
   * Get TCP port forwarding with adb on the device under test.
   * @return {Array.<String>} The output of the corresponding adb command. An array contains each forwarding line of output
   */
  getReverseList(): Promise<string[]>;

  /**
   * Setup TCP port forwarding with adb on the device under test.
   * Only available for API 21+.
   *
   * @param {string|number} devicePort - The number of the remote device port.
   * @param {string|number} systemPort - The number of the local system port.
   */
  reversePort(
    devicePort: string | number,
    systemPort: string | number,
  ): Promise<void>;

  /**
   * Remove TCP port forwarding with adb on the device under test. The forwarding
   * for the given port should be setup with {@link #forwardPort} first.
   *
   * @param {string|number} devicePort - The number of the remote device port
   *                                     to remove forwarding on.
   */
  removePortReverse(devicePort: string | number): Promise<void>;

  /**
   * Setup TCP port forwarding with adb on the device under test. The difference
   * between {@link #forwardPort} is that this method does setup for an abstract
   * local port.
   *
   * @param {string|number} systemPort - The number of the local system port.
   * @param {string|number} devicePort - The number of the remote device port.
   */
  forwardAbstractPort(
    systemPort: string | number,
    devicePort: string | number,
  ): Promise<void>;

  /**
   * Execute ping shell command on the device under test.
   *
   * @return {boolean} True if the command output contains 'ping' substring.
   * @throws {error} If there was an error while executing 'ping' command on the
   *                 device under test.
   */
  ping(): Promise<boolean>;

  /**
   * Restart the device under test using adb commands.
   *
   * @throws {error} If start fails.
   */
  restart(): Promise<void>;

  /**
   * Start the logcat process to gather logs.
   *
   * @throws {error} If restart fails.
   */
  startLogcat(opts?: LogcatOpts): Promise<void>;

  /**
   * Stop the active logcat process which gathers logs.
   * The call will be ignored if no logcat process is running.
   */
  stopLogcat(): Promise<void>;

  /**
   * Retrieve the output from the currently running logcat process.
   * The logcat process should be executed by {2link #startLogcat} method.
   *
   * @return {string} The collected logcat output.
   * @throws {Error} If logcat process is not running.
   */
  getLogcatLogs(): Log[];

  /**
   * Set the callback for the logcat output event.
   *
   * @param {Function} listener - The listener function, which accepts one argument. The argument is
   *                              a log record object with `timestamp`, `level` and `message` properties.
   * @throws {Error} If logcat process is not running.
   */
  setLogcatListener(listener: (outputObj: Log) => void): void;

  /**
   * Removes the previously set callback for the logcat output event.
   *
   * @param {Function} listener - The listener function, which has been previously
   *                              passed to `setLogcatListener`
   * @throws {Error} If logcat process is not running.
   */
  removeLogcatListener(listener: (outputObj: Log) => void): void;

  /**
   * Get the list of process ids for the particular process on the device under test.
   *
   * @param {string} name - The part of process name.
   * @return {Array.<number>} The list of matched process IDs or an empty list.
   */
  getPIDsByName(name: string): Promise<number[]>;

  /**
   * Get the list of process ids for the particular process on the device under test.
   *
   * @param {string} name - The part of process name.
   * @return {Array.<number>} The list of matched process IDs or an empty list.
   */
  killProcessesByName(name: string): Promise<void>;

  /**
   * Kill the particular process on the device under test.
   * The current user is automatically switched to root if necessary in order
   * to properly kill the process.
   *
   * @param {string|number} pid - The ID of the process to be killed.
   * @return {string} Kill command stdout.
   * @throws {Error} If the process with given ID is not present or cannot be killed.
   */
  killProcessByPID(pid: string | number): Promise<string>;

  /**
   * Broadcast process killing on the device under test.
   *
   * @param {string} intent - The name of the intent to broadcast to.
   * @param {string} processName - The name of the killed process.
   * @throws {error} If the process was not killed.
   */
  broadcastProcessEnd(intent: string, processName: string): Promise<void>;

  /**
   * Broadcast a message to the given intent.
   *
   * @param {string} intent - The name of the intent to broadcast to.
   * @throws {error} If intent name is not a valid class name.
   */
  broadcast(intent: string): Promise<void>;

  /**
   * Kill Android instruments if they are currently running.
   */
  endAndroidCoverage(): Promise<void>;

  /**
   * Instrument the particular activity.
   *
   * @param {string} pkg - The name of the package to be instrumented.
   * @param {string} activity - The name of the main activity in this package.
   * @param {string} instrumentWith - The name of the package to instrument
   *                                  the activity with.
   * @throws {error} If any exception is reported by adb shell.
   */
  instrument(
    pkg: string,
    activity: string,
    instrumentWith: string,
  ): Promise<void>;

  /**
   * Collect Android coverage by instrumenting the particular activity.
   *
   * @param {string} instrumentClass - The name of the instrumentation class.
   * @param {string} waitPkg - The name of the package to be instrumented.
   * @param {string} waitActivity - The name of the main activity in this package.
   *
   * @return {promise} The promise is successfully resolved if the instrumentation starts
   *                   without errors.
   */
  androidCoverage(
    instrumentClass: string,
    waitPkg: string,
    waitActivity: string,
  ): Promise<void>;

  /**
   * Get the particular property of the device under test.
   *
   * @param {string} property - The name of the property. This name should
   *                            be known to _adb shell getprop_ tool.
   *
   * @return {string} The value of the given property.
   */
  getDeviceProperty(property: string): Promise<string>;

  /**
   * Set the particular property of the device under test.
   *
   * @param {string} property - The name of the property. This name should
   *                            be known to _adb shell setprop_ tool.
   * @param {string} val - The new property value.
   *
   * @throws {error} If _setprop_ utility fails to change property value.
   */
  setDeviceProperty(
    prop: string,
    val: string,
    opts?: SetPropOptions,
  ): Promise<void>;

  /**
   * @return {string} Current system language on the device under test.
   */
  getDeviceSysLanguage(): Promise<string>;

  /**
   * @return {string} Current country name on the device under test.
   */
  getDeviceSysCountry(): Promise<string>;

  /**
   * @return {string} Current system locale name on the device under test.
   */
  getDeviceSysLocale(): Promise<string>;

  /**
   * @return {string} Current product language name on the device under test.
   */
  getDeviceProductLanguage(): Promise<string>;

  /**
   * @return {string} Current product country name on the device under test.
   */
  getDeviceProductCountry(): Promise<string>;

  /**
   * @return {string} Current product locale name on the device under test.
   */
  getDeviceProductLocale(): Promise<string>;

  /**
   * @return {string} The model name of the device under test.
   */
  getModel(): Promise<string>;

  /**
   * @return {string} The manufacturer name of the device under test.
   */
  getManufacturer(): Promise<string>;

  /**
   * Get the current screen size.
   *
   * @return {string} Device screen size as string in format 'WxH' or
   *                  _null_ if it cannot be determined.
   */
  getScreenSize(): Promise<string | null>;

  /**
   * Get the current screen density in dpi
   *
   * @return {?number} Device screen density as a number or _null_ if it
   *                  cannot be determined
   */
  getScreenDensity(): Promise<number | null>;

  /**
   * Setup HTTP proxy in device global settings.
   * Read https://android.googlesource.com/platform/frameworks/base/+/android-9.0.0_r21/core/java/android/provider/Settings.java for each property
   *
   * @param {string} proxyHost - The host name of the proxy.
   * @param {string|number} proxyPort - The port number to be set.
   */
  setHttpProxy(proxyHost: string, proxyPort: string | number): Promise<void>;

  /**
   * Delete HTTP proxy in device global settings.
   * Rebooting the test device is necessary to apply the change.
   */
  deleteHttpProxy(): Promise<void>;

  /**
   * Set device property.
   * [android.provider.Settings]{@link https://developer.android.com/reference/android/provider/Settings.html}
   *
   * @param {string} namespace - one of {system, secure, global}, case-insensitive.
   * @param {string} setting - property name.
   * @param {string|number} value - property value.
   * @return {string} command output.
   */
  setSetting(
    namespace: string,
    setting: string,
    value: string | number,
  ): Promise<string>;

  /**
   * Get device property.
   * [android.provider.Settings]{@link https://developer.android.com/reference/android/provider/Settings.html}
   *
   * @param {string} namespace - one of {system, secure, global}, case-insensitive.
   * @param {string} setting - property name.
   * @return {string} property value.
   */
  getSetting(namespace: string, setting: string): Promise<string>;

  /**
   * Retrieve the `adb bugreport` command output. This
   * operation may take up to several minutes.
   *
   * @param {?number} timeout [120000] - Command timeout in milliseconds
   * @returns {string} Command stdout
   */
  bugreport(timeout?: number): Promise<string>;

  /**
   * Initiate screenrecord utility on the device
   *
   * @param {string} destination - Full path to the writable media file destination
   *                               on the device file system.
   * @param {?ScreenrecordOptions} options [{}]
   * @returns {SubProcess} screenrecord process, which can be then controlled by the client code
   */
  screenrecord(destination: string, options?: ScreenrecordOptions): SubProcess;

  /**
   * Performs the given editor action on the focused input field.
   * This method requires Appium Settings helper to be installed on the device.
   * No exception is thrown if there was a failure while performing the action.
   * You must investigate the logcat output if something did not work as expected.
   *
   * @param {string|number} action - Either action code or name. The following action
   *                                 names are supported: `normal, unspecified, none,
   *                                 go, search, send, next, done, previous`
   */
  performEditorAction(action: string | number): Promise<void>;
}
