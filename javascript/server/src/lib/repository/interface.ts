import type { CellData, CellInfo } from '@cell-wall/shared';
import type { InstallOrUpgradeResult } from 'appium-adb';
import type { Readable } from 'svelte/store';
import type { AndroidPoweredStore } from '../android/android-powered';
import type { CellStateStore } from '../cells';
import type { SplitImageCache } from '../image/cache';
import type { WebSocketStore } from './socket-store';
import type { ThirdPartyConnect } from './third-party-connect';

export interface Repository {
	cellData: Readable<ReadonlyMap<string, CellData>>;
	cellState: CellStateStore;
	androidConnections: Readable<ReadonlyMap<string, { server: string | undefined }>>;
	powered: AndroidPoweredStore;
	images: SplitImageCache;
	webSockets: WebSocketStore;
	thirdParty: ThirdPartyConnect;
	refreshDevices(): Promise<void>;
	installApk(tag?: string): Promise<Map<string, InstallOrUpgradeResult>>;
	connectDevicePort(serial: string, port: number): Promise<void>;
	setPower(
		serials: readonly string[],
		on: boolean
	): Promise<ReadonlyMap<string, PromiseSettledResult<void>>>;
	registerCell(info: CellInfo): Promise<void>;
	openClientOnDevice(serial: string): Promise<void>;
}
