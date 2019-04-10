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
export const connect: SocketSpec<void> = {
    event: 'connect',
    handler() {
        document.body.classList.add('connected');
    },
};

/**
 * disconnect
 * Remove the 'connected' class to `<body>`
 */
export const disconnect: SocketSpec<void> = {
    event: 'disconnect',
    handler() {
        document.body.classList.remove('connected');
    },
};

export function addCell(board: Board): SocketSpec<CellInfo> {
    return {
        event: 'add-cell',
        handler(info) {
            console.log(info);
            const display = new Display(
                info.id,
                info.deviceName,
                (info.display.widthPixels / info.display.density) * 2,
                (info.display.heightPixels / info.display.density) * 2,
            );
            board.add(display.element);
            display.setPosition(info.position.x, info.position.y);
        },
    };
}

export const deleteCell: SocketSpec<string> = {
    event: 'delete-cell',
    handler(id) {
        const display = Display.get(id);
        if (display) display.destroy();
    },
};

export const moveCell: SocketSpec<{ id: string; x: number; y: number }> = {
    event: 'move-cell',
    handler({ id, x, y }) {
        const display = Display.get(id)!;
        display.setPosition(x, y);
    },
};

export function showPreview(board: Board): SocketSpec<boolean> {
    return {
        event: 'show-preview',
        handler(show) {
            board.showPreview(show);
        },
    };
}

export function resizeWall(
    board: Board,
): SocketSpec<{ width?: number; height?: number }> {
    return {
        event: 'resize-wall',
        handler(opts) {
            if (opts.width != null) {
                board.setDimension('width', opts.width);
            }
            if (opts.height != null) {
                board.setDimension('height', opts.height);
            }
            board.updateScale();
        },
    };
}
