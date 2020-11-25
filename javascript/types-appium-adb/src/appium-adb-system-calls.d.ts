import { ApksUtils } from './appium-adb-apks-utils';
import { ADBVersion, Device } from './appium-adb-core';
import {
  ShellExecOptions,
  SubProcess,
  TeenProcessExecOptions,
} from './teen_process';

export class SystemCalls extends ApksUtils {
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
   *                  supposed to be either 'which' or 'where'.
   */
  getCommandForOS(): 'where' | 'which';

  /**
   * Retrieve full binary name for the current operating system.
   *
   * @param {string} binaryName - simple binary name, for example 'android'.
   * @return {string} Formatted binary name depending on the current platform,
   *                  for example, 'android.bat' on Windows.
   */
  getBinaryNameForOS(binaryName: string): string;

  /**
   * Retrieve full path to the given binary.
   *
   * @param {string} binaryName - Simple name of a binary file.
   * @return {string} Full path to the given binary. The method tries
   *                  to enumerate all the known locations where the binary
   *                  might be located and stops the search as soon as the first
   *                  match is found on the local file system.
   * @throws {Error} If the binary with given name is not present at any
   *                 of known locations or Android SDK is not installed on the
   *                 local file system.
   */
  getBinaryFromSdkRoot(binaryName: string): Promise<string>;

  /**
   * Retrieve full path to a binary file using the standard system lookup tool.
   *
   * @param {string} binaryName - The name of the binary.
   * @return {string} Full path to the binary received from 'which'/'where'
   *                  output.
   * @throws {Error} If lookup tool returns non-zero return code.
   */
  getBinaryFromPath(binaryName: string): Promise<string>;

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
   * @param {number} timeoutMs - The maximum number of milliseconds to get at least
   *                             one list item.
   * @return {Array.<Device>} The list of connected devices.
   * @throws {Error} If no connected devices can be detected within the given timeout.
   */
  getDevicesWithRetry(timeoutMs?: number): Promise<Device[]>;

  /**
   * Restart adb server, unless _this.suppressKillServer_ property is true.
   */
  restartAdb(): Promise<void>;

  /**
   * Kill adb server.
   */
  killServer(): Promise<void>;

  /**
   * Reset Telnet authentication token.
   * @see {@link http://tools.android.com/recent/emulator2516releasenotes} for more details.
   *
   * @returns {boolean} If token reset was successful.
   */
  resetTelnetAuthToken(): Promise<boolean>;

  /**
   * Execute the given emulator command using _adb emu_ tool.
   *
   * @param {Array.<string>} cmd - The array of rest command line parameters.
   */
  adbExecEmu(cmd: ReadonlyArray<string>): Promise<void>;

  /**
   * Execute the given adb command.
   *
   * @param {Array.<string>} cmd - The array of rest command line parameters
   *                      or a single string parameter.
   * @param {Object} opts - Additional options mapping. See
   *                        {@link https://github.com/appium/node-teen_process}
   *                        for more details.
   * @return {string} - Command's stdout.
   * @throws {Error} If the command returned non-zero exit code.
   */
  adbExec(
    cmd: ReadonlyArray<string>,
    opts?: TeenProcessExecOptions,
  ): Promise<string>;

  /**
   * Execute the given command using _adb shell_ prefix.
   *
   * @param {!Array.<string>|string} cmd - The array of rest command line parameters or a single
   *                                      string parameter.
   * @param {?ShellExecOptions} opts [{}] - Additional options mapping.
   * @return {string} - Command's stdout.
   * @throws {Error} If the command returned non-zero exit code.
   */
  shell(
    cmd: string | ReadonlyArray<string>,
    opts?: ShellExecOptions,
  ): Promise<string>;

  createSubProcess(args?: ReadonlyArray<string>): SubProcess;

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
  getEmulatorPort(): Promise<number>;

  /**
   * Retrieve the current emulator port by parsing emulator name string.
   *
   * @param {string} emStr - Emulator name string.
   * @return {number|boolean} Either the current emulator port or
   *                          _false_ if port number cannot be parsed.
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
   * @param {number} emPort - The emulator port to be set.
   */
  setEmulatorPort(emPort: number): void;

  /**
   * Set the identifier of the current device (_this.curDeviceId_).
   *
   * @param {string} - The device identifier.
   */
  setDeviceId(deviceId: string): void;

  /**
   * Set the the current device object.
   *
   * @param {Device} deviceObj - The device object to be set.
   */
  setDevice(deviceObj: Device): void;

  /**
   * Get the object for the currently running emulator.
   *
   * @param {string} avdName - Emulator name.
   * @return {?Device} Currently running emulator or _null_.
   */
  getRunningAVD(avdName: string): Promise<Device | null>;

  /**
   * Get the object for the currently running emulator.
   *
   * @param {string} avdName - Emulator name.
   * @param {number} timeoutMs [20000] - The maximum number of milliseconds
   *                                     to wait until at least one running AVD object
   *                                     is detected.
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
   * Kill emulator with the given name. No error
   * is thrown is given avd does not exist/is not running.
   *
   * @param {?string} avdName - The name of the emulator to be killed. If empty,
   *                            the current emulator will be killed.
   * @param {?number} timeout [60000] - The amount of time to wait before throwing
   *                                    an exception about unsuccessful killing
   * @return {boolean} - True if the emulator was killed, false otherwise.
   * @throws {Error} if there was a failure by killing the emulator
   */
  killEmulator(avdName?: string | null, timeout?: number): Promise<boolean>;

  /**
   * Start an emulator with given parameters and wait until it is full started.
   *
   * @param {string} avdName - The name of an existing emulator.
   * @param {Array.<string>|string} avdArgs - Additional emulator command line argument.
   * @param {?string} language - Emulator system language.
   * @param {?country} country - Emulator system country.
   * @param {number} avdLaunchTimeout [60000] - Emulator startup timeout in milliseconds.
   * @param {number} retryTimes [1] - The maximum number of startup retries.
   * @throws {Error} If the emulator fails to start within the given timeout.
   */
  launchAVD(
    avdName: string,
    avdArgs: string | ReadonlyArray<string>,
    language?: string,
    country?: string,
    avdLaunchTimeout?: number,
    avdReadyTimeout?: number,
    retryTimes?: number,
  ): Promise<SubProcess>;

  /**
   * Get the adb version. The result of this method is cached.
   *
   * @return {ADBVersion} The current adb version.
   * @throws {Error} If it is not possible to parse adb version.
   */
  getAdbVersion(): Promise<ADBVersion>;

  /**
   * Check if given emulator exists in the list of available avds.
   *
   * @param {string} avdName - The name of emulator to verify for existence.
   * @throws {Error} If the emulator with given name does not exist.
   */
  checkAvdExist(avdName: string): Promise<void>;

  /**
   * Check if the current emulator is ready to accept further commands (booting completed).
   *
   * @param {number} timeoutMs [20000] - The maximum number of milliseconds to wait.
   * @throws {Error} If the emulator is not ready within the given timeout.
   */
  waitForEmulatorReady(timeoutMs?: string): Promise<void>;

  /**
   * Check if the current device is ready to accept further commands (booting completed).
   *
   * @param {number} appDeviceReadyTimeout [30] - The maximum number of seconds to wait.
   * @throws {Error} If the device is not ready within the given timeout.
   */
  waitForDevice(appDeviceReadyTimeout?: number): Promise<void>;

  /**
   * Reboot the current device and wait until it is completed.
   *
   * @param {number} retries [DEFAULT_ADB_REBOOT_RETRIES] - The maximum number of reboot retries.
   * @throws {Error} If the device failed to reboot and number of retries is exceeded.
   */
  reboot(retries?: number): Promise<void>;

  /**
   * Switch adb server to root mode.
   *
   * @return {boolean} True of the switch was successful or false
   *                   if the switch failed.
   */
  root(): Promise<boolean>;

  /**
   * Switch adb server to non-root mode.
   *
   * @return {boolean} True of the switch was successful or false
   *                   if the switch failed.
   */
  unroot(): Promise<boolean>;

  /**
   * Checks whether the current user is root
   *
   * @return {boolean} True if the user is root
   * @throws {Error} if there was an error while identifying
   * the user.
   */
  isRoot(): Promise<boolean>;

  /**
   * Verify whether a remote path exists on the device under test.
   *
   * @param {string} remotePath - The remote path to verify.
   * @return {boolean} True if the given path exists on the device.
   */
  fileExists(remotePath: string): Promise<boolean>;

  /**
   * Get the output of _ls_ command on the device under test.
   *
   * @param {string} remotePath - The remote path (the first argument to the _ls_ command).
   * @param {Array.<String>} opts [[]] - Additional _ls_ options.
   * @return {Array.<String>} The _ls_ output as an array of split lines.
   *                          An empty array is returned of the given _remotePath_
   *                          does not exist.
   */
  ls(remotePath: string, opts?: ReadonlyArray<string>): Promise<string[]>;

  /**
   * Get the size of the particular file located on the device under test.
   *
   * @param {string} remotePath - The remote path to the file.
   * @return {number} File size in bytes.
   * @throws {Error} If there was an error while getting the size of the given file.
   */
  fileSize(remotePath: string): Promise<number>;

  /**
   * Installs the given certificate on a rooted real device or
   * an emulator. The emulator must be executed with `-writable-system`
   * command line option and adb daemon should be running in root
   * mode for this method to work properly. The method also requires
   * openssl tool to be available on the destination system.
   * Read https://github.com/appium/appium/issues/10964
   * for more details on this topic
   *
   * @param {Buffer|string} cert - base64-decoded content of the actual certificate
   * represented as a string or a buffer
   * @throws {Error} If openssl tool is not available on the destination system
   * or if there was an error while installing the certificate
   */
  installMitmCertificate(cert: Buffer | string): Promise<void>;

  /**
   * Verifies if the given root certificate is already installed on the device.
   *
   * @param {Buffer|string} cert - base64-decoded content of the actual certificate
   * represented as a string or a buffer
   * @throws {Error} If openssl tool is not available on the destination system
   * or if there was an error while checking the certificate
   * @returns {boolean} true if the given certificate is already installed
   */
  isMitmCertificateInstalled(cert: Buffer | string): Promise<boolean>;
}
