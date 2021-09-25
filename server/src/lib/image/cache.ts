import type Jimp from 'jimp';
import { transformMapAsync } from '../map/transform';
import type { ResizeOptions } from './manipulate';
import type { RectangleWithPosition } from './rect';
import { splitImage } from './split';

export class SplitImageCache {
	private readonly cache = new Map<string, Jimp>();

	get(serial: string): Jimp | undefined {
		return this.cache.get(serial);
	}

	clear(): void {
		this.cache.clear();
	}

	async insert(
		image: Jimp,
		rects: ReadonlyMap<string, RectangleWithPosition>,
		options: ResizeOptions
	): Promise<Map<string, RectangleWithPosition>> {
		const cropped = await splitImage(image, rects, options);

		this.clear();
		return await transformMapAsync(cropped, async ({ info, img }, serial) => {
			this.cache.set(serial, img);
			return info;
		});
	}
}
