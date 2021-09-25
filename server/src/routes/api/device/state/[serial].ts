import type { RequestHandler } from '@sveltejs/kit';
import { get as getState } from 'svelte/store';
import { bodyAsJson } from '$lib/body';
import type { CellState } from '$lib/cells';
import { blankState } from '$lib/cells';
import { repo } from '$lib/repository';
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
export const post: RequestHandler = async function post(input) {
	const { serial } = input.params;

	const state = asCellState(bodyAsJson(input)) as CellState | undefined;

	if (!state) {
		return {
			status: 400,
			error: new Error(`Invalid body ${input.body}`)
		};
	}

	await repo.setState(serial, state);

	return {
		body: [serial]
	};
};