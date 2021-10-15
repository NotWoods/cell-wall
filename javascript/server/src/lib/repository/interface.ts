import type { InstallOrUpgradeResult } from 'appium-adb';
import type { Readable } from 'svelte/store';
import type { DeviceMap } from '../android/device-manager';
import type { CellInfo, CellState } from '../cells';
import type { GoogleClient } from '../google';
import type { SplitImageCache } from '../image/cache';
import type { Cell } from './database';

export interface CellData {
	serial: string;
	info?: Cell;
	state?: CellState;
	connected: boolean;
}

export type CellDataMap = ReadonlyMap<string, CellData>;

export interface Repository {
	cellData: Readable<CellDataMap>;
	images: SplitImageCache;
	googleApi(): Promise<GoogleClient>;
	authenticateGoogleApi(code: string): Promise<void>;
	refreshDevices(): Promise<DeviceMap>;
	installApk(tag?: string): Promise<Map<string, InstallOrUpgradeResult>>;
	getPower(serial: string): Promise<boolean>;
	setPower(serial: string | readonly string[], on: boolean | 'toggle'): Promise<boolean>;
	setState(serial: string, state: CellState): Promise<void>;
	setStates(
		states: Readonly<Record<string, CellState>> | ReadonlyMap<string, CellState>
	): Promise<void>;
	registerCell(info: CellInfo): Promise<void>;
}
