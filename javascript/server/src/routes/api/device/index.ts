import type { FastifyInstance } from 'fastify';
import { get as getState } from 'svelte/store';
import type { CellInfo } from '../../../lib/cells';
import { repo } from '../../../lib/repository';

export default async function (fastify: FastifyInstance): Promise<void> {
	fastify.route<{
		Reply: Record<string, CellInfo>;
	}>({
		method: 'GET',
		url: '/api/device/',
		schema: {
			response: {
				200: {
					type: 'object',
					additionalProperties: {
						type: 'object',
						properties: {
							deviceName: { type: 'string' },
							width: { type: 'number' },
							height: { type: 'number' },
							server: { type: 'string' }
						}
					}
				}
			}
		},
		async handler(request, reply) {
			reply.send(Object.fromEntries(getState(repo.cellData)));
		}
	});
}
