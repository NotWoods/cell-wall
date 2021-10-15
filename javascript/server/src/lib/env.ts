import { config } from 'dotenv';

config();

export const VERSION = '4.0.0';

export const SERVER_ADDRESS = process.env['SERVER_ADDRESS'] as string;

/**
 * Package name for the Android app
 */
export const PACKAGE_NAME = 'com.tigeroakes.cellwall.client';

/**
 * The Google API client ID for your application.
 */
export const GOOGLE_CLIENT_ID = process.env['GOOGLE_CLIENT_ID'] as string | undefined;

/**
 * The Google API client secret for your application.
 */
export const GOOGLE_CLIENT_SECRET = process.env['GOOGLE_CLIENT_SECRET'] as string | undefined;

/**
 * GitHub API personal access token
 */
export const GITHUB_TOKEN = process.env['GITHUB_TOKEN'] as string | undefined;

/**
 * Path where the database file will be stored
 */
export const DATABASE_FILENAME = process.env['DATABASE_FILENAME'] as string | undefined;