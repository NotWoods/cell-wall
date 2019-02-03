import { EventEmitter } from 'events';

export interface ADBOptions {
    sdkRoot: string;
    udid: string;
    appDeviceReadyTimeout: number;
    useKeystore: boolean;
    keystorePath: string;
    keystorePassword: string;
    keyAlias: string;
    keyPassword: string;
    executable: { path?: string; defaultArgs?: string[] };
    tmpDir: string;
    curDeviceId: string;
    emulatorPort: number;
    logcat: Logcat;
    binaries: { [binaryName: string]: string };
    instrumentProc: any;
    suppressKillServer: boolean;
    jars: { [jarName: string]: string };
    helperJarPath: string;
    adbPort: number;
    adbExecTimeout: number;
    remoteAdbHost: boolean;
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

export interface TeenProcessExecOptions {
    cwd?: string;
    env?: { [envVar: string]: string };
    timeout?: number;
    killSignal?: string;
    encoding?: string;
    ignoreOutput?: boolean;
    stdio?: string;
    isBuffer?: boolean;
    shell?: boolean;
}

export interface ShellExecOptions extends TeenProcessExecOptions {
    /** @default [falsy] Whether to run the given command as root. */
    privileged?: boolean;
    /** @default [falsy] Whether to keep root mode after command execution is completed. */
    keepPrivileged?: boolean;
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

export class ADB {
    static createADB(opts?: Partial<ADBOptions>): Promise<ADB>;
    initJars(): void;
    private constructor(opts?: Partial<ADBOptions>);
    adbPort: number;

    /**
     * Get the path to adb executable amd assign it
     * to this.executable.path and this.binaries.adb properties.
     *
     * @return {string} Full path to adb executable.
     */
    getAdbWithCorrectAdbPath(): Promise<string>;

    /**
     * Get the adb version. The result of this method is cached.
     *
     * @return {ADBVersion} The current adb version.
     * @throws {Error} If it is not possible to parse adb version.
     */
    getAdbVersion(): Promise<ADBVersion>;

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
     * Retrieve the API level of the device under test.
     *
     * @return {number} The API level as integer number, for example 21 for
     * Android Lollipop. The result of this method is cached, so all the further
     * calls return the same value as the first one.
     */
    getApiLevel(): Promise<number>;

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
     * Verify whether the given argument is a valid class name.
     *
     * @param classString - The actual class name to be verified.
     * @return The result of Regexp.exec operation
     * or _null_ if no matches are found.
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
     * Clear the user data of the particular application on the device
     * under test.
     *
     * @param {string} pkg - The package name to be cleared.
     * @return {string} The output of the corresponding adb command.
     */
    clear(pkg: string): Promise<string>;

    /**
     * Stop the particular package if it is running and clears its application data.
     *
     * @param {string} pkg - The package name to be processed.
     */
    stopAndClear(pkg: string): Promise<string>;

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
    enabledIMEs(): Promise<string>;

    /**
     * Enable the particular input method on the device under test.
     *
     * @param {string} imeId - One of existing IME ids.
     */
    enableIME(imeId: string): Promise<string>;

    /**
     * Disable the particular input method on the device under test.
     *
     * @param {string} imeId - One of existing IME ids.
     */
    disableIME(imeId: string): Promise<string>;

    /**
     * Set the particular input method on the device under test.
     *
     * @param {string} imeId - One of existing IME ids.
     */
    setIME(imeId: string): Promise<string>;

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
    keyevent(keycode: string | number): Promise<string>;

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
     * @param {boolean} on True to enable the Airplane mode in Settings and
     * false to disable it.
     */
    setAirplaneMode(on: boolean): Promise<void>;

    /**
     * Broadcast the state of Airplane mode on the device under test.
     * This method should be called after {@link #setAirplaneMode}, otherwise
     * the mode change is not going to be applied for the device.
     *
     * @param {boolean} on True to broadcast enable and false to broadcast disable.
     */
    broadcastAirplaneMode(on: boolean): Promise<void>;

    /**
     * Check the state of WiFi on the device under test.
     *
     * @return {boolean} True if WiFi is enabled.
     */
    isWifiOn(): Promise<boolean>;

    /**
     * Get the current screen size.
     *
     * @return {string} Device screen size as string in format 'WxH' or
     * _null_ if it cannot be determined.
     */
    getScreenSize(): Promise<string | null>;

    /**
     * Get the current screen density in dpi
     *
     * @return {?number} Device screen density as a number or _null_ if it
     * cannot be determined
     */
    getScreenDensity(): Promise<number | null>;

    /**
     * Change the state of WiFi on the device under test.
     *
     * @param {boolean} on True to enable and false to disable it.
     * @param {boolean} isEmulator Set it to true if the device under test
     * is an emulator rather than a real device.
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
     * @param {boolean} on True to enable and false to disable it.
     * @param {boolean} isEmulator Set it to true if the device under test
     * is an emulator rather than a real device.
     */
    setDataState(on: boolean, isEmulator?: boolean): Promise<void>;

    /**
     * Change the state of WiFi and/or Data transfer on the device under test.
     *
     * @param {boolean} wifi True to enable and false to disable WiFi.
     * @param {boolean} data True to enable and false to disable Data transfer.
     * @param {boolean} isEmulator Set it to true if the device under test
     * is an emulator rather than a real device.
     */
    setWifiAndData(
        opts: { wifi: boolean; data: boolean },
        isEmulator?: boolean,
    ): Promise<void>;

    /**
     * Forcefully recursively remove a path on the device under test.
     * Be careful while calling this method.
     *
     * @param {string} path The path to be removed recursively.
     */
    rimraf(path: string): Promise<void>;

    /**
     * Send a file to the device under test.
     *
     * @param {string} localPath The path to the file on the local file system.
     * @param {string} remotePath The destination path on the remote device.
     * @param {object} opts Additional options mapping. See
     * https://github.com/appium/node-teen_process,
     * _exec_ method options, for more information about available
     * options.
     */
    push(
        localPath: string,
        remotePath: string,
        opts?: TeenProcessExecOptions,
    ): Promise<void>;

    /**
     * Receive a file from the device under test.
     *
     * @param {string} remotePath The source path on the remote device.
     * @param {string} localPath The destination path to the file on the local file system.
     */
    pull(remotePath: string, localPath: string): Promise<void>;

    /**
     * Check whether the process with the particular name is running on the device
     * under test.
     *
     * @param {string} processName The name of the process to be checked.
     * @return {boolean} True if the given process is running.
     * @throws {Error} If the given process name is not a valid class name.
     */
    processExists(processName: string): Promise<boolean>;

    /**
     * Setup TCP port forwarding with adb on the device under test.
     *
     * @param {string|number} systemPort The number of the local system port.
     * @param {string|number} devicePort The number of the remote device port.
     */
    forwardPort(
        systemPort: string | number,
        devicePort: string | number,
    ): Promise<void>;

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
    ping(): Promise<true>;

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
    startLogcat(): Promise<void>;

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
     * Get the list of process ids for the particular process on the device under test.
     *
     * @param {string} name The part of process name.
     * @return {Array.<number>} The list of matched process IDs or an empty list.
     */
    getPIDsByName(name: string): Promise<number[]>;

    /**
     * Get the list of process ids for the particular process on the device under test.
     *
     * @param {string} name The part of process name.
     * @return {Array.<number>} The list of matched process IDs or an empty list.
     */
    killProcessesByName(name: string): Promise<void>;

    /**
     * Kill the particular process on the device under test.
     * The current user is automatically switched to root if necessary in order
     * to properly kill the process.
     *
     * @param {string|number} pid The ID of the process to be killed.
     * @return {string} Kill command stdout.
     * @throws {Error} If the process with given ID is not present or cannot be killed.
     */
    killProcessByPID(pid: string | number): Promise<void>;

    /**
     * Broadcast process killing on the device under test.
     *
     * @param {string} intent The name of the intent to broadcast to.
     * @param {string} processName The name of the killed process.
     * @throws {error} If the process was not killed.
     */
    broadcastProcessEnd(intent: string, processName: string): Promise<void>;

    /**
     * Broadcast a message to the given intent.
     *
     * @param {string} intent The name of the intent to broadcast to.
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
     * @param {string} pkg The name of the package to be instrumented.
     * @param {string} activity The name of the main activity in this package.
     * @param {string} instrumentWith The name of the package to instrument
     * the activity with.
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
     * @param {string} instrumentClass The name of the instrumentation class.
     * @param {string} waitPkg The name of the package to be instrumented.
     * @param {string} waitActivity The name of the main activity in this package.
     *
     * @return {promise} The promise is successfully resolved if the instrumentation starts
     * without errors.
     */
    androidCoverage(
        instrumentClass: string,
        waitPkg: string,
        waitActivity: string,
    ): Promise<void>;

    processFromManifest(localApk: string): Promise<string | null>;

    /**
     * Extract package and main activity name from application manifest.
     *
     * @param {string} appPath - The full path to application .apk(s) package
     * @return {APKInfo} The parsed application info.
     * @throws {error} If there was an error while getting the data from the given
     *                 application package.
     */
    packageAndLaunchActivityFromManifest(appPath: string): Promise<APKInfo>;

    /**
     * Create binary representation of package manifest (usually AndroidManifest.xml).
     * `${manifest}.apk` file will be created as the result of this method
     * containing the compiled manifest.
     *
     * @param {string} manifest - Full path to the initial manifest template
     * @param {string} manifestPackage - The name of the manifest package
     * @param {string} targetPackage - The name of the destination package
     */
    compileManifest(
        manifest: string,
        manifestPackage: string,
        targetPackage: string,
    ): Promise<void>;

    /**
     * Replace/insert the specially precompiled manifest file into the
     * particular package.
     *
     * @param {string} manifest - Full path to the precompiled manifest
     *                            created by `compileManifest` method call
     *                            without .apk extension
     * @param {string} srcApk - Full path to the existing valid application package, where
     *                          this manifest has to be insetred to. This package
     *                          will NOT be modified.
     * @param {string} dstApk - Full path to the resulting package.
     *                          The file will be overriden if it already exists.
     */
    insertManifest(
        manifest: string,
        srcApk: string,
        dstApk: string,
    ): Promise<void>;

    /**
     * Check whether package manifest contains Internet permissions.
     *
     * @param {string} appPath - The full path to .apk(s) package.
     * @return {boolean} True if the manifest requires Internet access permission.
     */
    hasInternetPermissionFromManifest(appPath: string): Promise<boolean>;

    /**
     * Retrieve full path to the given binary.
     *
     * @param {string} binaryName - The name of the binary.
     * @return {string} Full path to the given binary including current SDK root.
     */
    getSdkBinaryPath(binaryName: string): Promise<string>;

    /**
     * Retrieve the name of the tool,
     * which prints full path to the given command shortcut.
     *
     * @return {string} Depending on the current platform this is
     * supposed to be either 'which' or 'where'.
     */
    getCommandForOS(): 'where' | 'which';

    /**
     * Retrieve full path to the given binary.
     *
     * @param {string} binaryName Simple name of a binary file.
     * @return {string} Full path to the given binary. The method tries
     * to enumerate all the known locations where the binary
     * might be located and stops the search as soon as the first
     * match is found on the local file system.
     * @throws {Error} If the binary with given name is not present at any
     * of known locations or Android SDK is not installed on the
     * local file system.
     */
    getBinaryFromSdkRoot(binaryName: string): Promise<string>;

    /**
     * Retrieve full path to a binary file using the standard system lookup tool.
     *
     * @param {string} binaryName The name of the binary.
     * @return {string} Full path to the binary received from 'which'/'where'
     * output.
     * @throws {Error} If lookup tool returns non-zero return code.
     */
    getBinaryFromPath(binaryName: string): Promise<string>;

    /**
     * @typedef {Object} Device
     * @property {string} udid - The device udid.
     * @property {string} state - Current device state, as it is visible in
     *                            _adb devices -l_ output.
     */

    /**
     * Retrieve the list of devices visible to adb.
     *
     * @return {Array.<Device>} The list of devices or an empty list if
     *                          no devices are connected.
     * @throws {Error} If there was an error while listing devices.
     */
    getConnectedDevices(): Promise<Device[]>;

    /**
     * Retrieve the list of devices visible to adb within the given timeout.
     *
     * @param {number} timeoutMs The maximum number of milliseconds to get at least
     * one list item.
     * @return {Array.<Device>} The list of connected devices.
     * @throws {Error} If no connected devices can be detected within the given timeout.
     */
    getDevicesWithRetry(timeoutMs?: number): Promise<Device[]>;

    /**
     * Restart adb server, unless _this.suppressKillServer_ property is true.
     */
    restartAdb(): Promise<void>;

    /**
     * Execute the given adb command.
     *
     * @param {Array.<string>} cmd The array of rest command line parameters
     * or a single string parameter.
     * @param {Object} opts Additional options mapping. See
     * {@link https://github.com/appium/node-teen_process} for more details.
     * @return {string} Command's stdout.
     * @throws {Error} If the command returned non-zero exit code.
     */
    adbExec(cmd: string[], opts?: TeenProcessExecOptions): Promise<string>;

    /**
     * Execute the given command using _adb shell_ prefix.
     *
     * @param {!Array.<string>|string} cmd The array of rest command line
     * parameters or a single string parameter.
     * @param {?ShellExecOptions} opts Additional options mapping.
     * @return {string} Command's stdout.
     * @throws {Error} If the command returned non-zero exit code.
     */
    shell(cmd: string | string[], opts?: ShellExecOptions): Promise<string>;

    /**
     * Retrieve the current adb port.
     * @todo can probably deprecate this now that the logic is just to read this.adbPort
     * @return {number} The current adb port number.
     */
    getAdbServerPort(): number;

    /**
     * Retrieve the current emulator port from _adb devives_ output.
     *
     * @return {number} The current emulator port.
     * @throws {Error} If there are no connected devices.
     */
    getEmulatorPort(): Promise<void>;

    /**
     * Retrieve the current emulator port by parsing emulator name string.
     *
     * @param {string} emStr Emulator name string.
     * @return {number|boolean} Either the current emulator port or
     * _false_ if port number cannot be parsed.
     */
    getPortFromEmulatorString(emStr: string): number | false;

    /**
     * Retrieve the list of currently connected emulators.
     *
     * @return {Array.<Device>} The list of connected devices.
     */
    getConnectedEmulators(): Promise<Device[]>;

    /**
     * Set _emulatorPort_ property of the current class.
     *
     * @param {number} emPort The emulator port to be set.
     */
    setEmulatorPort(emPort: number): void;

    /**
     * Set the identifier of the current device (_this.curDeviceId_).
     *
     * @param {string} deviceId The device identifier.
     */
    setDeviceId(deviceId: string): void;

    /**
     * Get the object for the currently running emulator.
     *
     * @param {string} avdName Emulator name.
     * @return {?Device} Currently running emulator or _null_.
     */
    getRunningAVD(avdName: string): Promise<Device | null>;

    /**
     * Get the object for the currently running emulator.
     *
     * @param {string} avdName Emulator name.
     * @param {number} timeoutMs The maximum number of milliseconds
     * to wait until at least one running AVD object is detected.
     * @return {?Device} Currently running emulator or _null_.
     * @throws {Error} If no device has been detected within the timeout.
     */
    getRunningAVDWithRetry(
        avdName: string,
        timeoutMs?: number,
    ): Promise<Device | null>;

    /**
     * Shutdown all running emulators by killing their processes.
     *
     * @throws {Error} If killing tool returned non-zero return code.
     */
    killAllEmulators(): Promise<void>;

    /**
     * Start an emulator with given parameters and wait until it is full started.
     *
     * @param {string} avdName The name of an existing emulator.
     * @param {Array.<string>|string} avdArgs Additional emulator command line argument.
     * @param {?string} language Emulator system language.
     * @param {?country} country Emulator system country.
     * @param {number} avdLaunchTimeout [60000] Emulator startup timeout in milliseconds.
     * @param {number} retryTimes [1] The maximum number of startup retries.
     * @throws {Error} If the emulator fails to start within the given timeout.
     */
    launchAVD(
        avdName: string,
        avdArgs: string | string[],
        language?: string,
        country?: string,
        avdLaunchTimeout?: number,
        avdReadyTimeout?: number,
        retryTimes?: number,
    ): Promise<any>;

    /**
     * Check if the current emulator is ready to accept further commands (booting completed).
     *
     * @param {number} timeoutMs [20000] The maximum number of milliseconds to wait.
     * @throws {Error} If the emulator is not ready within the given timeout.
     */
    waitForEmulatorReady(timeoutMs?: number): Promise<void>;

    /**
     * Check if the current device is ready to accept further commands (booting completed).
     *
     * @param {number} appDeviceReadyTimeout [30] The maximum number of seconds to wait.
     * @throws {Error} If the device is not ready within the given timeout.
     */
    waitForDevice(appDeviceReadyTimeout?: number): Promise<void>;

    /**
     * Reboot the current device and wait until it is completed.
     *
     * @param {number} retries [DEFAULT_ADB_REBOOT_RETRIES] The maximum number of
     * reboot retries.
     * @throws {Error} If the device failed to reboot and number of retries is exceeded.
     */
    reboot(retries?: number): Promise<void>;

    /**
     * (Re)sign the given apk file on the local file system with the default certificate.
     *
     * @param {string} apk The full path to the local apk file.
     * @throws {Error} If signing fails.
     */
    signWithDefaultCert(apk: string): Promise<void>;

    /**
     * (Re)sign the given apk file on the local file system with a custom certificate.
     *
     * @param {string} apk The full path to the local apk file.
     * @throws {Error} If signing fails.
     */
    signWithCustomCert(apk: string): Promise<void>;

    /**
     * (Re)sign the given apk file on the local file system with either
     * custom or default certificate based on _this.useKeystore_ property value
     * and Zip-aligns it after signing.
     *
     * @param {string} appPath The full path to the local .apk(s) file.
     * @throws {Error} If signing fails.
     */
    sign(appPath: string): Promise<void>;

    /**
     * Perform zip-aligning to the given local apk file.
     *
     * @param {string} apk The full path to the local apk file.
     * @returns {boolean} True if the apk has been successfully aligned
     * or false if the apk has been already aligned.
     * @throws {Error} If zip-align fails.
     */
    zipAlignApk(apk: string): Promise<boolean>;

    /**
     * Check if the app is already signed with the default Appium certificate.
     *
     * @param {string} appPath The full path to the local .apk(s) file.
     * @param {string} pkg The name of application package.
     * @return {boolean} True if given application is already signed.
     */
    checkApkCert(appPath: string, pkg: string): Promise<boolean>;

    /**
     * Check if the app is already signed with a custom certificate.
     *
     * @param {string} appPath The full path to the local apk(s) file.
     * @param {string} pkg The name of application package.
     * @return {boolean} True if given application is already signed with a custom certificate.
     */
    checkCustomApkCert(appPath: string, pkg: string): Promise<boolean>;

    /**
     * Get the MD5 hash of the keystore.
     *
     * @param {string} keytool The name of the keytool utility.
     * @param {RegExp} md5re The pattern used to match the result in _keytool_ output.
     * @return {?string} Keystore MD5 hash or _null_ if the hash cannot be parsed.
     * @throws {Error} If getting keystore MD5 hash fails.
     */
    getKeystoreMd5(keytool: string, md5re: RegExp): Promise<string | null>;

    /**
     * Check if the MD5 hash of the particular application matches to the given hash.
     *
     * @param {string} keytool The name of the keytool utility.
     * @param {RegExp} md5re The pattern used to match the result in _keytool_ output.
     * @param {string} keystoreHash The expected hash value.
     * @param {string} pkg The name of the installed package.
     * @param {string} apk The full path to the existing apk file.
     * @return {boolean} True if both hashes are equal.
     * @throws {Error} If getting keystore MD5 hash fails.
     */
    checkApkKeystoreMatch(
        keytool: string,
        md5re: RegExp,
        keystoreHash: string,
        pkg: string,
        apk: string,
    ): Promise<boolean>;

    /**
     * Check whether the particular package is present on the device under test.
     *
     * @param {string} pkg The name of the package to check.
     * @return {boolean} True if the package is installed.
     * @throws {Error} If there was an error while detecting application state
     */
    isAppInstalled(pkg: boolean): Promise<boolean>;

    /**
     * Start the particular package/activity on the device under test.
     *
     * @param {StartAppOptions} startAppOptions Startup options mapping.
     * @return {string} The output of the corresponding adb command.
     * @throws {Error} If there is an error while executing the activity
     */
    startApp(startAppOptions: StartAppOptions): Promise<string>;

    /**
     * Start the particular URI on the device under test.
     *
     * @param {string} uri The name of URI to start.
     * @param {string} pkg The name of the package to start the URI with.
     */
    startUri(uri: string, pkg: string): Promise<void>;

    /**
     * Get the name of currently focused package and activity.
     *
     * @return {PackageActivityInfo} The mapping, where property names are
     * 'appPackage' and 'appActivity'.
     * @throws {Error} If there is an error while parsing the data.
     */
    getFocusedPackageAndActivity(): Promise<PackageActivityInfo>;

    /**
     * Wait for the given activity to be focused/non-focused.
     *
     * @param {string} pkg The name of the package to wait for.
     * @param {string} activity The name of the activity, belonging to that package,
     * to wait for.
     * @param {boolean} waitForStop Whether to wait until the activity is
     * focused (true) or is not focused (false).
     * @param {number} waitMs [20000] Number of milliseconds to wait before timeout occurs.
     * @throws {error} If timeout happens.
     */
    waitForActivityOrNot(
        pkg: string,
        activity: string,
        waitForStop: boolean,
        waitMs?: number,
    ): Promise<void>;

    /**
     * Wait for the given activity to be focused
     *
     * @param {string} pkg The name of the package to wait for.
     * @param {string} activity The name of the activity, belonging to that package,
     * to wait for.
     * @param {number} waitMs [20000] Number of milliseconds to wait before timeout occurs.
     * @throws {error} If timeout happens.
     */
    waitForActivity(
        pkg: string,
        activity: string,
        waitMs?: number,
    ): Promise<void>;

    /**
     * Wait for the given activity to be non-focused.
     *
     * @param {string} pkg The name of the package to wait for.
     * @param {string} activity The name of the activity, belonging to that package,
     * to wait for.
     * @param {number} waitMs [20000] Number of milliseconds to wait before timeout occurs.
     * @throws {error} If timeout happens.
     */
    waitForNotActivity(
        pkg: string,
        activity: string,
        waitMs?: number,
    ): Promise<void>;

    /**
     * Uninstall the given package from the device under test.
     *
     * @param {string} pkg The name of the package to be uninstalled.
     * @param {?UninstallOptions} options The set of uninstallation options.
     * @return {boolean} True if the package was found on the device and
     * successfully uninstalled.
     */
    uninstallApk(pkg: string, options?: UninstallOptions): Promise<boolean>;

    /**
     * Install the package after it was pushed to the device under test.
     *
     * @param {string} apkPathOnDevice The full path to the package on the
     * device file system.
     * @param {object} opts Additional exec options.
     * See {@link https://github.com/appium/node-teen_process}
     * for more details on this parameter.
     * @throws {error} If there was a failure during application install.
     */
    installFromDevicePath(
        apkPathOnDevice: string,
        opts?: TeenProcessExecOptions,
    ): Promise<void>;

    /**
     * Install the package from the local file system.
     *
     * @param {string} appPath The full path to the local package.
     * @param {?InstallOptions} options The set of installation options.
     * @throws {Error} If an unexpected error happens during install.
     */
    install(appPath: string, options?: InstallOptions): Promise<void>;

    /**
     * Emulate fingerprint touch event on the connected emulator.
     *
     * @param {string} fingerprintId The ID of the fingerprint.
     */
    fingerprint(fingerprintId: string): Promise<void>;

    /**
     * Emulate send SMS event on the connected emulator.
     *
     * @param {string|number} phoneNumber The phone number of message sender.
     * @param {string} message [''] The message content.
     * @throws {error} If phone number has invalid format.
     */
    sendSMS(phoneNumber: string | number, message?: string): Promise<void>;

    /**
     * Change the display orientation on the connected emulator.
     * The orientation is changed (PI/2 is added) every time
     * this method is called.
     */
    rotate(): Promise<void>;

    /**
     * Emulate power state change on the connected emulator.
     *
     * @param {string} state ['on'] Either 'on' or 'off'.
     */
    powerAC(state?: 'on' | 'off'): Promise<void>;

    /**
     * Emulate power capacity change on the connected emulator.
     *
     * @param {string|number} percent [100] Percentage value in range [0, 100].
     */
    powerCapacity(percent?: number): Promise<void>;

    /**
     * Emulate power off event on the connected emulator.
     */
    powerOFF(): Promise<void>;

    /**
     * Emulate GSM call event on the connected emulator.
     *
     * @param {string|number} phoneNumber The phone number of the caller.
     * @param {string} action [''] One of available GSM call actions.
     * @throws {error} If phone number has invalid format.
     * @throws {error} If _action_ value is invalid.
     */
    gsmCall(phoneNumber: string | number, action?: string): Promise<void>;

    /**
     * Emulate GSM signal strength change event on the connected emulator.
     *
     * @param {string|number} strength [4] A number in range [0, 4];
     * @throws {error} If _strength_ value is invalid.
     */
    gsmSignal(strength?: number): Promise<void>;

    /**
     * Emulate GSM voice event on the connected emulator.
     *
     * @param {string} state ['on'] Either 'on' or 'off'.
     * @throws {error} If _state_ value is invalid.
     */
    gsmVoice(state?: 'on' | 'off'): Promise<void>;

    /**
     * Switch adb server to root mode.
     *
     * @return {boolean} True of the switch was successful or false
     * if the switch failed.
     */
    root(): Promise<boolean>;

    /**
     * Switch adb server to non-root mode.
     *
     * @return {boolean} True of the switch was successful or false
     * if the switch failed.
     */
    unroot(): Promise<boolean>;
}

export const DEFAULT_ADB_PORT: number;
export default ADB;
