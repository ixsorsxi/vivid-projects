
import React from 'react';
import { ProjectType } from '@/types/project';
import ProjectCard from './ProjectCard';

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className="p-6 rounded-lg border border-border bg-card shadow-sm animate-pulse h-64"
          >
            <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-muted rounded w-1/2 mb-6"></div>
            <div className="flex gap-2 mb-4">
              <div className="h-6 w-16 bg-muted rounded"></div>
              <div className="h-6 w-16 bg-muted rounded"></div>
            </div>
            <div className="h-3 bg-muted rounded w-full mb-2"></div>
            <div className="h-3 bg-muted rounded w-full mb-2"></div>
            <div className="h-3 bg-muted rounded w-3/4"></div>
            <div className="flex justify-between mt-6">
              <div className="h-8 w-8 bg-muted rounded-full"></div>
              <div className="h-8 w-20 bg-muted rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed rounded-lg">
        <h3 className="text-lg font-medium mb-2">No projects found</h3>
        <p className="text-muted-foreground text-center max-w-md">
          You don't have any projects matching these criteria. Create a new project to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <ProjectCard 
          key={project.id} 
          project={project} 
          onProjectUpdated={refetchProjects}
        />
      ))}
    </div>
  );
};

export default ProjectsList;
