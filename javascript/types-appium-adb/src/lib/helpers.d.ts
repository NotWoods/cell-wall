/**
 * in milliseconds
 */
export const DEFAULT_ADB_EXEC_TIMEOUT: 20000;

/**
 * Retrieves the actual path to SDK root folder from the system environment
 *
 * @return {?string} The full path to the SDK root folder
 */
export function getSdkRootFromEnv(): string | undefined;
