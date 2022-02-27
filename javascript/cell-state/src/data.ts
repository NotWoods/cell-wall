import type { CellState } from './interface';

/**
 * Cell info includes the user-friendly name of a device,
 * the width and height of the display in density independent pixels,
 * and the x/y location relative to other phones.
 */
export interface CellInfo {
	serial: string;
	deviceName?: string;
	width?: number;
	height?: number;
	x?: number;
	y?: number;
	server?: string;
}

export type Cell = CellInfo;

export interface CellData {
	serial: string;
	info?: CellInfo;
	state?: CellState;
	connection?: 'web' | 'android' | undefined;
}
