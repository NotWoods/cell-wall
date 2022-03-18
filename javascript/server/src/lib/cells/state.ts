import type { CellState, CellStateImage, CellStateWeb, Mutable } from '@cell-wall/shared';
import { derived, writable, type Readable, type Writable } from 'svelte/store';
import { SERVER_ADDRESS } from '../env';

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

export function toUri(state: CellState, base: string | URL = SERVER_ADDRESS): URL {
	const { type, ...props } = state;
	switch (type.toUpperCase()) {
		case 'WEB': {
			const web = props as CellStateWeb;
			return new URL(web.payload, base);
		}
		case 'IMAGE': {
			const imgProps = props as Mutable<CellStateImage>;
			if (typeof imgProps.payload === 'string') {
				imgProps.payload = new URL(imgProps.payload, base).toString();
			}
			// fall through
		}
		default: {
			const url = new URL(`cellwall://${type}`);
			for (const [key, value] of Object.entries(props)) {
				url.searchParams.append(key, value);
			}
			return url;
		}
	}
}
