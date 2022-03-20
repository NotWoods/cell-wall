import type { FastifyInstance } from 'fastify';
import { repo } from '../../../../lib/repository';
import { parsePowerBody } from './_body';

/**
 * Control power for individual ADB devices
 */
export default async function (fastify: FastifyInstance): Promise<void> {
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

			reply.send({
				[serial]: await repo.getPower(serial)
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

			const settled = await repo.setPower([serial], power);
			const serialSettled = settled.get(serial);
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
