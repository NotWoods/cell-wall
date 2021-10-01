import type { RequestHandler } from '@sveltejs/kit';
import { repo } from '$lib/repository';

export const get: RequestHandler<unknown, unknown, Uint8Array> = async function get(input) {
	const { serial } = input.params;

	const cached = repo.images.get(serial);
	if (!cached) {
		return {
			status: 404
		};
	}

	const mime = cached.getMIME();
	const buffer = await cached.getBufferAsync(mime);
	return {
		headers: {
			'Content-Type': mime
		},
		body: buffer
	};
};
