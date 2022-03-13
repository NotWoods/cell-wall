import type { FastifyReply, FastifyRequest } from 'fastify';
import fastifyReplyFrom from 'fastify-reply-from';
import { PORT } from './lib/env';
import { createServer } from './server';

const CLIENT_ROUTES = [
	'/cell/*',
	'/cell',
	'/remote/*',
	'/remote',
	'/demo',
	'/css/*',
	'/logo.png',
	'/src/*',
	'/@fs/*',
	'/@vite/*',
	'/.svelte-kit/*',
	'/node_modules/*'
];

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

	CLIENT_ROUTES.forEach((path) => fastify.get(path, proxy));

	const address = await fastify.listen(PORT, '0.0.0.0');
	console.log(`Dev mode: Listening on ${address}`);
}

main().catch((err: unknown) => {
	console.error('error starting server', err);
	process.exit(1);
});
