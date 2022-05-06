import type { FastifyInstance } from 'fastify';
import { repo } from '../../../lib/repository';

/**
 * Launch web client on ADB-connected devices.
 */
export default async function (fastify: FastifyInstance): Promise<void> {
	fastify.route<{
		Reply: Record<string, PromiseSettledResult<void>>;
	}>({
		method: ['GET', 'POST'],
		url: '/api/action/launch/',
		async handler(request, reply) {
			const results = await repo.openClientOnDevice();
			reply.send(Object.fromEntries(results));
		}
	});

	fastify.route<{
		Params: { serial: string };
		Reply: Record<string, PromiseSettledResult<void>>;
	}>({
		method: ['GET', 'POST'],
		url: '/api/action/launch/:serial',
		async handler(request, reply) {
			const { serial } = request.params;
			const results = await repo.openClientOnDevice(serial);
			reply.send(Object.fromEntries(results));
		}
	});
}
