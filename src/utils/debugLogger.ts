
/**
 * Debug log function to consistently format log messages
 */
export const debugLog = (module: string, ...args: any[]) => {
  console.log(`[${module}]`, ...args);
};

/**
 * Debug error function to consistently format error messages
 */
export const debugError = (module: string, ...args: any[]) => {
  console.error(`[${module}]`, ...args);
};
