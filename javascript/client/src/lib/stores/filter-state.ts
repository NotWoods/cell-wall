import type { CellState, CellStateMap, CellStateType } from '@cell-wall/shared';
import { derived, type Readable } from 'svelte/store';

export function filterState<Type extends CellStateType>(
	type: Type,
	state: Readable<CellState>
): Readable<CellStateMap[Type] | undefined> {
	return derived(state, ($state, set) => {
		if ($state.type === type) {
			set($state as CellStateMap[Type]);
		}
	});
}
