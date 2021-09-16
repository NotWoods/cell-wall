import methods from './adb-commands';
import manifestMethods from './android-manifest';
import systemCallMethods from './system-calls';
import apkSigningMethods from './apk-signing';
import apkUtilsMethods from './apk-utils';
import apksUtilsMethods from './apks-utils';
import emuMethods from './adb-emu-commands';
import settingsClientCommands from './settings-client-commands';

export * from './adb-emu-commands';
export * from './android-manifest';
export * from './apk-signing';
export * from './apk-utils';
export * from './apks-utils';
export * from './settings-client-commands';
export * from './system-calls';

type methods = typeof methods;
type manifestMethods = typeof manifestMethods;
type systemCallMethods = typeof systemCallMethods;
type apkSigningMethods = typeof apkSigningMethods;
type apkUtilsMethods = typeof apkUtilsMethods;
type apksUtilsMethods = typeof apksUtilsMethods;
type emuMethods = typeof emuMethods;
type settingsClientCommands = typeof settingsClientCommands;

export interface AdbMethods
  extends methods,
    manifestMethods,
    systemCallMethods,
    apkSigningMethods,
    apkUtilsMethods,
    apksUtilsMethods,
    emuMethods,
    settingsClientCommands {}

declare const adbMethods: AdbMethods;
export default adbMethods;
