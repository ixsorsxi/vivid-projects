
import { PostgrestError } from '@supabase/supabase-js';
import { toast } from '@/components/ui/toast-wrapper';
import { TaskApiError } from './types';

export const handleDatabaseError = (error: PostgrestError | null): TaskApiError => {
  if (!error) {
    return new Error('Unknown database error') as TaskApiError;
  }

  console.error('Database error:', error);
  
  // Handle specific error cases
  if (error.message && error.message.includes('infinite recursion')) {
    return new Error('infinite recursion detected in policy for relation "tasks"') as TaskApiError;
  } else if (error.message && error.message.includes('violates row-level security')) {
    return new Error('Permission denied: You do not have permission to access this resource.') as TaskApiError;
  } else {
    return new Error(error.message || 'An unexpected database error occurred') as TaskApiError;
  }
};

export const displayErrorToast = (error: Error | TaskApiError | unknown, defaultMessage = 'An unexpected error occurred'): void => {
  const err = error as Error;
  
  toast.error('Error', {
    description: err.message || defaultMessage
  });
};

export const timeoutPromise = <T>(ms: number): Promise<T | null> => {
  return new Promise<T | null>((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, ms);
  });
};
