/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import WebSocket, { WebSocketServer } from 'ws';
import { get } from 'svelte/store';

/**
 * Broadcast a svelte store state to all WebSockets connected to a given server.
 * @param {import('svelte/store').Readable<unknown>} store
 * @param {import('ws').ServerOptions} [options]
 * @returns {{ wss: WebSocketServer, unsubscribe: import('svelte/store').Unsubscriber }}
 */
export function broadcastStoreState(store, options) {
	const wss = new WebSocketServer(options);

	/** @param {WebSocket} ws */
	function onConnection(ws) {
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
 * @param {(request: import('http').IncomingMessage) => WebSocketServer | undefined} match
 * @returns {(request: import('http').IncomingMessage, socket: import('stream').Duplex, head: Buffer) => void}
 */
export function upgradeToWebsocket(match) {
	return (request, socket, head) => {
		console.log('Socket req', request);
		const wss = match(request);
		if (wss) {
			wss.handleUpgrade(request, /** @type {import('net').Socket} */ (socket), head, (ws) =>
				wss.emit('connection', ws, request)
			);
		} else {
			socket.destroy();
		}
	};
}
