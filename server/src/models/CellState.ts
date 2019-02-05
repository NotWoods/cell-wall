import { Joi } from 'koa-joi-router';

export enum CellStateType {
    BLANK = 'BLANK',
    IDENTIFY = 'IDENTIFY',
    TEXT = 'TEXT',
    IMAGE = 'IMAGE',
    BUTTON = 'BUTTON',
}

export type CellState =
    | ReturnType<typeof blank>
    | ReturnType<typeof identify>
    | ReturnType<typeof text>
    | ReturnType<typeof image>
    | ReturnType<typeof button>;

function createState<M extends CellStateType, T>(type: M, data: T) {
    return { type, data };
}

export const blank = () => createState(CellStateType.BLANK, {});

/**
 * Shows a unique shape and color to match a cell with a representation
 * on the server-side editor.
 * @param {string} backgroundColor
 * @param {string} icon
 */
export const identify = (backgroundColor: string, icon: string) =>
    createState(CellStateType.IDENTIFY, { backgroundColor, icon });

/**
 * Shows some large text on the cell.
 * @param {string} text
 */
export const text = (text: string) => createState(CellStateType.TEXT, { text });

/**
 * Shows an image on the cell.
 * @param {string} src
 */
export const image = (src: string, scale: 'cover' | 'contain' = 'cover') =>
    createState(CellStateType.IMAGE, { src, scale });

/**
 * Shows a button with some color and icon.
 * @param {string} backgroundColor
 * @param {string} icon
 */
export const button = (backgroundColor: string, icon: string) =>
    createState(CellStateType.BUTTON, { backgroundColor, icon });

export const cellStateSchema = Joi.object({
    type: Joi.string().required(),
    data: Joi.object().required(),
});
