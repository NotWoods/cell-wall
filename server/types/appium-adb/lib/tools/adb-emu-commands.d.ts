export const enum POWER_AC_STATES {
  POWER_AC_ON = 'on',
  POWER_AC_OFF = 'off',
}

export const enum GSM_CALL_ACTIONS {
  GSM_CALL = 'call',
  GSM_ACCEPT = 'accept',
  GSM_CANCEL = 'cancel',
  GSM_HOLD = 'hold',
}

export const enum GSM_VOICE_STATES {
  GSM_VOICE_UNREGISTERED = 'unregistered',
  GSM_VOICE_HOME = 'home',
  GSM_VOICE_ROAMING = 'roaming',
  GSM_VOICE_SEARCHING = 'searching',
  GSM_VOICE_DENIED = 'denied',
  GSM_VOICE_OFF = 'off',
  GSM_VOICE_ON = 'on',
}

export const enum NETWORK_SPEED {
  GSM = 'gsm', // GSM/CSD (up: 14.4, down: 14.4).
  SCSD = 'scsd', // HSCSD (up: 14.4, down: 57.6).
  GPRS = 'gprs', // GPRS (up: 28.8, down: 57.6).
  EDGE = 'edge', // EDGE/EGPRS (up: 473.6, down: 473.6).
  UMTS = 'umts', // UMTS/3G (up: 384.0, down: 384.0).
  HSDPA = 'hsdpa', // HSDPA (up: 5760.0, down: 13,980.0).
  LTE = 'lte', // LTE (up: 58,000, down: 173,000).
  EVDO = 'evdo', // EVDO (up: 75,000, down: 280,000).
  FULL = 'full', // No limit, the default (up: 0.0, down: 0.0).
}

export const enum SENSORS {
  ACCELERATION = 'acceleration',
  LIGHT = 'light',
  PROXIMITY = 'proximity',
  TEMPERATURE = 'temperature',
  PRESSURE = 'pressure',
  HUMIDITY = 'humidity',
}

export interface EmuInfo {
  /**
   * Emulator name, for example `Pixel_XL_API_30`
   */
  name: string;
  /**
   * Full path to the emulator config .ini file,
   * for example `/Users/user/.android/avd/Pixel_XL_API_30.ini`
   */
  config: string;
}

export interface ExecTelnetOptions {
  /**
   * A timeout used to wait for a server
   * reply to the given command
   * @default 60000
   */
  execTimeout?: number;
  /**
   * Console connection timeout in milliseconds
   * @default 5000
   */
  connTimeout?: number;
  /**
   * Telnet console initialization timeout
   * in milliseconds (the time between connection happens and the command prompt
   * is available)
   * @default 5000
   */
  initTimeout?: number;
  /**
   * The emulator port number. The method will try to parse it
   * from the current device identifier if unset
   */
  port?: number | string;
}

export interface EmuVersionInfo {
  /**
   * The actual revision number, for example '30.0.5'
   */
  revision?: string;
  /**
   * The build identifier, for example 6306047
   */
  buildId?: number;
}

declare const emuMethods: AdbEmuCommands;
export default emuMethods;

interface AdbEmuCommands {
  POWER_AC_STATES: typeof POWER_AC_STATES;
  GSM_CALL_ACTIONS: typeof GSM_CALL_ACTIONS;
  GSM_VOICE_STATES: typeof GSM_VOICE_STATES;
  GSM_SIGNAL_STRENGTHS: [0, 1, 2, 3, 4];
  NETWORK_SPEED: typeof NETWORK_SPEED;
  SENSORS: typeof SENSORS;

  /**
   * Check the emulator state.
   *
   * @return {boolean} True if Emulator is visible to adb.
   */
  isEmulatorConnected(): Promise<boolean>;

  /**
   * Verify the emulator is connected.
   *
   * @throws {error} If Emulator is not visible to adb.
   */
  verifyEmulatorConnected(): Promise<void>;

  /**
   * Emulate fingerprint touch event on the connected emulator.
   *
   * @param {string} fingerprintId - The ID of the fingerprint.
   */
  fingerprint(fingerprintId: string): Promise<void>;

  /**
   * Change the display orientation on the connected emulator.
   * The orientation is changed (PI/2 is added) every time
   * this method is called.
   */
  rotate(): Promise<void>;

  /**
   * Emulate power state change on the connected emulator.
   *
   * @param {string} state ['on'] - Either 'on' or 'off'.
   */
  powerAC(state?: POWER_AC_STATES): Promise<void>;

  /**
   * Emulate sensors values on the connected emulator.
   *
   * @param {string} sensor - Sensor type declared in SENSORS items.
   * @param {number|string} value  - Number to set as the sensor value.
   * @throws {Error} - If sensor type or sensor value is not defined
   */
  sensorSet(sensor: SENSORS, value: number | string): Promise<void>;

  /**
   * Emulate power capacity change on the connected emulator.
   *
   * @param {string|number} percent [100] - Percentage value in range [0, 100].
   */
  powerCapacity(percent?: string | number): Promise<void>;

  /**
   * Emulate power off event on the connected emulator.
   */
  powerOFF(): Promise<void>;

  /**
   * Emulate send SMS event on the connected emulator.
   *
   * @param {string|number} phoneNumber - The phone number of message sender.
   * @param {string} message [''] - The message content.
   * @throws {error} If phone number has invalid format.
   */
  sendSMS(phoneNumber: string | number, message?: string): Promise<void>;

  /**
   * Emulate GSM call event on the connected emulator.
   *
   * @param {string|number} phoneNumber - The phone number of the caller.
   * @param {string} action [''] - One of available GSM call actions.
   * @throws {error} If phone number has invalid format.
   * @throws {error} If _action_ value is invalid.
   */
  gsmCall(
    phoneNumber: string | number,
    action?: GSM_CALL_ACTIONS,
  ): Promise<void>;

  /**
   * Emulate GSM signal strength change event on the connected emulator.
   *
   * @param {string|number} strength [4] - A number in range [0, 4];
   * @throws {error} If _strength_ value is invalid.
   */
  gsmSignal(strength?: string | number): Promise<void>;

  /**
   * Emulate GSM voice event on the connected emulator.
   *
   * @param {string} state ['on'] - Either 'on' or 'off'.
   * @throws {error} If _state_ value is invalid.
   */
  gsmVoice(state?: GSM_VOICE_STATES): Promise<void>;

  /**
   * Emulate network speed change event on the connected emulator.
   *
   * @param {string} speed ['full'] - One of possible NETWORK_SPEED values.
   * @throws {error} If _speed_ value is invalid.
   */
  networkSpeed(speed?: NETWORK_SPEED): Promise<void>;

  /**
   * Executes a command through emulator telnet console interface and returns its output
   *
   * @param {Array<string>|string} cmd - The actual command to execute. See
   * https://developer.android.com/studio/run/emulator-console for more details
   * on available commands
   * @param {ExecTelnetOptions} opts
   * @returns {string} The command output
   * @throws {Error} If there was an error while connecting to the Telnet console
   * or if the given command returned non-OK response
   */
  execTelnet(
    cmd: string | ReadonlyArray<string>,
    opts?: ExecTelnetOptions,
  ): Promise<string>;

  /**
   * Retrieves emulator image properties from the local file system
   *
   * @param {string} avdName Emulator name. Should NOT start with '@' character
   * @throws {Error} if there was a failure while extracting the properties
   * @returns {Object} The content of emulator image properties file.
   * Usually this configuration .ini file has the following content:
   *   avd.ini.encoding=UTF-8
   *   path=/Users/username/.android/avd/Pixel_XL_API_30.avd
   *   path.rel=avd/Pixel_XL_API_30.avd
   *   target=android-30
   */
  getEmuImageProperties(avdName: string): Promise<object>;

  /**
   * Retrieves emulator version from the file system
   *
   * @returns {EmuVersionInfo} If no version info could be parsed then an empty
   * object is returned
   */
  getEmuVersionInfo(): Promise<EmuVersionInfo>;

  /**
   * Check if given emulator exists in the list of available avds.
   *
   * @param {string} avdName - The name of emulator to verify for existence.
   * Should NOT start with '@' character
   * @throws {Error} If the emulator with given name does not exist.
   */
  checkAvdExist(avdName: string): Promise<void>;
}
