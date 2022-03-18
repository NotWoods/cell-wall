import type { CellStateBlank } from './blank.js';
import type { CellStateImage } from './image.js';
import type { CellStateText } from './text.js';
import type { CellStateWeb } from './web.js';

export type CellState = CellStateBlank | CellStateText | CellStateImage | CellStateWeb;

export const cellStateTypes: ReadonlySet<CellState['type']> = new Set([
	'BLANK',
	'TEXT',
	'IMAGE',
	'WEB'
]);

export * from './blank.js';
export * from './image.js';
export * from './text.js';
export * from './web.js';

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

export type Mutable<T> = {
	-readonly [P in keyof T]: T[P];
};
