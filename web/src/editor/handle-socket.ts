import { Board } from './board';
import { Display } from './display';
import { SocketSpec } from './socket-spec';

interface CellInfo {
    /** UUID to identify the phone. */
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

/**
 * connect
 * Add the 'connected' class to `<body>`
 */
export const connect: SocketSpec = {
    event: 'connect',
    handler() {
        document.body.classList.add('connected');
    },
};

/**
 * disconnect
 * Remove the 'connected' class to `<body>`
 */
export const disconnect: SocketSpec = {
    event: 'disconnect',
    handler() {
        document.body.classList.remove('connected');
    },
};

export const addCell: SocketSpec = {
    event: 'add-cell',
    handler(info: CellInfo) {
        console.log(info);
        const display = new Display(
            info.id,
            info.deviceName,
            (info.display.widthPixels / info.display.density) * 2,
            (info.display.heightPixels / info.display.density) * 2,
        );
        Board.instance.add(display.element);
        display.setPosition(info.position.x, info.position.y);
    },
};

export const deleteCell: SocketSpec = {
    event: 'delete-cell',
    handler(id: string) {
        const display = Display.get(id);
        if (display) display.destroy();
    },
};

export const moveCell: SocketSpec = {
    event: 'move-cell',
    handler({ id, x, y }: { id: string; x: number; y: number }) {
        const display = Display.get(id)!;
        display.setPosition(x, y);
    },
};

export const showPreview: SocketSpec = {
    event: 'show-preview',
    handler(show: boolean) {
        Board.instance.showPreview(show);
    },
};
export const resizeWall: SocketSpec = {
    event: 'resize-wall',
    handler(dimension: 'width' | 'height', value: number) {
        Board.instance.setDimension(dimension, value);
        Board.instance.updateScale();
    },
};
