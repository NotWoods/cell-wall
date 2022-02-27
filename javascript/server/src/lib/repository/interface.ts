import type { CellData, CellState } from '@cell-wall/cell-state';
import type { InstallOrUpgradeResult } from 'appium-adb';
import type { Readable } from 'svelte/store';
import type { DeviceMap } from '../android/device-manager';
import type { CellInfo } from '../cells';
import type { GoogleClient } from '../google';
import type { SplitImageCache } from '../image/cache';

export interface Repository {
	cellData: Readable<ReadonlyMap<string, CellData>>;
	images: SplitImageCache;
	googleApi(): Promise<GoogleClient>;
	authenticateGoogleApi(code: string): Promise<void>;
	refreshDevices(): Promise<DeviceMap>;
	installApk(tag?: string): Promise<Map<string, InstallOrUpgradeResult>>;
	connectDevicePort(serial: string, port: number): Promise<boolean>;
	getPower(serial: string): Promise<boolean>;
	setPower(serial: string | readonly string[], on: boolean | 'toggle'): Promise<boolean>;
	setState(serial: string, state: CellState): Promise<void>;
	setStates(
		states: Readonly<Record<string, CellState>> | ReadonlyMap<string, CellState>
	): Promise<void>;
	registerCell(info: CellInfo): Promise<void>;
}
