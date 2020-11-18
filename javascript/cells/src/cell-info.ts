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
