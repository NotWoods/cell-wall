import { env } from '@cell-wall/shared/src/env';

const {
	SERVER_ADDRESS,
	PORT,
	PACKAGE_NAME,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GITHUB_TOKEN,
	DATABASE_FILENAME
} = env(import.meta.env);

export {
	SERVER_ADDRESS,
	PORT,
	PACKAGE_NAME,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GITHUB_TOKEN,
	DATABASE_FILENAME
};
