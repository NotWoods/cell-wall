import { afterEach, describe, expect, it, vi } from 'vitest';
import { checkIfOn, getWakefulness, startIntent } from '../adb-actions.js';

describe('startIntent', () => {
	const shell = vi.fn().mockReturnValue('');
	const adb = { shell } as any;

	afterEach(() => {
		shell.mockReset();
		shell.mockReturnValue('');
	});

	it('runs command with no options', async () => {
		await startIntent(adb, {});
		expect(shell).toBeCalledWith(['am', 'start', '-W']);
	});

	it(`throws if intent doesn't resolve`, async () => {
		shell.mockReturnValue('Unable to resolve intent');
		await expect(startIntent(adb, {})).rejects.toMatchObject({
			message: 'Unable to resolve intent'
		});
	});
});

describe('startIntent', () => {
	it('check cmd output', async () => {
		const adb = {
			shell: vi.fn().mockReturnValue(`Power Manager State:
      Settings power_manager_constants:
        no_cached_wake_locks=true
      mDirty=0x0
      mWakefulness=Awake
      mWakefulnessChanging=false
      mIsPowered=true
      mDeviceIdleMode=false
      mDeviceIdleWhitelist=[1000, 1001, 2000, 10073, 10074, 10102, 10124, 10135, 10140, 10152, 10210]
      mDeviceIdleTempWhitelist=[]
      mLastWakeTime=20021037 (7416988 ms ago)
      mLastSleepTime=16134956 (11303069 ms ago)
      mLastSleepReason=timeout
      mLastUserActivityTime=20053105 (7384920 ms ago)
      mLastUserActivityTimeNoChangeLights=13335137 (14102888 ms ago)
      mLastInteractivePowerHintTime=20053105 (7384920 ms ago)
      mLastScreenBrightnessBoostTime=0 (27438025 ms ago)
      mScreenBrightnessBoostInProgress=false
      mDisplayReady=true
      mHoldingWakeLockSuspendBlocker=false
      mHoldingDisplaySuspendBlocker=true`)
		} as any;

		expect(await getWakefulness(adb)).toBe('Awake');
		expect(await checkIfOn(adb)).toBe(true);
	});
});
