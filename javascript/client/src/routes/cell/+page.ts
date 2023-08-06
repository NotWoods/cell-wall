
import type { PageLoad } from '@sveltejs/kit';

export const load: PageLoad = async ({ url }) => {
	return {
		id: url.searchParams.get('id') || '',
		autoJoin: url.searchParams.has('autojoin')
	};
};
