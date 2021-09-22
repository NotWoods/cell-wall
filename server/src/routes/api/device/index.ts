import { repo } from '$lib/repository';
import type { RequestHandler } from '@sveltejs/kit';
import { get as getState } from 'svelte/store';

/**
 * Get info about all cells
 */
export const get: RequestHandler = async function get() {
	return {
		body: JSON.stringify(Object.fromEntries(getState(repo.cellData)))
	};
};
