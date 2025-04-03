
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProjectById } from '@/api/projects';
import { toast } from '@/components/ui/toast-wrapper';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ProjectEditForm from '@/components/projects/edit/ProjectEditForm';

const ProjectEdit = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  
  const { 
    data: project, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      if (!projectId) return null;
      return fetchProjectById(projectId);
    },
    enabled: !!projectId,
  });

  useEffect(() => {
    if (error) {
      console.error('Error loading project:', error);
      toast.error('Error loading project', {
        description: 'Unable to load project details. Please try again.'
      });
    }
  }, [error]);

  const handleGoBack = () => {
    navigate(`/projects/${projectId}`);
  };

  const handleSaveSuccess = () => {
    // Refetch the project data to ensure we have the latest
    refetch();
    
    // Navigate back to project details view
    navigate(`/projects/${projectId}`, { 
      state: { refreshData: true }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="space-y-4 p-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/projects')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </div>
        
        <div className="rounded-lg border p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Project Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The project you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button onClick={() => navigate('/projects')}>
            Go to Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={handleGoBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Project
          </Button>
        </div>
        <h1 className="text-xl font-semibold">Edit Project</h1>
      </div>
      
      <div className="glass-card p-6 rounded-xl">
        <ProjectEditForm 
          projectId={projectId || ''} 
          project={project}
          onSave={handleSaveSuccess}
          onCancel={handleGoBack}
        />
      </div>
    </div>
  );
};

export default ProjectEdit;
