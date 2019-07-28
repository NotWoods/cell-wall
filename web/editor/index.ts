import io from 'socket.io-client';
import { ConfigState } from '../server/state-types';
import { Board, form } from './board.js';
import { Display } from './display.js';

let state: ConfigState | undefined;

const board = new Board();
const uri = new URL('../', location.href).href;
const socket = io(uri)
    .on('connect', () => document.body.classList.add('connected'))
    .on('disconnect', () => document.body.classList.remove('connected'))
    .on('new-config-state', onStateChange);

function onStateChange(newState: ConfigState) {
    let addedDevices = new Set(Object.keys(newState.devices));
    let removedDevices = new Set<string>();
    let existingDevices = new Set<string>();
    if (state != undefined) {
        for (const udid of Object.keys(state.devices)) {
            if (!addedDevices.has(udid)) {
                // Not present in new devices
                removedDevices.add(udid);
            } else {
                // Present in new devices
                existingDevices.add(udid);
            }
            addedDevices.delete(udid);
        }
    }

    for (const udid of addedDevices) {
        const device = newState.devices[udid];
        const display = new Display(udid, device);
        board.add(display.element);
    }
    for (const udid of removedDevices) {
        const display = Display.get(udid);
        if (display) display.destroy();
    }
    for (const udid of existingDevices) {
        const device = newState.devices[udid];
        const display = Display.get(udid);
        if (display) {
            const [x, y] = device.position || [0, 0];
            display.setPosition(x, y);
        }
    }

    if (newState.width !== (state && state.width)) {
        board.setDimension('width', newState.width);
    }
    if (newState.height !== (state && state.height)) {
        board.setDimension('height', newState.height);
    }
    board.updateScale();
}

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
    }
});
window.addEventListener('resize', () => {
    board.updateContainerDimensions();
    board.updateScale();
});
