
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
};

// Helper to disable debug logs
export const disableDebugLogs = () => {
  localStorage.setItem('debug_enabled', 'false');
  console.log('Debug logs disabled');
};
