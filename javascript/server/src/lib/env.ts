import { env, VERSION } from '@cell-wall/shared/src/env';
import { config } from 'dotenv';
import { networkInterfaces } from 'os';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../../../.env') });

/**
 * Lookup the IP address of the device in the local network
 * @see https://stackoverflow.com/questions/3653065/get-local-ip-address-in-node-js
 */
function lookupLocalIp() {
	const interfaces = networkInterfaces();
	const results = new Map<string, string[]>();
	for (const [name, networks = []] of Object.entries(interfaces)) {
		// Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
		networks
			.filter((network) => network.family === 'IPv4' && !network.internal)
			.forEach((network) => {
				const resultArray = results.get(name) || [];
				resultArray.push(network.address);
				results.set(name, resultArray);
			});
	}

	const [firstResult] = results.values();

	return results.get('eth0')?.[0] ?? results.get('wlan0')?.[0] ?? firstResult?.[0];
}

const {
	SERVER_ADDRESS,
	PORT,
	PACKAGE_NAME,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GITHUB_TOKEN,
	DATABASE_FILENAME
} = env(process.env, lookupLocalIp());

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
