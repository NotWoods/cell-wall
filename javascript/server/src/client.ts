import type { FastifyInstance } from 'fastify';
import middie from 'middie';
import { assetsMiddleware, kitMiddleware, prerenderedMiddleware } from '@cell-wall/client';

const CLIENT_PATHS = ['/remote/*', '/page/*', '/index.html'];

export async function clientSubsystem(fastify: FastifyInstance): Promise<void> {
	await fastify.register(middie);
	fastify.use(assetsMiddleware);
	fastify.use(CLIENT_PATHS, kitMiddleware);
	fastify.use(CLIENT_PATHS, prerenderedMiddleware);
}
