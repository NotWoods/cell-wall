import { transformMapAsync } from '$lib/map/transform';
import { repo } from '$lib/repository';
import type { RequestHandler } from '@sveltejs/kit';
import { get as getState } from 'svelte/store';
import { parsePowerBody } from './_body';

/**
 * Check if all cells are turned on or off.
 */
export const get: RequestHandler = async function get() {
	return {
		body: {
			devices: Object.entries(
				await transformMapAsync(getState(repo.cellData), (_data, serial) => repo.getPower(serial))
			)
		}
	};
};

/**
 * Set all cells to be on or off.
 */
export const post: RequestHandler = async function post({ body }) {
	const power = parsePowerBody(body);

	if (power === undefined) {
		return {
			status: 400,
			error: new Error(`Invalid body ${body}`)
		};
	}

	const serials = Array.from(getState(repo.cellData).keys());

	return {
		body: await repo.setPower(serials, power)
	};
};
