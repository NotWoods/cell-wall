import type { FastifyInstance } from 'fastify';
import { repo } from '../lib/repository';

export default async function (fastify: FastifyInstance): Promise<void> {
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
			const googleClient = await repo.thirdParty.google;
			await googleClient.authenticate(code);
			reply.send('Authentication successful! Please return to the console.');
		}
	});
}
