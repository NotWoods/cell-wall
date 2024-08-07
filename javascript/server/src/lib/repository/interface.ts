import type { CellData, CellInfo } from '@cell-wall/shared';
import type { Readable } from 'svelte/store';
import type {
	AndroidPoweredStore,
	InstallOrUpgradeResult,
	Serial
} from '@cell-wall/android-device-manager';
import type { CellStateStore } from '../cells';
import type { WebSocketStore } from './socket-store';
import type { ThirdPartyConnect } from './third-party-connect';

export interface OpenClientOptions {
	serial?: string;
	portReverse?: boolean;
}

export interface Repository {
	cellData: Readable<ReadonlyMap<string, CellData>>;
	cellState: CellStateStore;
	powered: AndroidPoweredStore;
	webSockets: WebSocketStore;
	/**
	 * Interface for third-party API libraries.
	 */
	thirdParty: ThirdPartyConnect;
	refreshDevices(): Promise<void>;
	installApk(tag?: string): Promise<Map<Serial, InstallOrUpgradeResult>>;
	connectDevicePort(serial: Serial, port: number): Promise<void>;
	setPower(
		serials: readonly string[],
		on: boolean
	): Promise<ReadonlyMap<Serial, PromiseSettledResult<void>>>;
	registerCell(info: CellInfo): Promise<void>;
	openClientOnDevice(
		options?: OpenClientOptions
	): Promise<ReadonlyMap<string, PromiseSettledResult<void>>>;
}
