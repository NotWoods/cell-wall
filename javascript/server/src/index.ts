import { handler } from '@cell-wall/client';
import { PORT } from './lib/env';
import { createServer } from './server';

async function main() {
	const fastify = await createServer();

	// use built client code
	fastify.use(handler);

	const address = await fastify.listen(PORT, '0.0.0.0');
	console.log(`Listening on ${address}`);
}

main().catch((err: unknown) => {
	console.error('error starting server', err);
	process.exit(1);
});
