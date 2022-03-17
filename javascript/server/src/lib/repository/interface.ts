import type { CellData, CellInfo } from '@cell-wall/shared';
import type { InstallOrUpgradeResult } from 'appium-adb';
import type { Readable } from 'svelte/store';
import type { DeviceMap } from '../android/device-manager';
import type { CellStateStore } from '../cells';
import type { GoogleClient } from '../google';
import type { SplitImageCache } from '../image/cache';
import type { WebSocketStore } from './socket-store';

export interface Repository {
	cellData: Readable<ReadonlyMap<string, CellData>>;
	cellState: CellStateStore;
	images: SplitImageCache;
	webSockets: WebSocketStore;
	googleApi(): Promise<GoogleClient>;
	authenticateGoogleApi(code: string): Promise<void>;
	refreshDevices(): Promise<DeviceMap>;
	installApk(tag?: string): Promise<Map<string, InstallOrUpgradeResult>>;
	connectDevicePort(serial: string, port: number): Promise<boolean>;
	getPower(serial: string): Promise<boolean>;
	setPower(serial: string | readonly string[], on: boolean | 'toggle'): Promise<boolean>;
	registerCell(info: CellInfo): Promise<void>;
}
