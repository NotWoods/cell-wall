import { redirect } from '@sveltejs/kit';

export const load: import('./$types').PageLoad = async () => {
	redirect(301, '/remote');
};
