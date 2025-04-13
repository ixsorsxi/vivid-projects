
// Simple utility for debug logging
export const debugLog = (context: string, ...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${context}]`, ...args);
  }
};

// Simple utility for error logging
export const debugError = (context: string, ...args: any[]) => {
  console.error(`[${context}]`, ...args);
};
