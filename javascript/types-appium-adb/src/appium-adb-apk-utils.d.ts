import { AndroidManifest } from './appium-adb-android-manifest';
import {
  AppInfo,
  APP_INSTALL_STATE,
  InstallOptions,
  InstallOrUpgradeOptions,
  InstallOrUpgradeResult,
  PackageActivityInfo,
  StartAppOptions,
  UninstallOptions,
} from './appium-adb-core';
import { TeenProcessExecOptions } from './teen_process';

export class ApkUtils extends AndroidManifest {
  /**
   * Check whether the particular package is present on the device under test.
   *
   * @param {string} pkg - The name of the package to check.
   * @return {boolean} True if the package is installed.
   * @throws {Error} If there was an error while detecting application state
   */
  isAppInstalled(pkg: string): Promise<boolean>;

  /**
   * Start the particular URI on the device under test.
   *
   * @param {string} uri - The name of URI to start.
   * @param {string} pkg - The name of the package to start the URI with.
   */
  startUri(uri: string, pkg: string): Promise<void>;

  /**
   * Start the particular package/activity on the device under test.
   *
   * @param {StartAppOptions} startAppOptions [{}] - Startup options mapping.
   * @return {string} The output of the corresponding adb command.
   * @throws {Error} If there is an error while executing the activity
   */
  startApp(startAppOptions?: StartAppOptions): Promise<string>;

  /**
   * @typedef {Object} PackageActivityInfo
   * @property {?string} appPackage - The name of application package,
   *                                  for example 'com.acme.app'.
   * @property {?string} appActivity - The name of main application activity.
   */

  /**
   * Get the name of currently focused package and activity.
   *
   * @return {PackageActivityInfo} The mapping, where property names are 'appPackage' and 'appActivity'.
   * @throws {Error} If there is an error while parsing the data.
   */
  getFocusedPackageAndActivity(): Promise<PackageActivityInfo>;

  /**
   * Wait for the given activity to be focused/non-focused.
   *
   * @param {string} pkg - The name of the package to wait for.
   * @param {string} activity - The name of the activity, belonging to that package,
   *                            to wait for.
   * @param {boolean} waitForStop - Whether to wait until the activity is focused (true)
   *                                or is not focused (false).
   * @param {number} waitMs [20000] - Number of milliseconds to wait before timeout occurs.
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
   * @param {string} pkg - The name of the package to wait for.
   * @param {string} activity - The name of the activity, belonging to that package,
   *                            to wait for.
   * @param {number} waitMs [20000] - Number of milliseconds to wait before timeout occurs.
   * @throws {error} If timeout happens.
   */
  waitForActivity(pkg: string, act: string, waitMs?: number): Promise<void>;

  /**
   * Wait for the given activity to be non-focused.
   *
   * @param {string} pkg - The name of the package to wait for.
   * @param {string} activity - The name of the activity, belonging to that package,
   *                            to wait for.
   * @param {number} waitMs [20000] - Number of milliseconds to wait before timeout occurs.
   * @throws {error} If timeout happens.
   */
  waitForNotActivity(pkg: string, act: string, waitMs?: number): Promise<void>;

  /**
   * Uninstall the given package from the device under test.
   *
   * @param {string} pkg - The name of the package to be uninstalled.
   * @param {?UninstallOptions} options - The set of uninstallation options.
   * @return {boolean} True if the package was found on the device and
   *                   successfully uninstalled.
   */
  uninstallApk(pkg: string, options?: UninstallOptions): Promise<boolean>;

  /**
   * Install the package after it was pushed to the device under test.
   *
   * @param {string} apkPathOnDevice - The full path to the package on the device file system.
   * @param {object} opts [{}] - Additional exec options. See {@link https://github.com/appium/node-teen_process}
   *                             for more details on this parameter.
   * @throws {error} If there was a failure during application install.
   */
  installFromDevicePath(
    apkPathOnDevice: string,
    opts?: TeenProcessExecOptions,
  ): Promise<void>;

  /**
   * Install the package from the local file system.
   *
   * @param {string} appPath - The full path to the local package.
   * @param {?InstallOptions} options - The set of installation options.
   * @throws {Error} If an unexpected error happens during install.
   */
  install(appPath: string, options?: InstallOptions): Promise<void>;

  /**
   * Retrieves the current installation state of the particular application
   *
   * @param {string} appPath - Full path to the application
   * @param {?string} pkg - Package identifier. If omitted then the script will
   *                        try to extract it on its own
   * @returns {string}]One of `APP_INSTALL_STATE` constants
   */
  getApplicationInstallState(
    appPath: string,
    pkg?: string | null,
  ): Promise<APP_INSTALL_STATE>;

  /**
   * Install the package from the local file system or upgrade it if an older
   * version of the same package is already installed.
   *
   * @param {string} appPath - The full path to the local package.
   * @param {?string} pkg - The name of the installed package. The method will
   *                        perform faster if it is set.
   * @param {?InstallOrUpgradeOptions} options - Set of install options.
   * @throws {Error} If an unexpected error happens during install.
   */
  installOrUpgrade(
    appPath: string,
    pkg?: string | null,
    options?: InstallOrUpgradeOptions,
  ): Promise<InstallOrUpgradeResult>;

  /**
   * Extract string resources from the given package on local file system.
   *
   * @param {string} appPath - The full path to the .apk(s) package.
   * @param {?string} language - The name of the language to extract the resources for.
   *                             The default language is used if this equals to `null`/`undefined`
   * @param {string} out - The name of the destination folder on the local file system to
   *                       store the extracted file to.
   * @return {Object} A mapping object, where properties are: 'apkStrings', containing
   *                  parsed resource file represented as JSON object, and 'localPath',
   *                  containing the path to the extracted file on the local file system.
   */
  extractStringsFromApk(
    appPath: string,
    language: string | null | undefined,
    out: string,
  ): Promise<{
    apkStrings: { [resourceId: string]: string };
    localPath: string;
  }>;

  /**
   * Get the language name of the device under test.
   *
   * @return {string} The name of device language.
   */
  getDeviceLanguage(): Promise<string>;

  /**
   * Get the country name of the device under test.
   *
   * @return {string} The name of device country.
   */
  getDeviceCountry(): Promise<string>;

  /**
   * Get the locale name of the device under test.
   *
   * @return {string} The name of device locale.
   */
  getDeviceLocale(): Promise<string>;

  /**
   * Set the locale name of the device under test and the format of the locale is en-US, for example.
   * This method call setDeviceLanguageCountry, so, please use setDeviceLanguageCountry as possible.
   *
   * @param {string} locale - Names of the device language and the country connected with `-`. e.g. en-US.
   */
  setDeviceLocale(locale: string): Promise<void>;

  /**
   * Make sure current device locale is expected or not.
   *
   * @param {string} language - Language. The language field is case insensitive, but Locale always canonicalizes to lower case.
   * @param {string} country - Country. The language field is case insensitive, but Locale always canonicalizes to lower case.
   * @param {?string} script - Script. The script field is case insensitive but Locale always canonicalizes to title case.
   *
   * @return {boolean} If current locale is language and country as arguments, return true.
   */
  ensureCurrentLocale(
    language: string,
    country: string,
    script?: string | null,
  ): Promise<boolean>;

  /**
   * Set the locale name of the device under test.
   *
   * @param {string} language - Language. The language field is case insensitive, but Locale always canonicalizes to lower case.
   *                            format: [a-zA-Z]{2,8}. e.g. en, ja : https://developer.android.com/reference/java/util/Locale.html
   * @param {string} country - Country. The country (region) field is case insensitive, but Locale always canonicalizes to upper case.
   *                            format: [a-zA-Z]{2} | [0-9]{3}. e.g. US, JP : https://developer.android.com/reference/java/util/Locale.html
   * @param {?string} script - Script. The script field is case insensitive but Locale always canonicalizes to title case.
   *                            format: [a-zA-Z]{4}. e.g. Hans in zh-Hans-CN : https://developer.android.com/reference/java/util/Locale.html
   */
  setDeviceLanguageCountry(
    language: string,
    country: string,
    script?: string | null,
  ): Promise<void>;

  /**
   * Get the package info from local apk file.
   *
   * @param {string} appPath - The full path to existing .apk(s) package on the local
   *                           file system.
   * @return {?AppInfo} The parsed application information.
   */
  getApkInfo(appPath: string): Promise<AppInfo | {}>;

  /**
   * Get the package info from the installed application.
   *
   * @param {string} pkg - The name of the installed package.
   * @return {?AppInfo} The parsed application information.
   */
  getPackageInfo(
    pkg: string,
  ): Promise<Partial<AppInfo> & Pick<AppInfo, 'name'>>;

  pullApk(pkg: string, tmpDir: string): Promise<string>;
}
