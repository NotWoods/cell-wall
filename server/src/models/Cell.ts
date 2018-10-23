import { CellState, blank } from "./CellState";

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
  id: UUID;
  deviceName = "";
  position = { x: 0, y: 0 };
  display = {
    density: 1,
    heightPixels: 160,
    widthPixels: 90
  };
  state = blank();

  constructor(id: UUID) {
    this.id = id;
  }
}
