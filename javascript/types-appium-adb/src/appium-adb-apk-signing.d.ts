import { AdbEmuCommands } from './appium-adb-emu-commands';

export class ApkSigning extends AdbEmuCommands {
  /**
   * Execute apksigner utility with given arguments.
   *
   * @param {?Array<String>} args - The list of tool arguments.
   * @return {string} - Command stdout
   * @throws {Error} If apksigner binary is not present on the local file system
   *                 or the return code is not equal to zero.
   */
  executeApksigner(args?: ReadonlyArray<string>): Promise<string>;

  /**
   * (Re)sign the given apk file on the local file system with the default certificate.
   *
   * @param {string} apk - The full path to the local apk file.
   * @throws {Error} If signing fails.
   */
  signWithDefaultCert(apk: string): Promise<void>;

  /**
   * (Re)sign the given apk file on the local file system with a custom certificate.
   *
   * @param {string} apk - The full path to the local apk file.
   * @throws {Error} If signing fails.
   */
  signWithCustomCert(apk: string): Promise<void>;

  /**
   * (Re)sign the given apk file on the local file system with either
   * custom or default certificate based on _this.useKeystore_ property value
   * and Zip-aligns it after signing.
   *
   * @param {string} appPath - The full path to the local .apk(s) file.
   * @throws {Error} If signing fails.
   */
  sign(appPath: string): Promise<void>;

  /**
   * Perform zip-aligning to the given local apk file.
   *
   * @param {string} apk - The full path to the local apk file.
   * @returns {boolean} True if the apk has been successfully aligned
   * or false if the apk has been already aligned.
   * @throws {Error} If zip-align fails.
   */
  zipAlignApk(apk: string): Promise<boolean>;

  /**
   * Check if the app is already signed with the default Appium certificate.
   *
   * @param {string} appPath - The full path to the local .apk(s) file.
   * @param {string} pgk - The name of application package.
   * @return {boolean} True if given application is already signed.
   */
  checkApkCert(appPath: string, pkg: string): Promise<boolean>;

  /**
   * Check if the app is already signed with a custom certificate.
   *
   * @param {string} appPath - The full path to the local apk(s) file.
   * @param {string} pgk - The name of application package.
   * @return {boolean} True if given application is already signed with a custom certificate.
   */
  checkCustomApkCert(appPath: string, pkg: string): Promise<boolean>;

  /**
   * Get the MD5 hash of the keystore.
   *
   * @param {string} keytool - The name of the keytool utility.
   * @param {RegExp} md5re - The pattern used to match the result in _keytool_ output.
   * @return {?string} Keystore MD5 hash or _null_ if the hash cannot be parsed.
   * @throws {Error} If getting keystore MD5 hash fails.
   */
  getKeystoreMd5(keytool: string, md5re: RegExp): Promise<string | null>;

  /**
   * Check if the MD5 hash of the particular application matches to the given hash.
   *
   * @param {string} keytool - The name of the keytool utility.
   * @param {RegExp} md5re - The pattern used to match the result in _keytool_ output.
   * @param {string} keystoreHash - The expected hash value.
   * @param {string} pkg - The name of the installed package.
   * @param {string} apk - The full path to the existing apk file.
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
}
