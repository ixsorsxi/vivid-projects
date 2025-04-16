
import React from 'react';
import { ProjectType } from '@/types/project';
import { Card } from '@/components/ui/card';

export interface ProjectsListProps {
  projects: ProjectType[];
  isLoading?: boolean;
  refetchProjects?: () => void;
}

const ProjectsList: React.FC<ProjectsListProps> = ({ 
  projects, 
  isLoading = false,
  refetchProjects
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <Card key={item} className="p-4 space-y-3">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-lg font-medium mb-2">No projects found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or create a new project</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <Card key={project.id} className="p-4">
          <h3 className="text-lg font-medium mb-1">{project.name}</h3>
          <p className="text-muted-foreground text-sm mb-2">
            {project.description || 'No description provided'}
          </p>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              Status: <span className="font-medium capitalize">{project.status.replace('-', ' ')}</span>
            </div>
            <div className="text-sm">
              Due date: <span className="font-medium">{new Date(project.dueDate).toLocaleDateString()}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ProjectsList;
