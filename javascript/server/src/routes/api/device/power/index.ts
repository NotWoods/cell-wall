import type { FastifyInstance } from 'fastify';
import { derived, get as getState } from 'svelte/store';
import { repo } from '../../../../lib/repository';
import { parsePowerBody } from './_body';

export default async function (fastify: FastifyInstance): Promise<void> {
	const serials = derived(repo.cellData, ($cellData) => Array.from($cellData.keys()));

	fastify.route<{
		Reply: Record<string, boolean>;
	}>({
		method: 'GET',
		url: '/api/device/power/',
		/**
		 * Check if all cells are turned on or off.
		 */
		async handler(request, reply) {
			await repo.powered.refresh();

			const powered = getState(repo.powered);
			const $serials = getState(serials);

			reply.send(Object.fromEntries($serials.map((serial) => [serial, powered.has(serial)])));
		}
	});

	fastify.route<{
		Body: string | boolean | { on: string | boolean } | URLSearchParams;
		Reply: boolean | Error;
	}>({
		method: 'POST',
		url: '/api/device/power/',
		/**
		 * Set all cells to be on or off.
		 */
		async handler(request, reply) {
			const power = parsePowerBody(request.body);

			if (power === undefined) {
				reply.status(400).send(new Error(`Invalid body ${request.body}`));
				return;
			}

			const $serials = getState(serials);

			const settled = await repo.setPower($serials, power);
			if (Array.from(settled.values()).every(({ status }) => status === 'fulfilled')) {
				reply.status(200).send(power);
			} else {
				reply.status(500).send(new Error('Some error occured'));
			}
		}
	});
}
