import type { CellState, CellStateImage, CellStateWeb } from '@cell-wall/cell-state';
import { derived, Readable, writable, type Writable } from 'svelte/store';
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
			return new URL(web.url, base);
		}
		case 'IMAGE': {
			const imgProps = props as CellStateImage;
			imgProps.src = new URL(imgProps.src, base).toString();
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
