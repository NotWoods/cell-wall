jest.mock('../../../server/fs');

import * as fs from '../../../server/fs';
import { liveConfig, LiveConfig } from '../../../server/config/live-config';

describe('liveConfig', () => {
    let store: LiveConfig;

    beforeEach(() => {
        jest.clearAllMocks();
        store = liveConfig('./config.json', './config.default.json');
    });

    test('getStateSync returns undefined if state is not loaded', async () => {
        expect(store.getStateSync()).toBeUndefined();

        expect(await store.getState()).toBeDefined();

        expect(store.getStateSync()).toBeDefined();
    });

    test('setState writes to the file', async () => {
        await store.setState({ width: 'test' } as any);

        expect(fs.writeJson).toBeCalledWith('./config.json', { width: 'test' });
    });
});
