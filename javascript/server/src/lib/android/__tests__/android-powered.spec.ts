import { describe, expect, it, jest } from '@jest/globals';
import type ADB from 'appium-adb';
import { writable } from 'svelte/store';
import { androidPowered } from '../android-powered';

function mockAdb() {
	const shell = jest.fn<ADB['shell']>().mockResolvedValue('');
	return {
		shell,
		keyevent: jest.fn<ADB['keyevent']>().mockResolvedValue(),
		cycleWakeUp: jest.fn<ADB['cycleWakeUp']>().mockResolvedValue(),

		mockWakefulness(wakefulness: 'Awake' | 'Dozing') {
			shell.mockImplementation(async (args) => {
				if (args[0] === 'dumpsys' && args[1] === 'power') {
					return `mWakefulness=${wakefulness}`;
				} else {
					return '';
				}
			});
			return this;
		}
	};
}

describe('androidPowered.subscribe', () => {
	it('gets power state for all on device', (done) => {
		const adbOn = mockAdb().mockWakefulness('Awake');
		const adbOff = mockAdb().mockWakefulness('Dozing');

		const devices = new Map([
			['ON', adbOn],
			['OFF', adbOff]
		]);
		const devicesStore = writable(devices);

		const powered = androidPowered(devicesStore as any);
		const cleanup = powered.subscribe((poweredOn) => {
			if (poweredOn.size === 0) return;

			expect(poweredOn).toEqual(new Set(['ON']));
			done();
			cleanup();
		});
	});
});
