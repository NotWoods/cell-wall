import request from 'supertest';
import { getState, putCell } from '../../src/controllers/cell';
import { MockWall } from '../mock-wall';
import { makeApp } from './make-app';
import { blank } from '../../src/models/CellState';

describe('Cell Controller', () => {
    const uuid = '7eda477b-d7df-4a36-90e9-5ab9c3c067ba';

    const wall = new MockWall();
    const app = makeApp([getState(wall), putCell(wall)]);

    test('putCell', async () => {
        const cell = {
            deviceName: 'Pixel 10,000',
            density: 320,
            widthPixels: 1080,
            heightPixels: 1920,
        };

        const response = await request(app)
            .put(`/cell/${uuid}`)
            .send(cell)
            .expect(201);
        expect(response.body).toEqual({
            id: uuid,
            deviceName: 'Pixel 10,000',
            position: { x: expect.any(Number), y: expect.any(Number) },
            display: {
                density: cell.density,
                widthPixels: cell.widthPixels,
                heightPixels: cell.heightPixels,
            },
            state: blank(),
        });
    });
});
