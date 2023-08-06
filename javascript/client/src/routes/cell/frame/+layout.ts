import { error } from '@sveltejs/kit';

export const load: import('./$types').LayoutLoad = async ({ url }) => {
	const id = url.searchParams.get('id');
	if (!id) {
		throw error(400, 'Missing ID');
	}

	return {
		serial: id
	};
};
