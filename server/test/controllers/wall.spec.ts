import request = require('supertest');
import { getWall, getActions } from '../../src/controllers/wall';
import { makeApp } from './make-app';

describe('Wall Controller', () => {
    const app = makeApp([getWall, getActions]);

    test('getWall', async () => {
        const response = await request(app)
            .get('/wall')
            .expect(200);
        expect(response.body).toEqual({
            width: expect.any(Number),
            height: expect.any(Number),
            knownCells: expect.any(Array),
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
