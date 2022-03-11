import Fastify from 'fastify';
import middie from 'middie';
import { routesSubsystem } from './routes';
import { websocketSubsystem } from './websocket';

export async function createServer() {
	const fastify = Fastify({
		logger: {
			prettyPrint: true
		},
		trustProxy: true
	});

	await fastify.register(middie);
	await fastify.register(routesSubsystem).register(websocketSubsystem);

	return fastify;
}
