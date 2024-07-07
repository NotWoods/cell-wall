import { describe, expect, it, vi, type MockedFunction } from 'vitest';
import type { ADB } from 'appium-adb';
import { writable } from 'svelte/store';
import { androidPowered } from '../android-powered.js';

function mockAdb() {
	const shell: MockedFunction<ADB['shell']> = vi.fn().mockResolvedValue('');
	const keyevent: MockedFunction<ADB['keyevent']> = vi.fn().mockResolvedValue(undefined);
	const cycleWakeUp: MockedFunction<ADB['cycleWakeUp']> = vi.fn().mockResolvedValue(undefined);
	return {
		shell,
		keyevent,
		cycleWakeUp,

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
	it('gets power state for all on device', async () => {
		const adbOn = mockAdb().mockWakefulness('Awake');
		const adbOff = mockAdb().mockWakefulness('Dozing');

		const devices = new Map([
			['ON', adbOn],
			['OFF', adbOff]
		]);
		const devicesStore = writable(devices);

		return new Promise<void>((done) => {
			const powered = androidPowered(devicesStore as any);
			const cleanup = powered.subscribe((poweredOn) => {
				if (poweredOn.size === 0) return;

				expect(poweredOn).toEqual(new Set(['ON']));
				done();
				cleanup();
			});
		});
	});
});
