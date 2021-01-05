export const version = '3.1.0';

/**
 * Path to the cell info file.
 *
 * This file contains the expected cell phones,
 * and represents them as a map of device serial numbers to cell info.
 *
 * Cell info includes the user-friendly name of a device,
 * the width and height of the display in density independent pixels,
 * and the x/y location relative to other phones.
 */
export const cellsPath = process.env.CELLS_PATH || 'cell-info.json';

/**
 * The Google API client ID for your application.
 */
export const googleClientId = process.env.GOOGLE_CLIENT_ID;

/**
 * The Google API client secret for your application.
 */
export const googleClientServer = process.env.GOOGLE_CLIENT_SECRET;

export const serverAddress = process.env.SERVER_ADDRESS;
