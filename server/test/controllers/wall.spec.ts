import request from 'supertest';
import { getActions, getWall } from '../../src/controllers/wall';
import { MockWall } from '../mock-wall';
import { makeApp } from './make-app';

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
