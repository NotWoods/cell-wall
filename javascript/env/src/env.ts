import { config } from 'dotenv';

config();

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

const formatted = formatURL(
	process.env['SERVER_ADDRESS'] as string,
	process.env['PORT'] as string | undefined
);

export const SERVER_ADDRESS = formatted.base;
export const PORT = formatted.port;

/**
 * Package name for the Android app
 */
export const PACKAGE_NAME = 'com.tigeroakes.cellwall.client';

/**
 * The Google API client ID for your application.
 */
export const GOOGLE_CLIENT_ID = process.env['GOOGLE_CLIENT_ID'] as string | undefined;

/**
 * The Google API client secret for your application.
 */
export const GOOGLE_CLIENT_SECRET = process.env['GOOGLE_CLIENT_SECRET'] as string | undefined;

/**
 * GitHub API personal access token
 */
export const GITHUB_TOKEN = process.env['GITHUB_TOKEN'] as string | undefined;

/**
 * Path where the database file will be stored
 */
export const DATABASE_FILENAME = process.env['DATABASE_FILENAME'] as string | undefined;
