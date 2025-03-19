
import { PostgrestError } from '@supabase/supabase-js';
import { toast } from '@/components/ui/toast-wrapper';
import { ProjectApiError } from './types';

export const handleDatabaseError = (error: PostgrestError | null): ProjectApiError => {
  if (!error) {
    return new Error('Unknown database error') as ProjectApiError;
  }

  console.error('Database error:', error);
  
  // Handle specific error cases
  if (error.code === '42501') {
    return new Error('Permission denied: You do not have permission to access this resource.') as ProjectApiError;
  } else if (error.code === '23505') {
    return new Error('A duplicate entry exists: This item already exists in the database.') as ProjectApiError;
  } else if (error.code === '23503') {
    return new Error('Referenced record does not exist: The item you are trying to reference does not exist.') as ProjectApiError;
  } else if (error.code === '42P17') {
    return new Error('Database configuration error: Please contact the administrator.') as ProjectApiError;
  } else if (error.message && error.message.includes('policy')) {
    return new Error('Access denied: You may not have permission for this action.') as ProjectApiError;
  } else {
    return new Error(error.message || 'An unexpected database error occurred') as ProjectApiError;
  }
};

export const displayErrorToast = (error: Error | ProjectApiError | unknown, defaultMessage = 'An unexpected error occurred'): void => {
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
