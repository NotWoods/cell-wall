export interface CellInfo {
  deviceName: string;
  density?: number;
  widthPixels?: number;
  heightPixels?: number;
  /**
   * Server URL that the client uses.
   */
  server?: string;
}
