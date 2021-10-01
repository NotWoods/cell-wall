import { CellStateType } from '$lib/cells';
import type { ResizeOptions } from '$lib/image/manipulate';
import { RectangleWithPosition, validRect } from '$lib/image/rect';
import { filterMap, transformMap } from '$lib/map/transform';
import { repo } from '$lib/repository';
import type { RequestHandler } from '@sveltejs/kit';
import Jimp from 'jimp';
import { get as getState } from 'svelte/store';

type RemainingBehaviour = 'blank' | 'off' | 'ignore';

async function updateRemainingCells(
	remaining: readonly string[],
	behaviour: RemainingBehaviour
): Promise<void> {
	switch (behaviour) {
		case 'blank':
			await repo.setStates(
				new Map(remaining.map((serial) => [serial, { type: CellStateType.BLANK }]))
			);
			break;
		case 'off':
			await repo.setPower(remaining, false);
			break;
		case 'ignore':
			break;
	}
}

export const post: RequestHandler<unknown, Uint8Array> = async function post(input) {
	const image = await Jimp.create(Buffer.from(input.body));

	const devices = new Set(input.query.getAll('device'));
	const includes = devices.size > 0 ? devices.has.bind(devices) : () => true;
	const cellData = getState(repo.cellData);
	const cells = filterMap(cellData, (cell) => validRect(cell.info) && includes(cell.serial));
	const rects = transformMap(cells, (cell) => cell.info as RectangleWithPosition);

	const options: ResizeOptions = {
		horizontalAlign: input.query.get('horizontalAlign'),
		verticalAlign: input.query.get('verticalAlign'),
		resize: input.query.get('resize')
	};

	repo.images.clear();
	await repo.images.insert(image, rects, options);

	repo.setStates(
		transformMap(rects, (_, serial) => ({
			type: CellStateType.IMAGE,
			src: `/api/action/image/${serial}`
		}))
	);

	if (input.query.has('rest')) {
		const remaining = Array.from(cellData.keys()).filter((serial) => !rects.has(serial));
		const rest = input.query.get('rest') as RemainingBehaviour | null;
		await updateRemainingCells(remaining, rest ?? 'ignore');
	}

	return {
		body: Array.from(rects.keys())
	};
};

export const del: RequestHandler = async function del() {
	repo.images.clear();
	return {
		status: 201
	};
};
