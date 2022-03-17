import type { CellInfo } from './cell-info';
import type { CellState } from './cell-state-interface';

export interface CellData {
	serial: string;
	info?: CellInfo;
	state?: CellState;
	connection?: 'web' | 'android' | undefined;
}
