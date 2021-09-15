import type { ADB } from 'appium-adb';

const POWER_BUTTON = 26;

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

/**
 * Press the power button on the given Android device.
 */
export async function togglePower(adb: ADB): Promise<void> {
	await adb.keyevent(POWER_BUTTON);
}

export interface StartIntentOptions {
	action?: string;
	dataUri?: string;
	mimeType?: string;
	category?: string;
	component?: string;
	flags?: readonly string[];
	extras?: {
		[key: string]: string | boolean | number | null | undefined | number[];
	};
	waitForLaunch?: boolean;
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
		args.push('-d', options.dataUri);
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

	try {
		const res = await adb.shell(args);
		if (res.toLowerCase().includes('unable to resolve intent')) {
			throw new Error(res);
		}
	} catch (e) {
		throw new Error(`Error attempting to start intent. Original error: ${e}`);
	}
}
