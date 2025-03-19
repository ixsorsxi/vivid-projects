
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

interface ProjectErrorProps {
  error: unknown;
  refetch: () => void;
}

const ProjectError: React.FC<ProjectErrorProps> = ({ error, refetch }) => {
  const navigate = useNavigate();
  
  // Extract more detailed error message
  const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
  const isConfigError = errorMessage.includes('configuration') || 
                         errorMessage.includes('recursion') || 
                         errorMessage.includes('policy') || 
                         errorMessage.includes('42P17');
  
  return (
    <div className="p-8 text-center">
      <div className="flex justify-center mb-4">
        <AlertTriangle className="h-12 w-12 text-destructive" />
      </div>
      <h2 className="text-xl font-semibold mb-4">Unable to load project</h2>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        {isConfigError 
          ? "There's a database configuration issue. Our team has been notified about this problem."
          : errorMessage}
      </p>
      <div className="flex justify-center gap-4">
        <button 
          onClick={() => refetch()} 
          className="bg-primary text-white px-4 py-2 rounded-md"
        >
          Try Again
        </button>
        <button 
          onClick={() => navigate('/projects')} 
          className="bg-secondary text-primary px-4 py-2 rounded-md"
        >
          Back to Projects
        </button>
      </div>
    </div>
  );
};

export default ProjectError;
