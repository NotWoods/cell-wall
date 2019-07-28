import { InstallApksOptions } from './appium-adb-core';
import { ApkUtils } from './appium-adb-apk-utils';

export class ApksUtils extends ApkUtils {
    /**
     * Executes bundletool utility with given arguments and returns the actual stdout
     *
     * @param {Array<String>} args - the list of bundletool arguments
     * @param {string} errorMsg - The customized error message string
     * @returns {string} the actual command stdout
     * @throws {Error} If bundletool jar does not exist in PATH or there was an error while
     * executing it
     */
    execBundletool(
        args: ReadonlyArray<string>,
        errorMsg: string,
    ): Promise<string>;

    /**
     * @param {string} specLocation - The full path to the generated device spec location
     * @returns {string} The same `specLocation` value
     * @throws {Error} If it is not possible to retrieve the spec for the current device
     */
    getDeviceSpec(specLocation: string): Promise<string>;

    /**
     * Installs the given .apks package into the device under test
     *
     * @param {string} apks - The full path to the .apks file
     * @param {?InstallApksOptions} options - Installation options
     * @throws {Error} If the .apks bundle cannot be installed
     */
    installApks(apks: string, options?: InstallApksOptions): Promise<void>;

    /**
     * Extracts and returns the full path to the master .apk file inside the bundle.
     *
     * @param {string} apks - The full path to the .apks file
     * @returns {string} The full path to the master bundle .apk
     * @throws {Error} If there was an error while extracting/finding the file
     */
    extractBaseApk(apks: string): Promise<string>;

    /**
     * Extracts and returns the full path to the .apk, which contains the corresponding
     * resources for the given language in the .apks bundle.
     *
     * @param {string} apks - The full path to the .apks file
     * @param {?string} language - The language abbreviation. The default language is
     * going to be selected if it is not set.
     * @returns {string} The full path to the corresponding language .apk or the master .apk
     * if language split is not enabled for the bundle.
     * @throws {Error} If there was an error while extracting/finding the file
     */
    extractLanguageApk(apks: string, language?: string | null): Promise<string>;
}
