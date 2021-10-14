import type { CellState } from '../../../../lib/cells';
import { CellStateType } from '../../../../lib/cells';

function isObject(maybe: unknown): maybe is object {
	return typeof maybe === 'object' && maybe !== null;
}

export function asCellState(maybeState: unknown): CellState | undefined {
	if (isObject(maybeState)) {
		const state = maybeState as { type: string };
		if (state.type in CellStateType) {
			return state as CellState;
		}
	}
	return undefined;
}
