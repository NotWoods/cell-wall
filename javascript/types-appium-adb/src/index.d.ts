import { EventEmitter } from 'events';
import { Logcat } from './appium-adb-core';
import { AdbCommands } from './appium-adb-commands';
import { AdbEmuCommands } from './appium-adb-emu-commands';
import { AndroidManifest } from './appium-adb-android-manifest';
import { ApkSigning } from './appium-adb-apk-signing';
import { ApkUtils } from './appium-adb-apk-utils';
import { ApksUtils } from './appium-adb-apks-utils';
import { SystemCalls } from './appium-adb-system-calls';

export * from './appium-adb-core';

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

export class ADB extends SystemCalls {
  static createADB(opts?: Partial<ADBOptions>): Promise<ADB>;
  constructor(opts?: Partial<ADBOptions>);
  initJars(): void;
  adbPort: number;
}

export const DEFAULT_ADB_PORT: number;
export default ADB;
