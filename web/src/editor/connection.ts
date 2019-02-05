import io from 'socket.io-client';
import { form, Display, Board } from './editor-ui';

const socket = io(new URL('../edit', location.href).href);
const board = new Board();

interface CellInfo {
    /**
     * UUID to identify the phone.
     */
    id: string;
    /** User-readable string representing the phone model. */
    deviceName: string;
    position: {
        x: number;
        y: number;
    };
    display: {
        /**
         * The logical density of the display. This is a scaling factor for the `dp`,
         * where one `dp` is one `px` on a 160dpi screen. Thus on a 160dpi screen,
         * this density value will be 1; on a 120dpi screen it would be .75; etc.
         */
        density: number;
        heightPixels: number;
        widthPixels: number;
    };
}

socket.on('connect', () => {
    document.body.classList.add('connected');
});
socket.on('disconnect', () => {
    document.body.classList.remove('connected');
});
socket.on('add-cell', (cell: CellInfo) => {
    const info: CellInfo = cell;
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
socket.on('delete-cell', (id: string) => {
    const display = Display.get(id);
    if (display) display.destroy();
});
socket.on('move-cell', ({ id, x, y }: { id: string; x: number; y: number }) => {
    const display = Display.get(id);
    display.setPosition(x, y);
});
socket.on('show-preview', (show: boolean) => board.showPreview(show));
socket.on('resize-wall', (dimension: 'width' | 'height', value: number) => {
    board.setDimension(dimension, value);
    board.updateScale();
});

board.element.addEventListener('move', event => {
    const display = Display.get(event.target);
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
