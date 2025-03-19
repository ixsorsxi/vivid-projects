
import { AuthError } from '@supabase/supabase-js';
import { toast } from '@/components/ui/toast-wrapper';

export const handleDatabaseError = (error: any): { message: string, details?: string } => {
  console.error('Database error:', error);

  if (error instanceof AuthError) {
    // Authentication-related error
    return {
      message: 'Authentication failed',
      details: error.message
    };
  }

  if (error?.code) {
    // Specific database error codes
    switch (error.code) {
      case '23505': // unique_violation
        return {
          message: 'Duplicate entry',
          details: 'This entry already exists. Please use a different value.'
        };
      case '42P01': // undefined_table
        return {
          message: 'Missing table',
          details: 'A required database table is missing.'
        };
      case '42501': // insufficient_privilege
        return {
          message: 'Insufficient permissions',
          details: 'You do not have the necessary permissions to perform this action.'
        };
      case '42P17':
        return {
          message: 'Row Level Security recursion error',
          details: 'There is an issue with the database security policies.'
        };
      default:
        return {
          message: 'Database error',
          details: `An unexpected database error occurred. Code: ${error.code}`
        };
    }
  }

  // Check for specific error messages
  if (error?.message?.includes('Row Level Security')) {
    return {
      message: 'Access denied',
      details: 'You do not have permission to access this resource.'
    };
  }

  // Generic error
  return {
    message: 'An unexpected error occurred',
    details: error.message || 'Please check the logs for more details.'
  };
};

export const timeoutPromise = <T>(promise: Promise<T>, ms: number, errorMessage: string = 'Request timed out'): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), ms)
    )
  ]);
};
