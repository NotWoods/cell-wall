import { SubProcess } from '../teen_process';
import { AdbMethods } from './tools';

export * from './tools';
export { getSdkRootFromEnv } from './helpers';

type DeepRequired<T> = {
	[P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

export const DEFAULT_ADB_PORT: number;

export interface CreateAdbOptions {
	sdkRoot?: string | null;
	appDeviceReadyTimeout?: number | null;
	useKeystore?: boolean | null;
	keystorePath?: string | null;
	keystorePassword?: string | null;
	keyAlias?: string | null;
	keyPassword?: string | null;
	executable?: {
		path?: string;
		defaultArgs?: ReadonlyArray<string>;
	};
	tmpDir?: string;
	curDeviceId?: string | null;
	emulatorPort?: number | null;
	binaries?: { [binaryName: string]: string | undefined };
	instrumentProc?: SubProcess | null;
	suppressKillServer?: boolean | null;
	adbPort?: number;
	adbExecTimeout?: number;
	remoteAppsCacheLimit?: number;
	buildToolsVersion?: string | null;
	allowOfflineDevices?: boolean;
}

interface ADB extends AdbMethods, DeepRequired<CreateAdbOptions> {}

declare const ADB: {
	prototype: ADB;
	new (opts?: CreateAdbOptions): ADB;

	createADB(opts?: CreateAdbOptions): Promise<ADB>;
};

export { ADB };
export default ADB;
