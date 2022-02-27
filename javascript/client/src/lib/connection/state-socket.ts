import { blankState, CellState } from '@cell-wall/cell-state';
import { derived, Readable, readable } from 'svelte/store';

type CellStateTuple = [CellState, ArrayBuffer | Blob];

const blankBuffer = new ArrayBuffer(0);

export function connect(serial: string): WebSocket {
	return new WebSocket(`ws://${window.location.host}/cells/${serial}`);
}

/**
 * Returns true if `data` is a blank buffer.
 */
function emptyBuffer(data: ArrayBuffer | Blob): data is ArrayBuffer {
	return data instanceof ArrayBuffer && data.byteLength === 0;
}

/**
 * Convert `data` into a Blob.
 */
function toBlob(data: ArrayBuffer | Blob): Blob {
	if (data instanceof Blob) {
		return data;
	}

	return new Blob([data]);
}

/**
 * Listen to socket events from the server containing the current cell state.
 *
 * State events are expected to be sent in a series of base JSON state & binary data.
 * This pair is converted into a CellState object.
 * Binary data can be sent multiple times, and updates the last sent state type.
 */
export function cellState(socket: WebSocket): Readable<CellState> {
	let receivedState: CellState = blankState;
	const fromSocket = readable<CellStateTuple>([receivedState, blankBuffer], (set) => {
		const controller = new AbortController();

		function handleMessage({ data }: MessageEvent) {
			// Messages are expected to be sent as pairs of JSON state to associated binary data
			if (typeof data === 'string') {
				receivedState = JSON.parse(data) as CellState;
			} else {
				set([receivedState, data]);
			}
		}

		socket.addEventListener('message', handleMessage, controller);
		return () => controller.abort();
	});

	let lastBlobUrl: string | undefined;
	return derived(fromSocket, ([state, extra]) => {
		if (emptyBuffer(extra)) {
			return state;
		}

		switch (state.type) {
			case 'BLANK':
			case 'WEB':
			case 'TEXT':
				return state;
			case 'IMAGE': {
				const blob = toBlob(extra);
				if (lastBlobUrl) {
					URL.revokeObjectURL(lastBlobUrl);
				}
				lastBlobUrl = URL.createObjectURL(blob);

				return {
					...state,
					src: lastBlobUrl
				};
			}
		}
	});
}
