import { browser } from '$app/env';
import { blankState, type Mutable, type CellInfo, type CellState } from '@cell-wall/shared';
import { readable, type Readable } from 'svelte/store';

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
				const maybeJson: unknown = JSON.parse(data);
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
			console.log(socket.readyState, 'socket ready state');
			socket.send(JSON.stringify(data));
		};

		document.addEventListener('resize', handleResize, options);
		socket.addEventListener('close', () => {
			document.removeEventListener('resize', handleResize);
		});
	}
}
