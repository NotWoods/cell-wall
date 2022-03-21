import type { CellState } from '@cell-wall/shared';
import { derived, writable, type Readable, type Writable } from 'svelte/store';

export interface CellStateStore extends Writable<ReadonlyMap<string, CellState>> {
	setStates(states: Readonly<Record<string, CellState>> | ReadonlyMap<string, CellState>): void;
}

export function cellStateStore(): CellStateStore {
	const store = writable<ReadonlyMap<string, CellState>>(new Map());
	return {
		...store,
		setStates(states) {
			const entries: Iterable<[string, CellState]> =
				typeof states.entries === 'function' ? states.entries() : Object.entries(states);

			store.update((map) => new Map([...map, ...entries]));
		}
	};
}

export function cellStateFor(
	store: Readable<ReadonlyMap<string, CellState>>,
	serial: string
): Readable<CellState | undefined> {
	return derived(store, (map) => map.get(serial));
}
