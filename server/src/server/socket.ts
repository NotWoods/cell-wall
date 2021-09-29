import type { IncomingMessage } from 'http';
import type { Socket } from 'net';
import type { Duplex } from 'stream';
import type { Readable, Unsubscriber } from 'svelte/store';
import { get } from 'svelte/store';
import WebSocket, { ServerOptions, WebSocketServer } from 'ws';

/**
 * Broadcast a svelte store state to all WebSockets connected to a given server.
 */
export function broadcastStoreState(
	store: Readable<unknown>,
	options?: ServerOptions
): { wss: WebSocketServer; unsubscribe: Unsubscriber } {
	const wss = new WebSocketServer(options);

	function onConnection(ws: WebSocket) {
		console.log('connection');

		ws.send(get(store));
	}

	// Send current state when client connects
	wss.on('connection', onConnection);

	// Send live updates to clients
	const unsubscribe = store.subscribe((value) => {
		const data = value;
		Array.from(wss.clients)
			.filter((client) => client.readyState === WebSocket.OPEN)
			.forEach((client) => client.send(data));

		return () => wss.off('connection', onConnection);
	});

	return {
		wss,
		unsubscribe
	};
}

/**
 * Function to pass to server.on('upgrade') to link a HTTP server with a WebSocket server.
 */
export function upgradeToWebsocket(
	match: (request: IncomingMessage) => WebSocketServer | undefined
) {
	return (request: IncomingMessage, socket: Duplex, head: Buffer): void => {
		const wss = match(request);
		if (wss) {
			wss.handleUpgrade(request, socket as Socket, head, (ws) =>
				wss.emit('connection', ws, request)
			);
		} else {
			socket.destroy();
		}
	};
}
