import type { FastifyInstance } from 'fastify';
import { get as getState } from 'svelte/store';
import { allSettledMap } from '../../../lib/map/transform';
import { repo } from '../../../lib/repository';

/**
 * Launch web client on ADB-connected devices.
 */
export default async function (fastify: FastifyInstance): Promise<void> {
	fastify.route<{
		Reply: Record<string, PromiseSettledResult<void>>;
	}>({
		method: ['GET', 'POST'],
		url: '/api/action/launch',
		async handler(request, reply) {
			const devices = getState(repo.androidConnections);
			const results = await allSettledMap(devices, (_, serial) => repo.openClientOnDevice(serial));
			reply.send(Object.fromEntries(results));
		}
	});
}
