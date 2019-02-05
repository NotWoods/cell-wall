const board = {
    add: jest.fn(),
    showPreview: jest.fn(),
    setDimension: jest.fn(),
    updateScale: jest.fn(),
};
jest.mock('../../src/editor/board', () => ({ Board: { instance: board } }));
jest.mock('../../src/editor/display', () => ({ Display: jest.fn() }));

import {
    connect,
    disconnect,
    showPreview,
    resizeWall,
} from '../../src/editor/handle-socket';

describe('editorController', () => {
    beforeEach(() => {
        board.add.mockClear();
        board.showPreview.mockClear();
        board.setDimension.mockClear();
        board.updateScale.mockClear();
    });

    test('connect', () => {
        connect.handler();
        expect(document.body.className).toContain('connected');
    });

    test('disconnect', () => {
        disconnect.handler();
        expect(document.body.className).not.toContain('connected');
    });

    test('showPreview', () => {
        showPreview.handler(true);
        expect(board.showPreview).toBeCalledWith(true);
    });

    test('resizeWall', () => {
        resizeWall.handler('width', 200);
        expect(board.setDimension).toBeCalledWith('width', 200);
        expect(board.updateScale).toBeCalled();
    });
});
