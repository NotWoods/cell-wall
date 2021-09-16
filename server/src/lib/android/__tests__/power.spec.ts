import { describe, expect, it, jest } from '@jest/globals';
import { checkIfOn, togglePower } from '../adb-action';

describe('checkIfOn', () => {
	it('check cmd output', async () => {
		const adb = jest.fn();
		const cmdOutput = `Power Manager State:
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
mHoldingDisplaySuspendBlocker=true`;

		expect(await checkIfOn(adb, cmdOutput)).toBe(true);
	});
});

describe('togglePower', () => {
	it('runs keyevent', async () => {
		const keyevent = jest.fn();
		const adb: any = { keyevent };

		await togglePower(adb);

		expect(keyevent).toHaveBeenCalledWith(26);
	});
});
