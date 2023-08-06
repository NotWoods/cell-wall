export const load: import('./$types').PageLoad = async ({ url }) => {
	return {
		defaultSerial: url.searchParams.get('id') || ''
	};
};
