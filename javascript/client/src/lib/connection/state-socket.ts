import { browser } from '$app/env';
import { blankState, type CellInfo, type CellState } from '@cell-wall/shared';
import { readable, type Readable } from 'svelte/store';

type Mutable<T> = {
	-readonly [P in keyof T]: T[P];
};

export function connect(serial: string): WebSocket | undefined {
	if (browser) {
		return new WebSocket(`ws://${window.location.host}/cells/${serial}`);
	} else {
		return undefined;
	}
}

function isCellState(state: unknown): state is Mutable<CellState> {
	return Boolean(state && typeof state === 'object' && 'type' in state);
}

function emptyData(data: ArrayBuffer | Blob | string) {
	if (data instanceof ArrayBuffer) {
		return data.byteLength === 0;
	} else if (data instanceof Blob) {
		return data.size === 0;
	}
	return false;
}

function jsonParse(data: string): unknown {
	try {
		return JSON.parse(data);
	} catch (error) {
		if (error instanceof SyntaxError) {
			return undefined;
		}
		throw error;
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
	let receivedState: Mutable<CellState> = blankState;
	return readable<CellState>(blankState, (set) => {
		const controller = new AbortController();

		function handleMessage({ data }: MessageEvent) {
			// Messages are expected to be sent as pairs of JSON state to associated data
			if (typeof data === 'string') {
				const maybeJson = jsonParse(data);
				if (isCellState(maybeJson)) {
					receivedState = maybeJson;
					return;
				}
				// else fall through
			}

			if (!emptyData(data)) {
				receivedState.payload = data;
			}
			set(receivedState as CellState);
		}

		socket?.addEventListener('message', handleMessage, controller);
		return () => controller.abort();
	});
}

export function sendResizeEvents(
	socket: WebSocket | undefined,
	options?: { signal?: AbortSignal }
) {
	if (socket) {
		// eslint-disable-next-line no-inner-declarations
		const handleResize = () => {
			const data: Pick<CellInfo, 'width' | 'height'> = {
				width: window.innerWidth,
				height: window.innerHeight
			};
			socket.send(JSON.stringify(data));
		};

		document.addEventListener('resize', handleResize, options);
		socket.addEventListener('close', () => {
			document.removeEventListener('resize', handleResize);
		});

		switch (socket.readyState) {
			case 0: // CONNECTING
				socket.addEventListener('open', handleResize, options);
				break;
			case 1: // OPEN
				handleResize();
				break;
			default:
			// do nothing, socket is closing or closed
		}
	}
}

/**
 * Get the URL of the cell frame page corresponding to the given type.
 */
export function frameUrl(type: CellState['type'], serial: string) {
	return `/cell/frame/${type.toLowerCase()}?id=${serial}`;
}
