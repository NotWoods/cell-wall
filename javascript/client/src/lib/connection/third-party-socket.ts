import { browser } from '$app/env';
import type { ThirdPartySocketState } from '@cell-wall/shared';
import { derived, readable, type Readable } from 'svelte/store';

export function connectThirdParty(): WebSocket | undefined {
	if (browser) {
		return new WebSocket(`ws://${window.location.host}/third_party`);
	} else {
		return undefined;
	}
}

/**
 * Listen to socket events from the server containing the current cell data map.
 */
export function thirdPartyState(socket: WebSocket | undefined): Readable<ThirdPartySocketState> {
	return readable<ThirdPartySocketState>({ google_loading: true }, (set) => {
		const controller = new AbortController();

		function handleMessage({ data }: MessageEvent) {
			const state = JSON.parse(data) as ThirdPartySocketState;
			set(state);
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
