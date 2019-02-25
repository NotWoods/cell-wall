import { ObservableSet } from '../../src/models/ObservableSet';

describe('ObservableSet', () => {
    test('add and remove listeners', () => {
        const set = new ObservableSet();
        const listener = jest.fn();

        set.addListener(listener);
        set.add(true);
        expect(listener).toHaveBeenCalled();

        listener.mockClear();
        set.removeListener(listener);
        set.add(false);
        expect(listener).not.toHaveBeenCalled();
    });
});
