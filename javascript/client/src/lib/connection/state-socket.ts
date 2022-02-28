import { browser } from '$app/env';
import { blankState, CellState } from '@cell-wall/cell-state';
import { Readable, readable } from 'svelte/store';

export function connect(serial: string): WebSocket | undefined {
	if (browser) {
		return new WebSocket(`ws://${window.location.host}/cells/${serial}`);
	} else {
		return undefined;
	}
}

/**
 * Listen to socket events from the server containing the current cell state.
 *
 * State events are expected to be sent in a series of base JSON state & binary data.
 * This pair is converted into a CellState object.
 * Binary data can be sent multiple times, and updates the last sent state type.
 */
export function cellState(socket: WebSocket | undefined): Readable<CellState> {
	let receivedState: CellState = blankState;
	return readable<CellState>(blankState, (set) => {
		const controller = new AbortController();

		function handleMessage({ data }: MessageEvent) {
			// Messages are expected to be sent as pairs of JSON state to associated data
			if (typeof data === 'string') {
				const maybeJson: unknown = JSON.parse(data);
				if (maybeJson && typeof maybeJson === 'object' && 'type' in maybeJson) {
					receivedState = maybeJson as CellState;
					return;
				}
				// else fall through
			}

			receivedState.payload = data;
			set(receivedState as CellState);
		}

		socket?.addEventListener('message', handleMessage, controller);
		return () => controller.abort();
	});
}
