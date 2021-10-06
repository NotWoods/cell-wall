import type { RequestHandler } from '@sveltejs/kit';
import { repo } from '$lib/repository';

/**
 * Install an updated APK to all devices
 */
export const post: RequestHandler<unknown, FormData> = async function post({ body }) {
	const results = await repo.installApk(body.get('tag') ?? undefined);
	return {
		body: JSON.stringify(Object.fromEntries(results))
	};
};
