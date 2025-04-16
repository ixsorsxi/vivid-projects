
import { PostgrestError } from '@supabase/supabase-js';
import { ProjectApiError } from './types';

/**
 * Handles database errors and creates a standardized error object
 */
export const handleDatabaseError = (error: PostgrestError): ProjectApiError => {
  console.error('Database error:', error);
  
  // Extract the most useful information from the error
  const apiError: ProjectApiError = {
    message: 'Database operation failed',
    details: error.message,
    name: 'DatabaseError'
  };
  
  // Handle specific error codes
  if (error.code === '23505') {
    apiError.message = 'A duplicate record already exists';
  } else if (error.code === '23503') {
    apiError.message = 'Referenced record does not exist';
  } else if (error.code === '42P01') {
    apiError.message = 'Table does not exist';
  } else if (error.code === '42703') {
    apiError.message = 'Column does not exist';
  }
  
  return apiError;
};

/**
 * Formats a date to ISO string without milliseconds
 */
export const formatDateForDB = (date: Date | string): string => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return date.toISOString();
};

// Helper function for promises with timeouts
export const timeoutPromise = <T>(ms: number): Promise<T> => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Operation timed out after ${ms}ms`));
    }, ms);
  });
};
