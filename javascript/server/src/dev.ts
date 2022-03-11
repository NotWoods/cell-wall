import type { FastifyReply, FastifyRequest } from 'fastify';
import fastifyReplyFrom from 'fastify-reply-from';
import { PORT } from './lib/env';
import { createServer } from './server';

function proxy(request: FastifyRequest, reply: FastifyReply) {
	console.log(request.url);
	reply.from(request.url);
}

async function main() {
	const fastify = await createServer();

	// proxy to svelte-kit dev server
	await fastify.register(fastifyReplyFrom, {
		base: 'http://localhost:3001'
	});

	fastify.get('/cell/*', proxy);
	fastify.get('/remote/*', proxy);
	fastify.get('/demo', proxy);

	const address = await fastify.listen(PORT, '0.0.0.0');
	console.log(`Listening on ${address}`);
}

main().catch((err: unknown) => {
	console.error('error starting server', err);
	process.exit(1);
});
