import { blankState, cellStateTypes, type CellState } from '@cell-wall/shared';
import type { FastifyInstance } from 'fastify';
import { get as getState } from 'svelte/store';
import { setHas } from 'ts-extras';
import { transformMap } from '@notwoods/webish';
import { repo } from '../../../lib/repository';

function isObject(maybe: unknown): maybe is object {
	return typeof maybe === 'object' && maybe !== null;
}

export function asCellState(maybeState: unknown): CellState | undefined {
	if (isObject(maybeState)) {
		const state = maybeState as { type: string };
		if (setHas(cellStateTypes, state.type)) {
			return state as CellState;
		}
	}
	return undefined;
}

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
			reply.send(Object.fromEntries(getState(repo.cellState)));
		}
	});

	fastify.route<{
		Body: CellState | Record<string, CellState>;
		Reply: Record<string, CellState>;
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
				states = transformMap(getState(repo.cellState), () => singleState);
			} else {
				states = request.body as Record<string, CellState>;
			}

			repo.cellState.setStates(states);

			reply.send(Object.fromEntries(getState(repo.cellState)));
		}
	});

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
			const state = getState(repo.cellState).get(serial) ?? blankState;

			reply.send({ [serial]: state });
		}
	});

	fastify.route<{
		Params: { serial: string };
		Body: CellState | URLSearchParams;
		Reply: Record<string, CellState> | Error;
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
			);

			if (!state) {
				reply.status(400).send(new Error(`Invalid body ${JSON.stringify(request.body)}`));
				return;
			}

			repo.cellState.setState(serial, state);

			reply.send({ [serial]: state });
		}
	});
}
