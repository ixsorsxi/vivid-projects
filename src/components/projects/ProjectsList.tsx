
import React from 'react';
import { Grid, Loader } from 'lucide-react';
import ProjectCard from './ProjectCard';
import { ProjectType } from '@/types/project';

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
      <div className="flex flex-col items-center justify-center py-12">
        <Loader className="w-6 h-6 text-primary animate-spin mb-2" />
        <p className="text-muted-foreground">Loading projects...</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Grid className="w-8 h-8 text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium">No projects found</h3>
        <p className="text-sm text-muted-foreground mt-1">
          There are no projects matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};

export default ProjectsList;
