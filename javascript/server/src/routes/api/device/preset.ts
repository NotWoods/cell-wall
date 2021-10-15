import type { FastifyInstance } from 'fastify';
import fetch from 'node-fetch';
import type { CellState } from '../../../lib/cells';
import { repo } from '../../../lib/repository';

export default async function (fastify: FastifyInstance): Promise<void> {
	fastify.route<{
		Body: URLSearchParams | { preset: string };
		Reply: Record<string, CellState>;
	}>({
		method: 'POST',
		url: '/api/device/preset',
		async handler(request, reply) {
			const preset =
				request.body instanceof URLSearchParams ? request.body.get('preset') : request.body.preset;

			const presetResponse = await fetch(
				`${request.protocol}://${request.hostname}/preset/${preset}.json`
			);
			const presetStates = (await presetResponse.json()) as Record<string, CellState>;

			await repo.setStates(presetStates);

			reply.send(presetStates);
		}
	});
}
