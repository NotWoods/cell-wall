import { CellState, CellStateType } from '$lib/cells';

export function asCellState(maybeState: { type?: unknown }): CellState | undefined {
	if ((maybeState.type as string) in CellStateType) {
		return maybeState as CellState;
	} else {
		return undefined;
	}
}
