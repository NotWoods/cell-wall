import type { FastifyInstance } from 'fastify';
import { get as getState } from 'svelte/store';
import type { CellState } from '../../../../lib/cells';
import { blankState } from '../../../../lib/cells';
import { transformMap } from '../../../../lib/map/transform';
import { repo } from '../../../../lib/repository';

export default function (fastify: FastifyInstance): void {
	fastify.route<{
		Reply: Record<string, CellState>;
	}>({
		method: 'GET',
		url: '/api/device/state/',
		/**
		 * Get states from all cells
		 */
		async handler(request, reply) {
			reply.send(
				Object.fromEntries(
					transformMap(getState(repo.cellData), (data) => data.state ?? blankState())
				)
			);
		}
	});

	fastify.route<{
		Body: Record<string, CellState>;
		Reply: readonly string[];
	}>({
		method: 'POST',
		url: '/api/device/state/:serial',
		/**
		 * Set state for multiple cells
		 */
		async handler(request, reply) {
			await repo.setStates(request.body);

			reply.send(Object.keys(request.body));
		}
	});
}
