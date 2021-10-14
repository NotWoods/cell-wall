import type { FastifyInstance } from 'fastify';
import websocket from 'fastify-websocket';
import type { Readable } from 'svelte/store';

interface WebsocketSubsystemOptions {
	store: Readable<unknown>;
}

/**
 * Broadcast a svelte store state to all WebSockets connected to a given server.
 */
export async function websocketSubsystem(
	fastify: FastifyInstance,
	options: WebsocketSubsystemOptions
): Promise<void> {
	const { store } = options;
	await fastify.register(websocket, {
		errorHandler(error, connection) {
			console.error('websocket error:', error);
			connection.destroy(error);
		}
	});

	fastify.get('/', { websocket: true }, ({ socket }) => {
		console.log('connection');

		// Send live updates to clients
		const unsubscribe = store.subscribe((value) => socket.send(value));

		socket.on('close', unsubscribe);
	});
}
