
// Debug logging utilities

// Debug mode flag to control logging
let debugModeEnabled = false;

/**
 * Log debug messages with module context
 */
export const debugLog = (module: string, ...args: any[]) => {
  if (debugModeEnabled) {
    console.log(`[${module}]`, ...args);
  }
};

/**
 * Log error messages with module context
 */
export const debugError = (module: string, ...args: any[]) => {
  console.error(`[${module}] ERROR:`, ...args);
};

/**
 * Enable debug logging
 */
export const enableDebugLogs = () => {
  debugModeEnabled = true;
  console.log("Debug mode enabled");
};

/**
 * Disable debug logging
 */
export const disableDebugLogs = () => {
  debugModeEnabled = false;
  console.log("Debug mode disabled");
};

/**
 * Check if debug mode is enabled
 */
export const isDebugEnabled = () => debugModeEnabled;
