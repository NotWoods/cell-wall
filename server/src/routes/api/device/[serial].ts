import { bodyAsJson } from '$lib/body';
import type { CellInfo } from '$lib/cells';
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
export const post: RequestHandler = async function post(input) {
	const { serial } = input.params;
	const info = bodyAsJson(input) as Partial<CellInfo> | undefined;

	if (!info) {
		return {
			status: 400,
			error: new Error(`Invalid body ${input.body}`)
		};
	}

	info.serial = serial;
	info.server ||= `http://${input.host}`;
	await repo.registerCell(info as CellInfo);

	return {
		body: [serial]
	};
};
