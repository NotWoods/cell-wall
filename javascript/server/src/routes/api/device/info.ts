import { CellInfo, cellInfoSchema } from '@cell-wall/shared';
import type { FastifyInstance } from 'fastify';
import { derived, get as getState } from 'svelte/store';
import { transformMap } from '../../../lib/map/transform';
import { repo } from '../../../lib/repository';

export default async function (fastify: FastifyInstance): Promise<void> {
	const cellInfo = derived(repo.cellData, ($cellData) =>
		transformMap($cellData, (cellInfo) => cellInfo.info ?? null)
	);

	fastify.route<{
		Reply: Record<string, CellInfo | null>;
	}>({
		method: 'GET',
		url: '/api/device/info/',
		/**
		 * Get info about all cells
		 */
		async handler(request, reply) {
			reply.send(Object.fromEntries(getState(cellInfo)));
		}
	});

	fastify.route<{
		Params: { serial: string };
		Reply: CellInfo | null;
	}>({
		method: 'GET',
		url: '/api/device/info/:serial',
		schema: {
			response: {
				200: {
					...cellInfoSchema,
					nullable: true
				}
			}
		},
		/**
		 * Get info about a single cell
		 */
		async handler(request, reply) {
			const { serial } = request.params;
			reply.send(getState(cellInfo).get(serial) ?? null);
		}
	});

	fastify.route<{
		Params: { serial: string };
		Body: Partial<CellInfo>;
		Reply: readonly string[];
	}>({
		method: 'POST',
		url: '/api/device/info/:serial',
		/**
		 * Register a new cell
		 */
		async handler(request, reply) {
			const {
				body,
				params: { serial }
			} = request;

			await repo.registerCell({
				serial: body.serial || serial,
				server: body.server || `${request.protocol}://${request.hostname}`,
				deviceName: body.deviceName,
				width: body.width,
				height: body.height,
				x: body.x,
				y: body.y
			});

			// Otherwise send JSON
			reply.send([serial]);
		}
	});
}
