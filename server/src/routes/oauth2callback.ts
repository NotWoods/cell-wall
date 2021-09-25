import type { RequestHandler } from '@sveltejs/kit';
import { repo } from '$lib/repository';

export const get: RequestHandler = async function get({ query }) {
	const code = query.get('code');
	if (!code) {
		return {
			status: 400,
			error: new Error('Missing code')
		};
	}

	await repo.authenticateGoogleApi(code);

	return {
		body: 'Authentication successful! Please return to the console.'
	};
};
