import { RandomColor, textState, type CellStateText } from '@cell-wall/shared';
import type { FastifyInstance } from 'fastify';
import { derived, get as getState } from 'svelte/store';
import { transformMap } from '../../../lib/map/transform';
import { repo } from '../../../lib/repository';
import { updateRemainingCells, type RemainingBehaviour } from './_remaining';

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

function parseLines(
	body: string | string[] | { text?: string; lines?: string[] }
): readonly string[] {
	if (typeof body === 'string') {
		return body.split(/\s*\n\s*/g);
	} else if (Array.isArray(body)) {
		return body;
	} else if (Array.isArray(body.lines)) {
		return body.lines;
	} else if (typeof body.text === 'string') {
		return parseLines(body.text);
	} else {
		return [];
	}
}

/**
 * Display lines of text across different cells.
 */
export default async function (fastify: FastifyInstance): Promise<void> {
	fastify.route<{
		Body: string | string[] | { text?: string; lines?: string[] };
		Querystring: { backgroundColor?: string; rest?: RemainingBehaviour };
		Reply: Record<string, CellStateText>;
	}>({
		method: 'POST',
		url: '/api/action/text',
		async handler(request, reply) {
			const lines = parseLines(request.body);

			// Sort devices by screen width
			const deviceIds = getState(sortedDeviceIds);

			// Put text into buckets for each device
			const deviceToText = new Map<string, string[]>();
			for (const [i, line] of lines.entries()) {
				const index = i % deviceIds.length;
				const deviceId = deviceIds[index];

				const textArray = deviceToText.get(deviceId) ?? [];
				textArray.push(line);
				deviceToText.set(deviceId, textArray);
			}

			const colors = new RandomColor();
			const textStates = transformMap(deviceToText, (lines) =>
				textState(lines.join(', '), request.query.backgroundColor ?? colors.next())
			);

			repo.cellState.setStates(textStates);

			if (request.query.rest) {
				const remaining = Array.from(deviceIds).filter((serial) => !deviceToText.has(serial));
				await updateRemainingCells(remaining, request.query.rest || 'ignore');
			}

			reply.send(Object.fromEntries(textStates));
		}
	});
}
