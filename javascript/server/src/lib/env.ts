import { config } from 'dotenv';
import { env, VERSION } from '@cell-wall/shared/src/env';

config({ path: '../../.env' });

const {
	SERVER_ADDRESS,
	PORT,
	PACKAGE_NAME,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GITHUB_TOKEN,
	DATABASE_FILENAME
} = env(process.env);

export {
	VERSION,
	SERVER_ADDRESS,
	PORT,
	PACKAGE_NAME,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GITHUB_TOKEN,
	DATABASE_FILENAME
};
