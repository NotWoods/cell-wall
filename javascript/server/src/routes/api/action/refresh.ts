import type { FastifyInstance } from 'fastify';
import { repo } from '../../../lib/repository';

export default async function (fastify: FastifyInstance): Promise<void> {
	fastify.route<{
		Reply: readonly string[];
	}>({
		method: ['GET', 'POST'],
		url: '/api/action/refresh',
		schema: {
			response: {
				200: {
					type: 'array',
					items: { type: 'string' }
				}
			}
		},
		/**
		 * Refresh the ADB devices
		 */
		async handler(request, reply) {
			const devices = await repo.refreshDevices();
			reply.send(Array.from(devices.keys()));
		}
	});
}
