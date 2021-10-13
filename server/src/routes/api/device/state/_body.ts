import { isObject } from '../../../../lib/body';
import type { CellState } from '../../../../lib/cells';
import { CellStateType } from '../../../../lib/cells';

export function asCellState(maybeState: unknown): CellState | undefined {
	if (isObject(maybeState)) {
		const state = maybeState as { type: string };
		if (state.type in CellStateType) {
			return state as CellState;
		}
	}
	return undefined;
}
