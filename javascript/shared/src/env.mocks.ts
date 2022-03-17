export const VERSION = '4.0.0';

export function env() {
	return {
		SERVER_ADDRESS: new URL('http://192.168.0.1'),
		PORT: 3000,
		PACKAGE_NAME: 'com.tigeroakes.cellwall.client',
		GOOGLE_CLIENT_ID: '',
		GOOGLE_CLIENT_SECRET: '',
		GITHUB_TOKEN: undefined,
		DATABASE_FILENAME: undefined
	};
}
