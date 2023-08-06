
import type { PageLoad } from '@sveltejs/kit';

export const load: PageLoad = async ({ url }) => {
	return {
		defaultSerial: url.searchParams.get('id') || ''
	};
};
