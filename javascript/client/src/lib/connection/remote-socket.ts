import { browser } from '$app/env';
import type { CellData } from '@cell-wall/shared';
import { derived, readable, type Readable } from 'svelte/store';

export function connectRemote(): WebSocket | undefined {
	if (browser) {
		return new WebSocket(`ws://${window.location.host}/remote`);
	} else {
		return undefined;
	}
}

/**
 * Listen to socket events from the server containing the current cell data map.
 */
export function remoteState(
	socket: WebSocket | undefined
): Readable<ReadonlyMap<string, CellData>> {
	return readable<ReadonlyMap<string, CellData>>(new Map(), (set) => {
		const controller = new AbortController();

		function handleMessage({ data }: MessageEvent) {
			const cellData = JSON.parse(data) as Record<string, CellData>;
			const cellMap = new Map(Object.entries(cellData));
			set(cellMap);
		}

		socket?.addEventListener('message', handleMessage, controller);
		return () => controller.abort();
	});
}

export function storeValues<Value>(
	store: Readable<ReadonlyMap<unknown, Value>>
): Readable<readonly Value[]> {
	return derived(store, (map) => Array.from(map.values()));
}
