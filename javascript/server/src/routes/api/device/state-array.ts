import type { CellState } from '@cell-wall/shared';
import type { FastifyInstance } from 'fastify';
import { get as getState } from 'svelte/store';
import { setTimeout } from 'timers/promises';
import { isDefined } from 'ts-extras';
import { repo } from '../../../lib/repository';
import { deriveSortedInfo } from '../../../lib/text/info-store';
import { asCellState } from './state';

const DELAY_MS = /^(\d+)(?:ms)?$/;
const DELAY_SECONDS = /^(\d+)s?$/;
function asDelay(delay?: string): number | undefined {
	if (!delay || !delay.trim()) return undefined;

	let delayMs: number | undefined;
	const matchMs = DELAY_MS.exec(delay);
	if (matchMs) {
		delayMs = Number(matchMs[1]);
	} else {
		const matchSeconds = DELAY_SECONDS.exec(delay);
		if (matchSeconds) {
			delayMs = Number(matchSeconds[1]) * 1000;
		}
	}

	if (typeof delayMs === 'number' && !Number.isNaN(delayMs)) {
		return delayMs;
	} else {
		throw new Error(`Invalid delay: ${delay}`);
	}
}

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
			if (!request.query.wait && delay > 0) {
				reply.send(devicesByPosition);
			}

			for (const [i, state] of states.entries()) {
				// Wrap around if needed
				const deviceId = devicesByPosition[i % devicesByPosition.length];
				repo.cellState.setState(deviceId, state);
				await setTimeout(delay);
			}

			if (request.query.wait) {
				reply.send(devicesByPosition);
			}
		}
	});
}
