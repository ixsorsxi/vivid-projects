
/**
 * Debug utility for consistent logging format
 */

// Control whether debug logs are shown (can be toggled via localStorage)
const isDebugEnabled = () => {
  if (typeof window === 'undefined') return true; // Always log on server
  return localStorage.getItem('debug_enabled') === 'true';
};

export const debugLog = (context: string, ...args: any[]) => {
  if (!isDebugEnabled()) return;
  
  console.log(
    `%c[${context}]%c`,
    'color: #3b82f6; font-weight: bold;',
    'color: inherit;',
    ...args
  );
};

export const debugError = (context: string, ...args: any[]) => {
  if (!isDebugEnabled()) return;
  
  console.error(
    `%c[${context}]%c ERROR:`,
    'color: #ef4444; font-weight: bold;',
    'color: inherit;',
    ...args
  );
};

// Helper to enable debug logs from UI
export const enableDebugLogs = () => {
  localStorage.setItem('debug_enabled', 'true');
  console.log('Debug logs enabled');
  
  // Log system info for debugging
  debugLog('SYSTEM', 'Debug mode enabled');
  debugLog('SYSTEM', 'User Agent:', navigator.userAgent);
  debugLog('SYSTEM', 'Current URL:', window.location.href);
  debugLog('SYSTEM', 'Timestamp:', new Date().toISOString());
};

// Helper to disable debug logs
export const disableDebugLogs = () => {
  localStorage.setItem('debug_enabled', 'false');
  console.log('Debug logs disabled');
};

// For easier debugging of specific errors in the application
export const debugLogError = (error: unknown, context: string = 'ERROR') => {
  if (!isDebugEnabled()) return;
  
  if (error instanceof Error) {
    debugError(context, error.message);
    if (error.stack) {
      console.error('%cStack Trace:', 'color: #ef4444;', error.stack);
    }
    
    // Additional info for specific error types
    if ('code' in error && typeof error.code === 'string') {
      debugError(context, `Error Code: ${error.code}`);
    }
    
    if ('details' in error && error.details) {
      debugError(context, 'Details:', error.details);
    }
  } else {
    debugError(context, 'Unknown error:', error);
  }
};

// Enable debug logs by default in non-production environments
if (process.env.NODE_ENV !== 'production') {
  enableDebugLogs();
}
