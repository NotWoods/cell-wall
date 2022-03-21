import {
	validRectWithPos,
	type CellStateImage,
	type RectangleWithPosition
} from '@cell-wall/shared';
import type { FastifyInstance } from 'fastify';
import type Jimp from 'jimp';
import { get as getState } from 'svelte/store';
import { RESIZE, SplitImageCache, type ResizeOptions } from '../../../lib/image';
import { filterMap, transformMap, transformMapAsync } from '../../../lib/map/transform';
import { repo } from '../../../lib/repository';
import { imagePlugin } from '../../../parser/image';
import { updateRemainingCells, type RemainingBehaviour } from './_remaining';

interface ImageQuerystring extends ResizeOptions {
	rest?: RemainingBehaviour;
	device?: string[] | string;
}

export default async function (fastify: FastifyInstance): Promise<void> {
	await imagePlugin(fastify);
	const images = new SplitImageCache();

	fastify.route<{
		Body: Jimp;
		Querystring: ImageQuerystring;
		Reply: Record<string, CellStateImage>;
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
			const cells = filterMap(
				cellData,
				(cell, serial) => validRectWithPos(cell.info) && includes(serial)
			);
			const rects: ReadonlyMap<string, RectangleWithPosition> = transformMap(cells, (cell) => ({
				width: cell.info?.width ?? 1,
				height: cell.info?.height ?? 1,
				x: cell.info?.x ?? 0,
				y: cell.info?.y ?? 0
			}));

			const options: ResizeOptions = {
				horizontalAlign: request.query.horizontalAlign,
				verticalAlign: request.query.verticalAlign,
				resize: request.query.resize
			};

			images.clear();
			await images.insert(image, rects, options);

			const imageStates = await transformMapAsync(
				rects,
				async (_, serial): Promise<CellStateImage> => {
					const buffer = await images.get(serial)!.getBufferAsync(image.getMIME());
					const arrayBuffer = buffer.buffer.slice(
						buffer.byteOffset,
						buffer.byteOffset + buffer.byteLength
					);

					return {
						type: 'IMAGE',
						payload: arrayBuffer
					};
				}
			);

			repo.cellState.setStates(imageStates);

			if (request.query.rest) {
				const remaining = Array.from(cellData.keys()).filter((serial) => !rects.has(serial));
				await updateRemainingCells(remaining, request.query.rest || 'ignore');
			}

			reply.send(Object.fromEntries(imageStates));
		}
	});

	fastify.route({
		method: 'DELETE',
		url: '/api/action/image/',
		async handler(_request, reply) {
			images.clear();
			reply.status(201).send();
		}
	});

	fastify.route<{
		Params: { serial: string };
	}>({
		method: 'GET',
		url: '/api/action/image/:serial',
		async handler(request, reply) {
			const { serial } = request.params;

			const cached = images.get(serial);
			if (!cached) {
				reply.status(404);
				return;
			}

			const mime = cached.getMIME();
			const buffer = await cached.getBufferAsync(mime);
			reply.status(200).header('content-type', mime).send(buffer);
		}
	});
}
