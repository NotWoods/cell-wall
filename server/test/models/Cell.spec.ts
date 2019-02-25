import { Cell } from '../../src/models/Cell';
import { blank, text } from '../../src/models/CellState';

describe('Cell', () => {
    const uuid = '7eda477b-d7df-4a36-90e9-5ab9c3c067ba';

    test('default values', () => {
        const cell = new Cell(uuid);
        expect(cell).toMatchObject({
            id: uuid,
            deviceName: '',
            position: { x: 0, y: 0 },
            display: {
                density: 1,
                heightPixels: 160,
                widthPixels: 90,
            },
        });
        expect(cell.state).toEqual(blank());
    });

    test('onchange', () => {
        const cell = new Cell(uuid);
        cell.onchange = jest.fn();
        cell.state = text('Hello world');

        expect(cell.state).toEqual(text('Hello world'));
        expect(cell.onchange).toHaveBeenCalledWith(text('Hello world'));
    });
});
