import type { FastifyInstance } from 'fastify';
import { VERSION } from '../../lib/env';

export default async function (fastify: FastifyInstance): Promise<void> {
	fastify.route<{
		Reply: { version: string };
	}>({
		method: 'GET',
		url: '/api/cellwall-version',
		schema: {
			response: {
				200: {
					type: 'object',
					properties: {
						version: { type: 'string' }
					}
				}
			}
		},
		async handler(request, reply) {
			reply.send({ version: VERSION });
		}
	});
}
