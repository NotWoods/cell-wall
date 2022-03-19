function formatURL(address = '0.0.0.0', port = '3000') {
	let portN = Number(port);
	if (Number.isNaN(portN)) {
		portN = 3000;
	}

	let host = address.startsWith('http') ? address : `http://${address}`;
	host += `:${port}`;

	return { base: new URL(host), port: portN };
}

export const VERSION = '4.0.0';

export function env(
	envVariables: Partial<Record<string, string | boolean | undefined>>,
	address?: string
) {
	const formatted = formatURL(
		(envVariables['SERVER_ADDRESS'] as string | undefined) ?? address,
		envVariables['PORT'] as string | undefined
	);

	const SERVER_ADDRESS = formatted.base;
	const PORT = formatted.port;

	/**
	 * Package name for the Android app
	 */
	const PACKAGE_NAME = 'com.tigeroakes.cellwall.client';

	/**
	 * The Google API client ID for your application.
	 */
	const GOOGLE_CLIENT_ID = envVariables['GOOGLE_CLIENT_ID'] as string | undefined;

	/**
	 * The Google API client secret for your application.
	 */
	const GOOGLE_CLIENT_SECRET = envVariables['GOOGLE_CLIENT_SECRET'] as string | undefined;

	/**
	 * GitHub API personal access token
	 */
	const GITHUB_TOKEN = envVariables['GITHUB_TOKEN'] as string | undefined;

	/**
	 * Path where the database file will be stored
	 */
	const DATABASE_FILENAME = envVariables['DATABASE_FILENAME'] as string | undefined;

	return {
		SERVER_ADDRESS,
		PORT,
		PACKAGE_NAME,
		GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET,
		GITHUB_TOKEN,
		DATABASE_FILENAME
	};
}
