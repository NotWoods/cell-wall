export interface APKInfo {
	/** The name of application package, for example 'com.acme.app'. */
	apkPackage: string;
	/** The name of main application activity. */
	apkActivity: string;
}

declare const manifestMethods: AndroidManifest;
export default manifestMethods;

interface AndroidManifest {
	// android:process= may be defined in AndroidManifest.xml
	// http://developer.android.com/reference/android/R.attr.html#process
	// note that the process name when used with ps must be truncated to the last 15 chars
	// ps -c com.example.android.apis becomes ps -c le.android.apis
	processFromManifest(localApk: string): Promise<string>;

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
	 * Extract target SDK version from application manifest.
	 *
	 * @param {string} appPath - The full path to .apk(s) package.
	 * @return {number} The version of the target SDK.
	 * @throws {error} If there was an error while getting the data from the given
	 *                 application package.
	 */
	targetSdkVersionFromManifest(appPath: string): Promise<number>;

	/**
	 * Extract target SDK version from package information.
	 *
	 * @param {string} pkg - The class name of the package installed on the device under test.
	 * @param {?string} cmdOutput - Optional parameter containing the output of
	 *                              _dumpsys package_ command. It may speed up the method execution.
	 * @return {number} The version of the target SDK.
	 */
	targetSdkVersionUsingPKG(pkg: string, cmdOutput?: string | null): Promise<number>;

	/**
	 * Create binary representation of package manifest (usually AndroidManifest.xml).
	 * `${manifest}.apk` file will be created as the result of this method
	 * containing the compiled manifest.
	 *
	 * @param {string} manifest - Full path to the initial manifest template
	 * @param {string} manifestPackage - The name of the manifest package
	 * @param {string} targetPackage - The name of the destination package
	 */
	compileManifest(manifest: string, manifestPackage: string, targetPackage: string): Promise<void>;

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
	insertManifest(manifest: string, srcApk: string, dstApk: string): Promise<void>;

	/**
	 * Check whether package manifest contains Internet permissions.
	 *
	 * @param {string} appPath - The full path to .apk(s) package.
	 * @return {boolean} True if the manifest requires Internet access permission.
	 */
	hasInternetPermissionFromManifest(appPath: string): Promise<boolean>;

	/**
	 * Prints out the manifest extracted from the apk
	 *
	 * @param {string} appPath - The full path to application package.
	 * @param {?string} logLevel - The level at which to log. E.g., 'debug'
	 */
	printManifestFromApk(appPath: string, logLevel?: string): Promise<void>;
}
