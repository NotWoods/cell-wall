export interface CellInfo {
  deviceName: string;
  width: number;
  height: number;
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
