
import React from 'react';
import ProjectCard from '@/components/dashboard/ProjectCard';
import NewProjectModal from '@/components/projects/NewProjectModal';
import { ProjectType } from '@/types/project';

interface ProjectsListProps {
  projects: ProjectType[];
  emptyStateMessage: string;
}

const ProjectsList = ({ projects, emptyStateMessage }: ProjectsListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.length > 0 ? (
        projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <h3 className="text-lg font-medium">No projects found</h3>
          <p className="text-muted-foreground">
            {emptyStateMessage}
          </p>
          <NewProjectModal buttonClassName="mt-4" />
        </div>
      )}
    </div>
  );
};

export default ProjectsList;
