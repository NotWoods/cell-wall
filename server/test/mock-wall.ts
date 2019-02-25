import { ObservableSet } from '../src/models/ObservableSet';
import { Wall } from '../src/models/Wall';

export class MockWall implements Wall {
    width = 100;
    height = 100;
    knownCells = new Map<string, any>();
    ready = Promise.resolve();
    showingPreview = false;
    connectedCells = new ObservableSet<any>();
    toJSON = jest.fn().mockReturnValue({
        width: 100,
        height: 100,
        knownCells: [],
    });
    fromJSON = jest.fn();
    centerCell = jest.fn();
    surroundingCells = jest.fn();
    getCell = jest.fn();
    save = jest.fn().mockReturnValue(Promise.resolve());
    [Symbol.iterator] = jest.fn();
}
