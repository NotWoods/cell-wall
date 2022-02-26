import { CellState, cellStateTypes } from '@cell-wall/cell-state';

function isObject(maybe: unknown): maybe is object {
	return typeof maybe === 'object' && maybe !== null;
}

export function asCellState(maybeState: unknown): CellState | undefined {
	if (isObject(maybeState)) {
		const state = maybeState as { type: string };
		if (cellStateTypes.has(state.type as CellState['type'])) {
			return state as CellState;
		}
	}
	return undefined;
}
