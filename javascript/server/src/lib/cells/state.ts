import type { CellState } from '@cell-wall/shared';
import { derived, writable, type Readable, type Writable } from 'svelte/store';

export interface CellStateStore extends Writable<ReadonlyMap<string, CellState>> {
	/**
	 * Update the states of some cells.
	 * @param states Partial map of state overrides.
	 */
	setStates(states: Readonly<Record<string, CellState>> | ReadonlyMap<string, CellState>): void;
	/**
	 * Update the states a single cell.
	 */
	setState(deviceId: string, state: CellState): void;
}

export function cellStateStore(): CellStateStore {
	const store = writable<ReadonlyMap<string, CellState>>(new Map());

	function setStates(states: Readonly<Record<string, CellState>> | ReadonlyMap<string, CellState>) {
		const entries: Iterable<[string, CellState]> =
			typeof states.entries === 'function' ? states.entries() : Object.entries(states);

		store.update((map) => new Map([...map, ...entries]));
	}

	return {
		...store,
		setStates,
		setState(deviceId, state) {
			setStates(new Map<string, CellState>().set(deviceId, state));
		}
	};
}

export function cellStateFor(
	store: Readable<ReadonlyMap<string, CellState>>,
	serial: string
): Readable<CellState | undefined> {
	return derived(store, (map) => map.get(serial));
}
