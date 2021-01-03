import { DeviceManager } from '@cell-wall/android-bridge';
import { CellManager, CellStateType } from '@cell-wall/cells';
import test from 'ava';
import { EventEmitter } from 'events';
import sinon from 'sinon';
import {
  cellBridge,
  cellBridgeHandler,
} from '../../src/decorate/cell-bridge.js';

const mockDeviceManager = { devices: new Map() } as DeviceManager;
const mockCells = new EventEmitter() as CellManager;

function mockAdb() {
  return {
    shell: sinon.fake.returns(Promise.resolve('')),
  };
}

test.before(() => {
  mockDeviceManager.devices.clear();
});

test.skip('cellBridge', async () => {
  cellBridge(mockDeviceManager, mockCells);
});

test('cellBridgeHandler', async (t) => {
  const handler = cellBridgeHandler(mockDeviceManager);

  const adb = mockAdb();
  mockDeviceManager.devices.set('ABC123', adb as any);

  await handler({
    serial: '456',
    info: undefined as any,
    state: undefined as any,
  });
  t.is(adb.shell.callCount, 0);

  await handler({
    serial: 'ABC123',
    info: undefined as any,
    state: {
      type: CellStateType.WEB,
      url: 'https://example.com',
    },
  });
  t.is(adb.shell.callCount, 1);
  t.deepEqual(adb.shell.lastCall.firstArg, [
    'am',
    'start',
    '-W',
    '-a',
    'com.tigeroakes.cellwall.client.DISPLAY',
    '-d',
    'https://example.com/',
  ]);
});
