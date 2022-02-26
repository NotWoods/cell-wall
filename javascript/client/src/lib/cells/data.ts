import type { CellState } from '@cell-wall/cell-state';

/**
 * Cell info includes the user-friendly name of a device,
 * the width and height of the display in density independent pixels,
 * and the x/y location relative to other phones.
 */
export interface Cell {
	serial: string;
	deviceName?: string;
	width?: number;
	height?: number;
	x?: number;
	y?: number;
	server?: string;
}

export interface CellData {
	serial: string;
	info?: Cell;
	state?: CellState;
	connected: boolean;
}

export type CellDataMap = ReadonlyMap<string, CellData>;
