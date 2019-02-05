import { Joi } from 'koa-joi-router';
import { CellState, blank, cellStateSchema } from './CellState';

/**
 * @see {@link{https://developer.android.com/reference/android/util/DisplayMetrics}}
 */
interface DisplayMetrics {
    /**
     * The logical density of the display. This is a scaling factor for the `dp`,
     * where one `dp` is one `px` on a 160dpi screen. Thus on a 160dpi screen,
     * this density value will be 1; on a 120dpi screen it would be .75; etc.
     */
    density: number;
    heightPixels: number;
    widthPixels: number;
}

export type UUID = string;

/**
 * Each "Cell" corresponds to a cell phone on the wall.
 */
export interface CellModel {
    /**
     * UUID to identify the phone.
     */
    id: UUID;
    /**
     * User-readable string representing the phone model.
     */
    deviceName: string;
    position: {
        x: number;
        y: number;
    };
    display: DisplayMetrics;

    state: CellState;
}

export class Cell implements CellModel {
    deviceName = '';
    position = { x: 0, y: 0 };
    display = {
        density: 1,
        heightPixels: 160,
        widthPixels: 90,
    };

    onchange?: (state: CellState) => void;

    private _state: CellState = blank();

    get state() {
        return this._state;
    }
    set state(value) {
        if (this.onchange) this.onchange(value);
        this._state = value;
    }

    constructor(public id: UUID) {}
}

export const cellSchema = Joi.object({
    id: Joi.string()
        .guid()
        .required(),
    deviceName: Joi.string().required(),
    position: {
        x: Joi.number().required(),
        y: Joi.number().required(),
    },
    display: {
        density: Joi.number()
            .positive()
            .required(),
        heightPixels: Joi.number()
            .positive()
            .required(),
        widthPixels: Joi.number()
            .positive()
            .required(),
    },
    state: cellStateSchema,
});
