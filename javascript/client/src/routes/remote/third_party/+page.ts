import { error } from '@sveltejs/kit';

export const load: import('./$types').PageLoad = async ({ fetch }) => {
	const response = await fetch('/api/third_party/');

	if (!response.ok) {
		throw error(500, `Could not load, ${response.statusText}`);
	}

	const body = (await response.json()) as { google_authorize_url?: string | undefined };

	return {
		googleAuthUrl: body.google_authorize_url
	};
};
