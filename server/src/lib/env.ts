export const VERSION = '4.0.0';

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
export const CELLS_PATH = import.meta.env['CELLS_PATH'] as string;

/**
 * The Google API client ID for your application.
 */
export const GOOGLE_CLIENT_ID = import.meta.env['GOOGLE_CLIENT_ID'] as string | undefined;

/**
 * The Google API client secret for your application.
 */
export const GOOGLE_CLIENT_SECRET = import.meta.env['GOOGLE_CLIENT_SECRET'] as string | undefined;

export const SERVER_ADDRESS = import.meta.env['SERVER_ADDRESS'] as string;

export const PACKAGE_NAME = 'com.tigeroakes.cellwall.client';

export const SQLITE_FILENAME = import.meta.env['SQLITE_FILENAME'] as string | undefined;
