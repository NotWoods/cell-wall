import { textState, type CellState } from '@cell-wall/cell-state';
import type { FastifyInstance } from 'fastify';
import { get as getState } from 'svelte/store';
import { RandomColor } from '../../../lib/color';
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

			// Sort devices by screen width
			const devices = Array.from(getState(repo.cellData).values()).sort((a, b) => {
				return (b.info?.width ?? 0) - (a.info?.width ?? 0);
			});

			// Put text into buckets for each device
			const deviceToText = new Map<string, string[]>(devices.map((device) => [device.serial, []]));
			for (const [i, line] of lines.entries()) {
				const index = i % devices.length;
				const device = devices[index];
				deviceToText.get(device.serial)!.push(line);
			}

			const colors = new RandomColor();
			const states = transformMap(deviceToText, (lines) =>
				textState(lines.join(', '), request.query.backgroundColor ?? colors.next())
			);

			repo.cellState.setStates(states);

			reply.send(Object.fromEntries(states));
		}
	});
}
