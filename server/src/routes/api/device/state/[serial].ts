import { blankState, CellState } from '$lib/cells';
import { repo } from '$lib/repository';
import type { RequestHandler } from '@sveltejs/kit';
import { get as getState } from 'svelte/store';
import { asCellState } from './_body';

/**
 * Get state from a cell
 */
export const get: RequestHandler = async function get({ params }) {
	const { serial } = params;

	return {
		body: JSON.stringify({
			[serial]: getState(repo.cellData).get(serial)?.state ?? blankState()
		})
	};
};

/**
 * Set state for a cell
 */
export const post: RequestHandler = async function post({ params, body }) {
	const { serial } = params;
	let state: CellState | undefined;
	if (typeof body === 'string') {
		state = asCellState(JSON.parse(body));
	} else if (body instanceof FormData) {
		state = asCellState(Object.fromEntries(body.entries()));
	}

	if (!state) {
		return {
			status: 400,
			error: new Error(`Invalid body ${body}`)
		};
	}

	await repo.setState(serial, state);

	return {
		body: [serial]
	};
};
