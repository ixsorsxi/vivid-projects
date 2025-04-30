/**
 * Format date to YYYY-MM-DD format
 */
export const formatDateToYYYYMMDD = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Format date to Month Day, Year format
 */
export const formatDateToMonthDayYear = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format date to Month Day format
 */
export const formatToMonthDay = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format date to display in a relative way
 */
export const formatDueDate = (dateString: string): string => {
  if (!dateString) return 'No date';
  
  const date = new Date(dateString);
  const now = new Date();
  
  // Check if date is valid
  if (isNaN(date.getTime())) return 'Invalid date';
  
  // Calculate difference in days
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} overdue`;
  } else if (diffDays === 0) {
    return 'Due today';
  } else if (diffDays === 1) {
    return 'Due tomorrow';
  } else if (diffDays <= 7) {
    return `Due in ${diffDays} days`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: now.getFullYear() !== date.getFullYear() ? 'numeric' : undefined,
    });
  }
};

/**
 * Format date to display in a relative way for timestamps
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  
  // Check if date is valid
  if (isNaN(date.getTime())) return '';
  
  // If it's today
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit'
    });
  }
  
  // If it's in the last week
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 7) {
    return date.toLocaleDateString('en-US', {
      weekday: 'short'
    });
  }
  
  // Otherwise show date
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: now.getFullYear() !== date.getFullYear() ? 'numeric' : undefined,
  });
};
