
export const load: import('./$types').PageLoad = async ({ url }) => {
	return {
		id: url.searchParams.get('id') || '',
		autoJoin: url.searchParams.has('autojoin')
	};
};
