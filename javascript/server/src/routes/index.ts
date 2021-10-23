import type { FastifyInstance } from 'fastify';

export default async function (fastify: FastifyInstance): Promise<void> {
	fastify.route({
		method: 'GET',
		url: '/',
		async handler(request, reply) {
			reply.redirect(301, '/remote/');
		}
	});
}
