import type { ADB } from 'appium-adb';
import { escapeShellArg } from 'appium-adb/build/lib/helpers.js';

// Simple actions missing from appium-adb

/**
 * Returns the device power status.
 * @returns "Awake" if the device is awake.
 */
export async function getWakefulness(adb: ADB) {
	const stdout = await adb.shell(['dumpsys', 'power', '|', 'grep', '"mWakefulness="']);
	const wakefulness = /mWakefulness=(\w+)/.exec(stdout)?.[1];
	return wakefulness;
}

/**
 * Checks if an Android device is on.
 */
export async function checkIfOn(adb: ADB): Promise<boolean> {
	const wakefulness = await getWakefulness(adb);
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

/**
 * Launch an intent on the given ADB device.
 * @param adb ADB device to use.
 * @param options.action The general action to be performed, represented as a package name.
 * @param options.dataUri The data to operate on, represented as a URI.
 * @param options.category Gives additional information about the action to execute
 * @param options.mimeType Specifies an explicit MIME type of the intent data.
 * Normally the type is inferred from the data itself.
 * @param options.component Specifies an explicit name of a component class to use for the intent.
 * @param options.extras This is a Bundle of any additional information.
 * This can be used to provide extended information to the component.
 * @param options.waitForLaunch Don't resolve until the intent has launched.
 */
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
		console.log(`adb -s ${adb.curDeviceId} ${args.join(' ')}`);
		res = await adb.shell(args);
	} catch (err) {
		console.error(adb.curDeviceId, err);
		throw new StartIntentError(`Error attempting to start intent. Original error: ${err}`);
	}
	if (res.toLowerCase().includes('unable to resolve intent')) {
		throw new UnresolvedIntentError(res);
	}
}
