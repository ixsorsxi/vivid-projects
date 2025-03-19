
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ProjectErrorProps {
  error: unknown;
  refetch: () => void;
}

const ProjectError: React.FC<ProjectErrorProps> = ({ error, refetch }) => {
  const navigate = useNavigate();
  
  return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-semibold mb-4">Unable to load project</h2>
      <p className="text-muted-foreground mb-6">
        {error instanceof Error ? error.message : "An unexpected error occurred"}
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
