import type { FastifyReply, FastifyRequest } from 'fastify';
import fastifyReplyFrom from '@fastify/reply-from';
import { PORT, SERVER_ADDRESS } from './lib/env';
import { createServer } from './server';

const CLIENT_ROUTES = [
	'/cell/*',
	'/cell',
	'/remote/*',
	'/remote',
	'/demo',
	'/third_party',
	'/css/*',
	'/img/*',
	'/logo.png',
	'/src/*',
	'/@fs/*',
	'/@vite/*',
	'/.svelte-kit/*',
	'/node_modules/*'
];

function proxy(request: FastifyRequest, reply: FastifyReply) {
	reply.from(request.url);
}

async function main() {
	const fastify = await createServer();

	// proxy to svelte-kit dev server
	await fastify.register(fastifyReplyFrom, {
		base: 'http://127.0.0.1:3001/'
	});

	CLIENT_ROUTES.forEach((path) => fastify.get(path, proxy));

	const address = await fastify.listen({ port: PORT, host: '0.0.0.0' });
	console.log(`Dev mode: Listening on ${address}`);
	console.log(`IP is ${SERVER_ADDRESS}`);
}

main().catch((err: unknown) => {
	console.error('error starting server', err);
	process.exit(1);
});
