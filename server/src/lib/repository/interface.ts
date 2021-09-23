import type { Auth } from 'googleapis';
import type { Readable } from 'svelte/store';
import type { DeviceMap } from '../android/device-manager';
import type { CellInfo, CellState } from '../cells';
import type { Cell } from '../database';
import type { GoogleClient } from '../google';

export interface CellData {
	serial: string;
	info?: Cell;
	state?: CellState;
	connected: boolean;
}

export type CellDataMap = ReadonlyMap<string, CellData>;

export interface Repository {
	cellData: Readable<CellDataMap>;
	googleAuth(): Promise<GoogleClient>;
	refreshDevices(): Promise<DeviceMap>;
	getTokens(): Promise<Auth.Credentials | undefined>;
	insertTokens(token: Auth.Credentials): Promise<void>;
	getPower(serial: string): Promise<boolean>;
	setPower(serial: string | readonly string[], on: boolean | 'toggle'): Promise<boolean>;
	setState(serial: string, state: CellState): Promise<void>;
	setStates(states: { [serial: string]: CellState } | Map<string, CellState>): Promise<void>;
	registerCell(info: CellInfo): Promise<void>;
}
