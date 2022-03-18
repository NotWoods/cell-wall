import type { CellInfo } from './cell-info';
import type { CellState } from './cell-state-interface';

export type ConnectionType = 'web' | 'android';

/**
 * Contains all the information related to a Cell,
 * including state, static info, and connection status.
 */
export interface CellData {
	info?: CellInfo;
	state: CellState;
	connection: readonly ConnectionType[];
}
