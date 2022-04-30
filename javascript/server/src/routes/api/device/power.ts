import type { FastifyInstance } from 'fastify';
import { derived, get as getState } from 'svelte/store';
import { setHas } from 'ts-extras';
import type { Serial } from '../../../lib/android/opaque';
import { repo } from '../../../lib/repository';

function asPower(primitive: unknown): boolean | undefined {
	switch (primitive) {
		case true:
		case false:
			return primitive;
		case 'false':
			return false;
		case 0:
		case 1:
		case 'true':
			return Boolean(primitive);
		default:
			return undefined;
	}
}

function parsePowerBody(body: unknown): boolean | undefined {
	if (typeof body === 'boolean' || typeof body === 'string') {
		return asPower(body);
	} else if (typeof body === 'object' && body !== null) {
		if (body instanceof URLSearchParams) {
			return asPower(body.get('on'));
		} else {
			const { on } = body as { on?: unknown };
			return asPower(on);
		}
	}
	return undefined;
}

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

			reply.send(Object.fromEntries($serials.map((serial) => [serial, setHas(powered, serial)])));
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

			await repo.powered.refresh();
			const $serials = getState(serials);

			const settled = Array.from((await repo.setPower($serials, power)).values());
			if (settled.every(({ status }) => status === 'fulfilled')) {
				reply.status(200).send(power);
			} else {
				const errors = settled
					.filter((result): result is PromiseRejectedResult => result.status === 'rejected')
					.map(({ reason }) => reason);
				console.error(errors);
				reply.status(500).send(new AggregateError(errors));
			}
		}
	});

	fastify.route<{
		Params: { serial: string };
		Reply: Record<string, boolean>;
	}>({
		method: 'GET',
		url: '/api/device/power/:serial',
		/**
		 * Check if a cell is turned on or off.
		 */
		async handler(request, reply) {
			const { serial } = request.params;

			await repo.powered.refresh();
			const powered = getState(repo.powered);

			reply.send({
				[serial]: setHas(powered, serial)
			});
		}
	});

	fastify.route<{
		Params: { serial: string };
		Body: string | boolean | { on: string | boolean } | URLSearchParams;
		Reply: boolean | Error;
	}>({
		method: 'POST',
		url: '/api/device/power/:serial',
		/**
		 * Set a cell to be on or off.
		 */
		async handler(request, reply) {
			const { serial } = request.params;
			const power = parsePowerBody(request.body);

			if (power === undefined) {
				reply.status(400).send(new Error(`Invalid body ${request.body}`));
				return;
			}

			await repo.powered.refresh();
			const settled = await repo.setPower([serial], power);
			const serialSettled = settled.get(serial as Serial);
			switch (serialSettled?.status) {
				case 'fulfilled':
					reply.status(200).send(power);
					break;
				case 'rejected':
					reply.status(500).send(serialSettled?.reason);
					break;
				default:
					reply.status(404).send(new Error(`Device ${serial} not found`));
			}
		}
	});
}
