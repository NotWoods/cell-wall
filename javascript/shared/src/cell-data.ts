import type { CellInfo } from './cell-info';
import type { CellState } from './cell-state-interface';

export type ConnectionType = 'web' | 'android';

export interface CellData {
	serial: string;
	info?: CellInfo;
	state?: CellState;
	connection: readonly ConnectionType[];
}
