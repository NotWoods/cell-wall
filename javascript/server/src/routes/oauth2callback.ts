import type { FastifyInstance } from 'fastify';
import { repo } from '../lib/repository';

export default function (fastify: FastifyInstance): void {
	fastify.route<{
		Querystring: { code: string };
	}>({
		method: 'GET',
		url: '/oauth2callback',
		schema: {
			querystring: {
				code: { type: 'string' }
			}
		},
		async handler(request, reply) {
			const { code } = request.query;
			await repo.authenticateGoogleApi(code);
			reply.send('Authentication successful! Please return to the console.');
		}
	});
}
