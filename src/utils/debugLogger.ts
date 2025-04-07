
// Debug logging utilities

/**
 * Log debug messages with module context
 */
export const debugLog = (module: string, ...args: any[]) => {
  console.log(`[${module}]`, ...args);
};

/**
 * Log error messages with module context
 */
export const debugError = (module: string, ...args: any[]) => {
  console.error(`[${module}] ERROR:`, ...args);
};
