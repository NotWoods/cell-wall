import { blankState, CellState } from '@cell-wall/cell-state';
import { Readable, readable } from 'svelte/store';

export function connect(serial: string): WebSocket {
	return new WebSocket(`ws://${window.location.host}/cells/${serial}`);
}

type PartialCellState = Omit<CellState, 'payload'> & { payload?: unknown };

/**
 * Listen to socket events from the server containing the current cell state.
 *
 * State events are expected to be sent in a series of base JSON state & binary data.
 * This pair is converted into a CellState object.
 * Binary data can be sent multiple times, and updates the last sent state type.
 */
export function cellState(socket: WebSocket): Readable<CellState> {
	let receivedState: PartialCellState = blankState;
	return readable<CellState>(blankState, (set) => {
		const controller = new AbortController();

		function handleMessage({ data }: MessageEvent) {
			// Messages are expected to be sent as pairs of JSON state to associated data
			if (typeof data === 'string') {
				const maybeJson: unknown = JSON.parse(data);
				if (maybeJson && typeof maybeJson === 'object' && 'type' in maybeJson) {
					receivedState = maybeJson as PartialCellState;
					return;
				}
				// else fall through
			}

			receivedState.payload = data;
			set(receivedState as CellState);
		}

		socket.addEventListener('message', handleMessage, controller);
		return () => controller.abort();
	});
}
