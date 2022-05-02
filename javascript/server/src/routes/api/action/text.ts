import { RandomColor, textState, type CellStateText } from '@cell-wall/shared';
import type { FastifyInstance } from 'fastify';
import { derived, get as getState } from 'svelte/store';
import { transformMap } from '../../../lib/map/transform';
import { repo } from '../../../lib/repository';
import { distributeText } from '../../../lib/text/distribute';
import { updateRemainingCells, type RemainingBehaviour } from './_remaining';

const cellInfo = derived(repo.cellData, (devices) =>
	transformMap(devices, (device) => device.info)
);

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
			const devices = getState(cellInfo);

			// Put text into buckets for each device
			const deviceToText = distributeText(devices, lines);

			const colors = new RandomColor();
			const textStates = transformMap(deviceToText, (lines) =>
				textState(lines.join(', '), request.query.backgroundColor ?? colors.next())
			);

			repo.cellState.setStates(textStates);

			if (request.query.rest) {
				const remaining = Array.from(devices.keys()).filter((serial) => !deviceToText.has(serial));
				await updateRemainingCells(remaining, request.query.rest || 'ignore');
			}

			reply.send(Object.fromEntries(textStates));
		}
	});
}
