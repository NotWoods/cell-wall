import { blankState, type CellInfo, type CellState } from '@cell-wall/shared';
import type { FastifyInstance } from 'fastify';
import type { IncomingMessage, Server } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { cellStateFor } from './lib/cells';
import { repo } from './lib/repository';

const CELL_SERIAL = /^\/cells\/(\w+)\/?$/;
const blankBuffer = new ArrayBuffer(0);

interface WebSocketHandler {
	/** Path that corresponds to the handler */
	path: string | ((pathname: string) => boolean);
	/**
	 * Handler function that is called for each new websocket.
	 * @param ws New connected websocket
	 * @returns CLeanup function called on websocket close
	 */
	onConnect(ws: WebSocket, request: IncomingMessage): (() => void) | undefined;
}

const cellSocketHandler: WebSocketHandler = {
	path: (pathname) => CELL_SERIAL.test(pathname),
	onConnect(ws, request) {
		const url = new URL(request.url!, `http://${request.headers.host}`);
		const { pathname } = url;
		const [, serial] = pathname.match(CELL_SERIAL)!;

		repo.webSockets.add(serial, { url });

		let lastState: CellState = blankState;
		const unsubscribe = cellStateFor(repo.cellState, serial).subscribe((state) => {
			if (!state) return;

			if (state.type === lastState.type) {
				const { payload = blankBuffer } = state;
				ws.send(payload);
			}

			ws.send(JSON.stringify(state));
			ws.send(blankBuffer);
			lastState = state;
		});

		ws.on('message', (data) => {
			const { width, height } = JSON.parse(data.toString()) as Pick<CellInfo, 'width' | 'height'>;
			repo.webSockets.add(serial, { width, height, url });
		});

		return () => {
			unsubscribe();
			repo.webSockets.delete(serial);
		};
	}
};

const remoteSocketHandler: WebSocketHandler = {
	path: '/remote',
	onConnect(ws) {
		return repo.cellData.subscribe((data) => {
			const dataObject = JSON.stringify(Object.fromEntries(data));
			ws.send(dataObject);
		});
	}
};

function attachWebsocketHandlers(server: Server, websocketHandlers: readonly WebSocketHandler[]) {
	const webSocketServers = new WeakMap(
		websocketHandlers.map((handler) => {
			const webSocketServer = new WebSocketServer({ noServer: true });
			webSocketServer.on('connection', handler.onConnect);
			return [handler, webSocketServer];
		})
	);

	const pathHandlers = new Map<string, WebSocketHandler>();
	const otherHandlers = websocketHandlers.filter(
		(handler): handler is WebSocketHandler & { path: (pathname: string) => boolean } => {
			if (typeof handler.path === 'string') {
				pathHandlers.set(handler.path, handler);
				return false;
			} else {
				return true;
			}
		}
	);

	server.on('upgrade', (request, socket, head) => {
		const { pathname } = new URL(request.url!, `http://${request.headers.host}`);

		// Start by exact matching path
		let handler = pathHandlers.get(pathname);
		if (!handler) {
			// Then try matching by functions
			handler = otherHandlers.find((handler) => handler.path(pathname));
		}
		if (!handler) {
			// If no handler found, close the connection
			socket.destroy();
			return;
		}

		const webSocketServer = webSocketServers.get(handler)!;
		webSocketServer.handleUpgrade(request, socket, head, (ws) => {
			webSocketServer.emit('connection', ws, request);
		});
	});
}

export async function websocketSubsystem(fastify: FastifyInstance): Promise<void> {
	attachWebsocketHandlers(fastify.server, [cellSocketHandler, remoteSocketHandler]);
}
