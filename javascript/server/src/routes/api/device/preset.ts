import type { CellState } from '@cell-wall/shared';
import type { FastifyInstance } from 'fastify';
import { repo } from '../../../lib/repository';
import * as presetJson from '../../../presets';

export default async function (fastify: FastifyInstance): Promise<void> {
	fastify.route<{
		Body: URLSearchParams | { preset: string };
		Reply: Record<string, CellState>;
	}>({
		method: 'POST',
		url: '/api/device/preset',
		async handler(request, reply) {
			const preset =
				request.body instanceof URLSearchParams ? request.body.get('preset')! : request.body.preset;

			const presetStates = presetJson[preset as keyof typeof presetJson] as Record<
				string,
				CellState
			>;

			repo.cellState.setStates(presetStates);

			reply.send(presetStates);
		}
	});
}
