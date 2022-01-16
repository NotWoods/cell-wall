import type { ADB } from 'appium-adb';
import { escapeShellArg } from 'appium-adb/build/lib/helpers.js';

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

export class StartIntentError extends Error {
	name = 'StartIntentError';
}

export class UnresolvedIntentError extends Error {
	name = 'UnresolvedIntentError';
}

export interface StartIntentOptions {
	action?: string | undefined;
	dataUri?: string | URL | undefined;
	mimeType?: string | undefined;
	category?: string | undefined;
	component?: string | undefined;
	flags?: readonly string[] | undefined;
	extras?: {
		[key: string]: string | boolean | number | null | undefined | readonly number[];
	};
	waitForLaunch?: boolean | undefined;
}

export async function startIntent(adb: ADB, options: StartIntentOptions): Promise<void> {
	const { waitForLaunch = true, flags = [], extras = {} } = options;

	const args = ['am', 'start'];
	if (waitForLaunch) {
		args.push('-W');
	}
	if (options.action) {
		args.push('-a', options.action);
	}
	if (options.dataUri) {
		args.push('-d', escapeShellArg(options.dataUri.toString()));
	}
	if (options.mimeType) {
		args.push('-t', options.mimeType);
	}
	if (options.category) {
		args.push('-c', options.category);
	}
	if (options.component) {
		args.push('-n', options.component);
	}
	for (const flag of flags) {
		args.push('-f', flag);
	}
	for (const [key, extra] of Object.entries(extras)) {
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
		throw new StartIntentError(`Error attempting to start intent. Original error: ${err}`);
	}
	if (res.toLowerCase().includes('unable to resolve intent')) {
		throw new UnresolvedIntentError(res);
	}
}