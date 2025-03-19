
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
    return new Error('Permission denied: Database access is currently restricted for this operation.') as ProjectApiError;
  } else if (error.code === '23505') {
    return new Error('A duplicate entry exists: This item already exists in the database.') as ProjectApiError;
  } else if (error.code === '23503') {
    return new Error('Referenced record does not exist: The item you are trying to reference does not exist.') as ProjectApiError;
  } else if (error.code === '42P17' || (error.message && error.message.includes('recursion'))) {
    // Better handling for recursion errors
    console.error('Database recursion detected, this is likely due to an issue with RLS policies');
    return new Error('Database configuration issue: The system encountered a recursion in security policies. Our team has been notified.') as ProjectApiError;
  } else if (error.message && error.message.includes('policy')) {
    return new Error('Access denied: Database access policy is preventing this operation.') as ProjectApiError;
  } else if (error.message && error.message.includes('JWSError')) {
    return new Error('Authentication error: Please try logging out and logging back in.') as ProjectApiError;
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
