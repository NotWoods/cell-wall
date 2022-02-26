import { blankState, type CellState } from '@cell-wall/cell-state';
import type { FastifyInstance } from 'fastify';
import { get as getState } from 'svelte/store';
import { repo } from '../../../../lib/repository';
import { asCellState } from './_body';

export default async function (fastify: FastifyInstance): Promise<void> {
	fastify.route<{
		Params: { serial: string };
		Reply: Record<string, CellState>;
	}>({
		method: 'GET',
		url: '/api/device/state/:serial',
		/**
		 * Get state from a cell
		 */
		async handler(request, reply) {
			const { serial } = request.params;

			reply.send({
				[serial]: getState(repo.cellData).get(serial)?.state ?? blankState
			});
		}
	});

	fastify.route<{
		Params: { serial: string };
		Body: CellState | URLSearchParams;
		Reply: readonly string[] | Error;
	}>({
		method: 'POST',
		url: '/api/device/state/:serial',
		/**
		 * Set state for a cell
		 */
		async handler(request, reply) {
			const { serial } = request.params;
			const state = asCellState(
				request.body instanceof URLSearchParams ? Object.fromEntries(request.body) : request.body
			) as CellState | undefined;

			if (!state) {
				reply.status(400).send(new Error(`Invalid body ${request.body}`));
				return;
			}

			await repo.setState(serial, state);

			reply.send([serial]);
		}
	});
}
