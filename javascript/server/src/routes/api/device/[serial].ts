import type { CellInfo } from '@cell-wall/cell-state';
import type { FastifyInstance, FastifyRequest } from 'fastify';
import { get as getState } from 'svelte/store';
import { repo } from '../../../lib/repository';

function parseAccept(headers: FastifyRequest['headers']) {
	const acceptValues = headers['accept']?.split(',') ?? [];
	return acceptValues
		.map((value) => {
			const [type, weight] = value.split(';');

			if (weight?.startsWith('q=')) {
				const q = parseFloat(weight.substring(2));
				return { type, q };
			} else {
				return { type, q: 1 };
			}
		})
		.sort((a, b) => b.q - a.q);
}

export default async function (fastify: FastifyInstance): Promise<void> {
	fastify.route<{
		Params: { serial: string };
		Reply: CellInfo | null;
	}>({
		method: 'GET',
		url: '/api/device/:serial',
		schema: {
			response: {
				200: {
					type: 'object',
					nullable: true,
					properties: {
						deviceName: { type: 'string' },
						width: { type: 'number' },
						height: { type: 'number' },
						server: { type: 'string' }
					}
				}
			}
		},
		/**
		 * Get info about a single cell
		 */
		async handler(request, reply) {
			const { serial } = request.params;
			reply.send(getState(repo.cellData).get(serial) ?? null);
		}
	});

	fastify.route<{
		Params: { serial: string };
		Body: Partial<CellInfo>;
		Reply: readonly string[];
	}>({
		method: 'POST',
		url: '/api/device/:serial',
		schema: {
			response: {
				200: {
					type: 'object',
					nullable: true,
					properties: {
						deviceName: { type: 'string' },
						width: { type: 'number' },
						height: { type: 'number' },
						server: { type: 'string' }
					}
				}
			}
		},
		/**
		 * Register a new cell
		 */
		async handler(request, reply) {
			const { serial } = request.params;
			const info = request.body;

			info.serial = serial;
			info.server ||= `${request.protocol}://${request.hostname}`;
			await repo.registerCell(info as CellInfo);

			const accepts = parseAccept(request.headers);
			const acceptsHtml = accepts.find((accept) => accept.type === 'text/html');
			if (acceptsHtml) {
				const acceptsJson = accepts.find((accept) => accept.type === 'application/json');
				// If HTML is preferred, redirect to the new Cell's frame page
				if (!acceptsJson || acceptsJson.q < acceptsHtml.q) {
					reply.redirect(`/cell/frame/blank?id=${serial}`);
				}
			}

			// Otherwise send JSON
			reply.send([serial]);
		}
	});
}
