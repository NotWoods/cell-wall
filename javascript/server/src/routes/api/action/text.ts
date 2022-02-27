import { textState, type CellState } from '@cell-wall/cell-state';
import type { FastifyInstance } from 'fastify';
import { get as getState } from 'svelte/store';
import { transformMap } from '../../../lib/map/transform';
import { repo } from '../../../lib/repository';

export default async function (fastify: FastifyInstance): Promise<void> {
	fastify.route<{
		Body: string | readonly string[];
		Querystring: { backgroundColor?: string };
		Reply: Record<string, CellState>;
	}>({
		method: 'POST',
		url: '/api/action/text',
		async handler(request, reply) {
			const lines =
				typeof request.body === 'string' ? request.body.split(/\s*\n\s*/g) : request.body;

			const devices = Array.from(getState(repo.cellData).keys());
			const deviceToText = new Map<string, string[]>(devices.map((device) => [device, []]));
			for (const [i, line] of lines.entries()) {
				const index = i % devices.length;
				const device = devices[index];
				deviceToText.get(device)!.push(line);
			}

			const states = transformMap(deviceToText, (lines) =>
				textState(lines.join(), request.query.backgroundColor)
			);

			repo.cellState.setStates(states);

			reply.send(Object.fromEntries(states));
		}
	});
}
