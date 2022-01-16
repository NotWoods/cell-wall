import Fastify from 'fastify';
import middie from 'middie';
import { handler } from '@cell-wall/client';
import { PORT } from './lib/env';
import { routesSubsystem } from './routes';
import { websocketSubsystem } from './websocket';

async function main() {
	const fastify = Fastify({
		logger: {
			prettyPrint: true
		},
		trustProxy: true
	});

	await fastify.register(middie);
	await fastify.register(routesSubsystem).register(websocketSubsystem);
	fastify.use(handler);

	const address = await fastify.listen(PORT, '0.0.0.0');
	console.log(`Listening on ${address}`);
}

main().catch((err: unknown) => {
	console.error('error starting server', err);
	process.exit(1);
});
