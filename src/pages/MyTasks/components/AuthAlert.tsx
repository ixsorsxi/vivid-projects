
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const AuthAlert = () => {
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Authentication Required</AlertTitle>
      <AlertDescription>
        You're using the app in demo mode. Sign in to save your tasks and access all features.
      </AlertDescription>
    </Alert>
  );
};

export default AuthAlert;
