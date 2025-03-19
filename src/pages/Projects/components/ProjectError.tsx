
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { toast } from '@/components/ui/toast-wrapper';

interface ProjectErrorProps {
  error: unknown;
  refetch: () => void;
}

const ProjectError: React.FC<ProjectErrorProps> = ({ error, refetch }) => {
  const navigate = useNavigate();
  
  // Extract more detailed error message
  const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
  
  // Check specifically for database configuration issues
  const isConfigError = errorMessage.includes('configuration') || 
                         errorMessage.includes('recursion') || 
                         errorMessage.includes('policy') ||
                         errorMessage.includes('42P17') ||
                         errorMessage.includes('permission');
  
  const handleRetry = () => {
    toast.info("Retrying...", {
      description: "Attempting to reconnect to the database."
    });
    refetch();
  };
  
  const handleGoBack = () => {
    navigate('/projects');
  };
  
  return (
    <div className="p-8 text-center">
      <div className="flex justify-center mb-4">
        <AlertTriangle className="h-12 w-12 text-destructive" />
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Unable to load project</h2>
      
      {isConfigError ? (
        <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4 mb-6 max-w-md mx-auto">
          <p className="text-destructive font-medium mb-2">Database configuration issue</p>
          <p className="text-muted-foreground text-sm">
            There's an issue with the database security policies.
            This has been logged and will be addressed by our team.
          </p>
        </div>
      ) : (
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {errorMessage}
        </p>
      )}
      
      <div className="flex justify-center gap-4">
        <button 
          onClick={handleRetry} 
          className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
        <button 
          onClick={handleGoBack} 
          className="bg-secondary text-primary px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          Back to Projects
        </button>
      </div>
      
      {isConfigError && (
        <p className="text-xs text-muted-foreground mt-6 max-w-md mx-auto">
          Technical details: Row Level Security recursion detected in database policies.
          Error code: {errorMessage.includes('42P17') ? '42P17' : 'RLS-RECURSION'}
        </p>
      )}
    </div>
  );
};

export default ProjectError;
