
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface AccessDeniedProps {
  message?: string;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({ 
  message = "You don't have permission to access this resource." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
        <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-500" />
      </div>
      <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
      <p className="text-muted-foreground max-w-md">{message}</p>
    </div>
  );
};

export default AccessDenied;
