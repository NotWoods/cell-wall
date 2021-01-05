export interface CellInfo {
  /**
   * User-friendly name for the device.
   */
  deviceName: string;
  /**
   * Width and height in density independent pixels.
   */
  width: number;
  height: number;
  /**
   * X/Y location relative to other cells.
   */
  x: number;
  y: number;
  /**
   * Server URL that the client uses.
   */
  server?: string;
}

export function cellCoordsValid(info: CellInfo) {
  return (
    !isNaN(info.x) &&
    !isNaN(info.y) &&
    !isNaN(info.width) &&
    !isNaN(info.height)
  );
}
