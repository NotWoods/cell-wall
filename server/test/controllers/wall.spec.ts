import request = require('supertest');
import { getActions, getWall } from '../../src/controllers/wall';
import { ObservableSet } from '../../src/models/ObservableSet';
import { Wall } from '../../src/models/Wall';
import { makeApp } from './make-app';

class MockWall implements Wall {
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

describe('Wall Controller', () => {
    const wall = new MockWall();
    const app = makeApp([getWall(wall), getActions]);

    test('getWall', async () => {
        const response = await request(app)
            .get('/wall')
            .expect(200);
        expect(response.body).toEqual({
            width: 100,
            height: 100,
            knownCells: [],
        });
    });

    test('getActions', async () => {
        const response = await request(app)
            .get('/wall/actions')
            .expect(200);
        expect(response.body).toEqual(
            expect.arrayContaining([
                { id: 'demo', name: 'Text/photos demo' },
                { id: 'dashboard', name: 'Dashboard' },
                { id: 'todo', name: 'To Do' },
                { id: 'home', name: 'Home controls' },
                { id: 'simon', name: 'Simon says' },
            ]),
        );
    });
});
