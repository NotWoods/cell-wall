import { redirect } from '@sveltejs/kit';

import type { PageLoad } from '@sveltejs/kit';

export const load: PageLoad = async () => {
	throw redirect(301, '/remote');
};
