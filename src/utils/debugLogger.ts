

/**
 * Debug log function to consistently format log messages
 */
export const debugLog = (module: string, ...args: any[]) => {
  if (debugModeEnabled) {
    console.log(`[${module}]`, ...args);
  }
};

/**
 * Debug error function to consistently format error messages
 */
export const debugError = (module: string, ...args: any[]) => {
  console.error(`[${module}]`, ...args);
};

// Debug mode flag to control logging
let debugModeEnabled = true; // Changed default to true for development

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

