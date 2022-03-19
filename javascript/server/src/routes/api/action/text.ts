import { RandomColor, textState, type CellState } from '@cell-wall/shared';
import type { FastifyInstance } from 'fastify';
import { derived, get as getState } from 'svelte/store';
import { transformMap } from '../../../lib/map/transform';
import { repo } from '../../../lib/repository';

const sortedDeviceIds = derived(repo.cellData, (devices) => {
	return (
		Array.from(devices)
			// Sort devices by screen width
			.sort(([, a], [, b]) => {
				return (b.info?.width ?? 0) - (a.info?.width ?? 0);
			})
			// Only return keys
			.map(([id]) => id)
	);
});

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
			const deviceIds = getState(sortedDeviceIds);

			// Put text into buckets for each device
			const deviceToText = new Map<string, string[]>(deviceIds.map((serial) => [serial, []]));
			for (const [i, line] of lines.entries()) {
				const index = i % deviceIds.length;
				const deviceId = deviceIds[index];
				deviceToText.get(deviceId)!.push(line);
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
