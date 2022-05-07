import type { CellState } from '@cell-wall/shared';
import type { FastifyInstance } from 'fastify';
import { get as getState } from 'svelte/store';
import { isDefined } from 'ts-extras';
import { asDelay, setStatesWithDelay } from '../../../lib/map/delay';
import { repo } from '../../../lib/repository';
import { deriveSortedInfo } from '../../../lib/text/info-store';
import { asCellState } from './state';

export default async function (fastify: FastifyInstance): Promise<void> {
	fastify.route<{
		Body: readonly CellState[];
		Querystring: { delay?: string; wait?: unknown };
		Reply: string[] | Error;
	}>({
		method: 'POST',
		url: '/api/device/state-array',
		/**
		 * Set state for multiple cells given an array
		 */
		async handler(request, reply) {
			if (!Array.isArray(request.body)) {
				reply
					.status(400)
					.send(new Error(`Invalid body ${JSON.stringify(request.body)}, must be array`));
				return;
			}

			const statesAndErrors = request.body.map(asCellState);
			const states = statesAndErrors.filter(isDefined);
			if (states.length !== statesAndErrors.length) {
				reply.status(400).send(new Error(`Invalid body ${JSON.stringify(request.body)}`));
				return;
			}

			let delay: number;
			try {
				delay = asDelay(request.query.delay) ?? 0;
			} catch {
				reply.status(400).send(new Error(`Invalid delay ${request.query.delay}`));
				return;
			}

			const devicesByPosition = getState(deriveSortedInfo(repo.cellData).leftToRight);

			const jobDone = setStatesWithDelay(repo.cellState, states, devicesByPosition, delay);

			if (request.query.wait || delay === 0) {
				await jobDone;
			}
			reply.send(devicesByPosition);
		}
	});
}
