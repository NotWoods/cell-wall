import type { CellInfo } from '@cell-wall/shared';
import type { FastifyInstance } from 'fastify';
import { derived, get } from 'svelte/store';
import { repo } from '../../../lib/repository';

const androidDevices = derived(repo.cellData, ($cellData) =>
	Object.fromEntries(
		Array.from($cellData)
			.filter(([, data]) => data.connection.includes('android'))
			.map(([serial, data]) => [serial, data.info])
	)
);

/**
 * Refresh the list of ADB-connected devices.
 */
export default async function (fastify: FastifyInstance): Promise<void> {
	fastify.route<{
		Reply: Record<string, CellInfo | undefined>;
	}>({
		method: ['GET', 'POST'],
		url: '/api/action/refresh',
		/**
		 * Refresh the ADB devices
		 */
		async handler(request, reply) {
			await repo.refreshDevices();
			reply.send(get(androidDevices));
		}
	});
}
