import io from 'socket.io-client';
import { Board, form } from './board';
import { Display } from './display';
import * as editorController from './handle-socket';
import { on } from './socket-spec';

const board = new Board();
const socket = io(new URL('../edit', location.href).href);

on(socket, editorController.connect);
on(socket, editorController.disconnect);
on(socket, editorController.addCell(board));
on(socket, editorController.deleteCell);
on(socket, editorController.moveCell);
on(socket, editorController.showPreview(board));
on(socket, editorController.resizeWall(board));

board.element.addEventListener('move', event => {
    const display = Display.get(event.target!)!;
    socket.emit('move-cell', display.toJSON());
});
form.addEventListener('change', event => {
    const input = event.target as HTMLInputElement | HTMLSelectElement;
    switch (input.name) {
        // Adjust width and height of the CellWall board
        case 'width':
        case 'height':
            const value = parseInt(input.value, 10);
            board.setDimension(input.name, value);
            board.updateScale();
            socket.emit('resize-wall', input.name, value);
            break;
        case 'preview':
            const { checked } = input as HTMLInputElement;
            board.showPreview(checked);
            socket.emit('show-preview', checked);
            break;
    }
});
window.addEventListener('resize', () => {
    board.updateContainerDimensions();
    board.updateScale();
});
