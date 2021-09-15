import { repo } from '$lib/repository';
import type { RequestHandler } from '@sveltejs/kit';

/**
 * Refresh the ADB devices
 */
export const post: RequestHandler = async function post() {
	const devices = await repo.refreshDevices();
	return {
		body: Array.from(devices.keys())
	};
};
