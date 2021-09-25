import { VERSION } from '$lib/env';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async function get() {
	return {
		body: { version: VERSION }
	};
};
