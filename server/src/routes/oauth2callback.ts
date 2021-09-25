import type { RequestHandler } from '@sveltejs/kit';
import { authenticateGoogle } from '$lib/google';
import { repo } from '$lib/repository';

export const get: RequestHandler = async function get({ query }) {
	const code = query.get('code');
	if (!code) {
		return {
			status: 400,
			error: new Error('Missing code')
		};
	}

	const { googleAuth } = await repo.googleAuth();
	if (!googleAuth) {
		return {
			status: 503,
			error: `Missing API keys for Google`
		};
	}

	await authenticateGoogle(googleAuth, repo, code);

	return {
		body: 'Authentication successful! Please return to the console.'
	};
};
