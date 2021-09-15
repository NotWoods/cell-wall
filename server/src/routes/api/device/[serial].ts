import { repo } from '$lib/repository';
import type { RequestHandler } from '@sveltejs/kit';
import { get as getState } from 'svelte/store';

/**
 * Get info about a single cell
 */
export const get: RequestHandler = async function get({ params }) {
	const { serial } = params;

	return {
		body: JSON.stringify(getState(repo.cellData).get(serial) ?? null)
	};
};

/**
 * Register a new cell
 */
export const put: RequestHandler = async function put() {
	return {
		status: 503 // TODO
	};
};
