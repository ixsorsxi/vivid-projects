
/**
 * Debug logging helper that can be easily turned off in production
 */
export const debugLog = (
  component: string,
  message: string,
  ...args: any[]
) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[${component}] ${message}`, ...args);
  }
};

/**
 * Debug error logging helper that can be easily turned off in production
 */
export const debugError = (
  component: string,
  message: string,
  ...args: any[]
) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[${component}] ${message}`, ...args);
  }
};
