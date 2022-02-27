import type { CellInfo } from '@cell-wall/cell-state';
import type { FastifyInstance } from 'fastify';
import { get as getState } from 'svelte/store';
import { repo } from '../../../lib/repository';

export default async function (fastify: FastifyInstance): Promise<void> {
	fastify.route<{
		Params: { serial: string };
		Reply: CellInfo | null;
	}>({
		method: 'GET',
		url: '/api/device/:serial',
		schema: {
			response: {
				200: {
					type: 'object',
					nullable: true,
					properties: {
						deviceName: { type: 'string' },
						width: { type: 'number' },
						height: { type: 'number' },
						server: { type: 'string' }
					}
				}
			}
		},
		/**
		 * Get info about a single cell
		 */
		async handler(request, reply) {
			const { serial } = request.params;
			reply.send(getState(repo.cellData).get(serial) ?? null);
		}
	});

	fastify.route<{
		Params: { serial: string };
		Body: Partial<CellInfo>;
		Reply: readonly string[];
	}>({
		method: 'POST',
		url: '/api/device/:serial',
		schema: {
			response: {
				200: {
					type: 'object',
					nullable: true,
					properties: {
						deviceName: { type: 'string' },
						width: { type: 'number' },
						height: { type: 'number' },
						server: { type: 'string' }
					}
				}
			}
		},
		/**
		 * Register a new cell
		 */
		async handler(request, reply) {
			const { serial } = request.params;
			const info = request.body;

			info.serial = serial;
			info.server ||= `${request.protocol}://${request.hostname}`;
			await repo.registerCell(info as CellInfo);

			reply.send([serial]);
		}
	});
}
