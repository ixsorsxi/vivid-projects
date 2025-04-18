
import { PostgrestError } from '@supabase/supabase-js';
import { Assignee } from '@/lib/types/task';

export const handleDatabaseError = (error: PostgrestError): any => {
  console.error('Database error:', error);
  
  // Extract the most useful information from the error
  const apiError = {
    message: 'Database operation failed',
    details: error.message,
    name: 'DatabaseError'
  };
  
  // Handle specific error codes
  if (error.code === '23505') {
    apiError.message = 'A duplicate record already exists';
  } else if (error.code === '23503') {
    apiError.message = 'Referenced record does not exist';
  }
  
  return apiError;
};

// Convert database assignee format to our app's Assignee format
export const formatAssignees = (dbAssignees: any[]): Assignee[] => {
  if (!dbAssignees || !Array.isArray(dbAssignees)) return [];
  
  return dbAssignees.map(assignee => ({
    id: assignee.id || '',
    name: assignee.name || '',
    avatar: assignee.avatar_url || ''
  }));
};

// Helper function for promises with timeouts
export const timeoutPromise = <T>(ms: number): Promise<T> => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Operation timed out after ${ms}ms`));
    }, ms);
  });
};
