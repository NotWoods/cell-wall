import type { CellStateBlank } from './blank';
import type { CellStateImage } from './image';
import type { CellStateText } from './text';
import type { CellStateWeb } from './web';

export type CellState = CellStateBlank | CellStateText | CellStateImage | CellStateWeb;

export const cellStateTypes: ReadonlySet<CellState['type']> = new Set([
	'BLANK',
	'TEXT',
	'IMAGE',
	'WEB'
]);

export * from './blank';
export * from './image';
export * from './text';
export * from './web';

export function filterState(
	type: CellStateText['type'],
	state: CellState
): CellStateText | undefined;
export function filterState(
	type: CellStateImage['type'],
	state: CellState
): CellStateImage | undefined;
export function filterState(type: CellStateWeb['type'], state: CellState): CellStateWeb | undefined;
export function filterState<State extends CellState>(
	type: State['type'],
	state: CellState
): State | undefined;
export function filterState<State extends CellState>(
	type: State['type'],
	state: CellState
): State | undefined {
	if (state.type === type) {
		return state as State;
	} else {
		return undefined;
	}
}
