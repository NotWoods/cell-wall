import type { CellInfo } from '@cell-wall/shared';
import { writable, type Writable } from 'svelte/store';

export type WebSocketInfo = Pick<CellInfo, 'width' | 'height'>;

export interface WebSocketStore extends Writable<ReadonlyMap<string, WebSocketInfo>> {
	add(serial: string, socket: WebSocketInfo): void;
	delete(serial: string): void;
}

export function webSocketStore(): WebSocketStore {
	const store = writable<ReadonlyMap<string, WebSocketInfo>>(new Map());
	return {
		...store,
		add(serial, socket) {
			store.update((map) => new Map(map).set(serial, socket));
		},
		delete(serial) {
			store.update((map) => {
				const copy = new Map(map);
				copy.delete(serial);
				return copy;
			});
		}
	};
}
