import { repo } from '$lib/repository';
import type { RequestHandler } from '@sveltejs/kit';
import { parsePowerBody } from './_body';

/**
 * Check if a cell is turned on or off.
 */
export const get: RequestHandler = async function get({ params }) {
	const { serial } = params;

	return {
		body: {
			devices: {
				[serial]: await repo.getPower(serial)
			}
		}
	};
};

/**
 * Set a cell to be on or off.
 */
export const post: RequestHandler = async function post({ params, body }) {
	const { serial } = params;
	const power = parsePowerBody(body);

	if (power === undefined) {
		return {
			status: 400,
			error: new Error(`Invalid body ${body}`)
		};
	}

	return {
		body: await repo.setPower(serial, power)
	};
};
