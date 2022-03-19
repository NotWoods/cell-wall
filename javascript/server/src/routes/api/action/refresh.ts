import type { FastifyInstance } from 'fastify';
import { transformMap } from '../../../lib/map/transform';
import { repo } from '../../../lib/repository';

/**
 * Refresh the list of ADB-connected devices.
 */
export default async function (fastify: FastifyInstance): Promise<void> {
	fastify.route<{
		Reply: Record<string, { model: string; manufacturer: string }>;
	}>({
		method: ['GET', 'POST'],
		url: '/api/action/refresh',
		/**
		 * Refresh the ADB devices
		 */
		async handler(request, reply) {
			const devices = await repo.refreshDevices();
			reply.send(
				Object.fromEntries(
					transformMap(devices, (device) => ({
						model: device.model,
						manufacturer: device.manufacturer
					}))
				)
			);
		}
	});
}
