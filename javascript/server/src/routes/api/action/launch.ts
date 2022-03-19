import type { FastifyInstance } from 'fastify';
import { get as getState } from 'svelte/store';
import { repo } from '../../../lib/repository';

/**
 * Launch web client on ADB-connected devices.
 */
export default async function (fastify: FastifyInstance): Promise<void> {
	fastify.route<{
		Reply: string[];
	}>({
		method: ['GET', 'POST'],
		url: '/api/action/launch',
		async handler(request, reply) {
			const devices = getState(repo.cellData);
			const promises = Array.from(devices)
				.map(([serial, data]) => {
					return {
						serial,
						connection: new Set(data.connection)
					};
				})
				// Get ADB-only devices
				.filter(({ connection }) => connection.has('android') && !connection.has('web'))
				.map(async ({ serial }) => {
					await repo.openClientOnDevice(serial);
					return serial;
				});

			const results = await Promise.allSettled(promises);
			reply.send(
				results
					.filter(
						(result): result is PromiseFulfilledResult<string> => result.status === 'fulfilled'
					)
					.map((result) => result.value)
			);
		}
	});
}
