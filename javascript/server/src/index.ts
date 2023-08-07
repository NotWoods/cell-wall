import { handler } from '@cell-wall/client';
import { PORT, SERVER_ADDRESS } from './lib/env';
import { createServer } from './server';

async function main() {
	const fastify = await createServer();

	// use built client code
	fastify.use(handler);

	const address = await fastify.listen({ port: PORT, host: '0.0.0.0' });
	console.log(`Listening on ${address}`);
	console.log(`IP is ${SERVER_ADDRESS}`);
}

main().catch((err: unknown) => {
	console.error('error starting server', err);
	process.exit(1);
});
