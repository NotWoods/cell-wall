import { blankState } from '@cell-wall/cell-state';
import type { FastifyInstance } from 'fastify';
import type Jimp from 'jimp';
import { get as getState } from 'svelte/store';
import { RectangleWithPosition, RESIZE, ResizeOptions, validRect } from '../../../../lib/image';
import { filterMap, transformMap } from '../../../../lib/map/transform';
import { repo } from '../../../../lib/repository';
import { imagePlugin } from '../../../../parser/image';

type RemainingBehaviour = 'blank' | 'off' | 'ignore';

async function updateRemainingCells(
	remaining: readonly string[],
	behaviour: RemainingBehaviour
): Promise<void> {
	switch (behaviour) {
		case 'blank':
			await repo.setStates(new Map(remaining.map((serial) => [serial, blankState])));
			break;
		case 'off':
			await repo.setPower(remaining, false);
			break;
		case 'ignore':
			break;
	}
}

interface ImageQuerystring extends ResizeOptions {
	rest?: RemainingBehaviour;
	device?: string[] | string;
}

export default async function (fastify: FastifyInstance): Promise<void> {
	await imagePlugin(fastify);

	fastify.route<{
		Body: Jimp;
		Querystring: ImageQuerystring;
	}>({
		method: 'POST',
		url: '/api/action/image/',
		schema: {
			querystring: {
				type: 'object',
				properties: {
					horizontalAlign: {
						type: 'string',
						enum: ['left', 'center', 'right']
					},
					verticalAlign: {
						type: 'string',
						enum: ['top', 'middle', 'bottom']
					},
					resize: {
						type: 'string',
						enum: Array.from(RESIZE)
					},
					rest: {
						type: 'string',
						enum: ['ignore', 'blank', 'off']
					}
				}
			}
		},
		async handler(request, reply) {
			const image = request.body;

			const devices = new Set(
				Array.isArray(request.query.device) ? request.query.device : [request.query.device]
			);
			const includes = devices.size > 0 ? devices.has.bind(devices) : () => true;
			const cellData = getState(repo.cellData);
			const cells = filterMap(cellData, (cell) => validRect(cell.info) && includes(cell.serial));
			const rects = transformMap(cells, (cell) => cell.info as RectangleWithPosition);

			const options: ResizeOptions = {
				horizontalAlign: request.query.horizontalAlign,
				verticalAlign: request.query.verticalAlign,
				resize: request.query.resize
			};

			repo.images.clear();
			await repo.images.insert(image, rects, options);

			repo.setStates(
				transformMap(rects, (_, serial) => ({
					type: 'IMAGE',
					src: `/api/action/image/${serial}`
				}))
			);

			if (request.query.rest) {
				const remaining = Array.from(cellData.keys()).filter((serial) => !rects.has(serial));
				const rest = request.query.rest;
				await updateRemainingCells(remaining, rest ?? 'ignore');
			}

			reply.send(Array.from(rects.keys()));
		}
	});

	fastify.route({
		method: 'DELETE',
		url: '/api/action/image/',
		async handler(_request, reply) {
			repo.images.clear();
			reply.status(201).send();
		}
	});
}
