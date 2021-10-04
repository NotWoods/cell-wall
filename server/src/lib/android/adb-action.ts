import type { ADB, StartAppOptions } from 'appium-adb';
import { buildStartCmd } from 'appium-adb/lib/helpers';

/**
 * Checks if an Android device is on.
 */
export async function checkIfOn(
	adb: ADB,
	cmdOutput: string | undefined = undefined
): Promise<boolean> {
	const stdout = cmdOutput || (await adb.shell(['dumpsys', 'power']));
	const wakefulness = /mWakefulness=(\w+)/.exec(stdout)?.[1];
	return wakefulness === 'Awake';
}

export interface StartIntentOptions extends StartAppOptions {
	dataUri?: string | URL | undefined;
	mimeType?: string | undefined;
	extras?: {
		[key: string]: string | boolean | number | null | undefined | number[];
	};
}

export async function startIntent(adb: ADB, options: StartIntentOptions): Promise<void> {
	const args = buildStartCmd(options, 21);

	if (options.dataUri) {
		args.push('-d', options.dataUri.toString());
	}
	if (options.mimeType) {
		args.push('-t', options.mimeType);
	}
	for (const [key, extra] of Object.entries(options.extras || {})) {
		switch (typeof extra) {
			case 'string':
				args.push('--es', key, extra);
				break;
			case 'boolean':
				args.push('--ez', key, extra.toString());
				break;
			case 'number':
				if (Number.isInteger(extra)) {
					args.push('--ei', key, extra.toString());
				} else {
					args.push('--ef', key, extra.toString());
				}
				break;
			case 'object':
			case 'undefined':
				if (extra == undefined) {
					args.push('--esn', key);
				} else if (Array.isArray(extra)) {
					const joined = extra.join(',');
					const flag = extra.every((n) => Number.isInteger(n)) ? '--eia' : '--efa';
					args.push(flag, key, joined);
				}
				break;
		}
	}

	let res: string;
	try {
		res = await adb.shell(args);
	} catch (err) {
		throw new Error(`Error attempting to start intent. Original error: ${err}`);
	}
	if (res.toLowerCase().includes('unable to resolve intent')) {
		throw new Error(res);
	}
}
