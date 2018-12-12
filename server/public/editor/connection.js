// @ts-check
import { form, Display, Board } from './editor-ui.js';

const socket = io(new URL('../edit', location.href).href);
const board = new Board();

/**
 * @typedef {object} CellInfo
 * @prop {string} id
 * @prop {string} deviceName
 * @prop {object} position
 * @prop {number} position.x
 * @prop {number} position.y
 * @prop {object} display
 * @prop {number} display.density
 * @prop {number} display.widthPixels
 * @prop {number} display.heightPixels
 */

socket.on('connect', () => {
    document.body.classList.add('connected');
});
socket.on('disconnect', () => {
    document.body.classList.remove('connected');
});
socket.on('add-cell', cell => {
    /** @type {CellInfo} */
    const info = cell;
    console.log(cell);
    const display = new Display(
        info.id,
        info.deviceName,
        (info.display.widthPixels / info.display.density) * 2,
        (info.display.heightPixels / info.display.density) * 2,
    );
    board.add(display.element);
    display.setPosition(info.position.x, info.position.y);
});
socket.on('delete-cell', id => {
    const display = Display.get(id);
    if (display) display.destroy();
});
socket.on('move-cell', ({ id, x, y }) => {
    const display = Display.get(id);
    display.setPosition(x, y);
});
socket.on('show-preview', show => board.showPreview(show));
socket.on('resize-wall', (dimension, value) => {
    board.setDimension(dimension, value);
    board.updateScale();
});

board.element.addEventListener('move', event => {
    const display = Display.get(event.target);
    socket.emit('move-cell', display.toJSON());
});
form.addEventListener('change', event => {
    const input =
        /** @type {HTMLInputElement|HTMLSelectElement} */ (event.target);
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
            const { checked } = /** @type {HTMLInputElement} */ (input);
            board.showPreview(checked);
            socket.emit('show-preview', checked);
            break;
    }
});
window.addEventListener('resize', () => {
    board.updateContainerDimensions();
    board.updateScale();
});
