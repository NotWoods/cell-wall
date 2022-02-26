import { blankState, type CellState } from '@cell-wall/cell-state';
import type { FastifyInstance } from 'fastify';
import { get as getState } from 'svelte/store';
import { transformMap } from '../../../../lib/map/transform';
import { repo } from '../../../../lib/repository';
import { asCellState } from './_body';

export default async function (fastify: FastifyInstance): Promise<void> {
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
					transformMap(getState(repo.cellData), (data) => data.state ?? blankState)
				)
			);
		}
	});

	fastify.route<{
		Body: CellState | Record<string, CellState>;
		Reply: readonly string[];
	}>({
		method: 'POST',
		url: '/api/device/state/',
		/**
		 * Set state for multiple cells
		 */
		async handler(request, reply) {
			const singleState = asCellState(request.body);
			let states: Record<string, CellState> | Map<string, CellState>;
			if (singleState) {
				states = transformMap(getState(repo.cellData), () => singleState);
			} else {
				states = request.body as Record<string, CellState>;
			}

			await repo.setStates(states);

			reply.send(Object.keys(request.body));
		}
	});
}
