import type { RequestHandler } from '@sveltejs/kit';
import { get as getState } from 'svelte/store';
import { blankState } from '$lib/cells';
import { transformMap } from '$lib/map/transform';
import { repo } from '$lib/repository';

/**
 * Get states from all cells
 */
export const get: RequestHandler = async function get() {
	return {
		body: Object.entries(
			transformMap(getState(repo.cellData), (data) => data.state ?? blankState())
		)
	};
};

/**
 * Set state for multiple cells
 */
export const post: RequestHandler = async function post({ body }) {
	if (typeof body !== 'string') {
		return {
			status: 400,
			error: new Error(`Invalid body ${body}`)
		};
	}

	const states = JSON.parse(body);
	await repo.setStates(states);

	return {
		body: Object.keys(states)
	};
};
