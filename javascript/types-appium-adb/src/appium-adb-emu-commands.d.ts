import { AdbCommands } from './appium-adb-commands';

export class AdbEmuCommands extends AdbCommands {
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
  powerAC(state?: 'on' | 'off'): Promise<void>;

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
  gsmCall(phoneNumber: string | number, action?: string): Promise<void>;

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
  gsmVoice(state?: 'on' | 'off'): Promise<void>;

  /**
   * Emulate network speed change event on the connected emulator.
   *
   * @param {string} speed ['full'] - One of possible NETWORK_SPEED values.
   * @throws {error} If _speed_ value is invalid.
   */
  networkSpeed(
    speed?:
      | 'gsm'
      | 'scsd'
      | 'gprs'
      | 'edge'
      | 'umts'
      | 'hsdpa'
      | 'lte'
      | 'evdo'
      | 'full',
  ): Promise<void>;
}
