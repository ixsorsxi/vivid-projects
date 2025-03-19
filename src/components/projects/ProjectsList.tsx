import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectType } from '@/types/project';
import { FolderKanban } from 'lucide-react';
import ProjectDueDate from '@/components/dashboard/ProjectCard/ProjectDueDate';
import ProjectStatus from '@/components/dashboard/ProjectCard/ProjectStatus';
import ProjectCardMembers from '@/components/dashboard/ProjectCardMembers';
import ProjectProgressBar from '@/components/dashboard/ProjectProgressBar';
import { createTask, updateTask, deleteTask } from '@/api/tasks';

interface ProjectsListProps {
  projects: ProjectType[];
  isLoading?: boolean;
}

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-2 w-full mt-3" />
            <div className="flex justify-between items-center mt-3">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const ProjectsList: React.FC<ProjectsListProps> = ({ projects, isLoading = false }) => {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
        <FolderKanban className="h-12 w-12 mb-4" />
        <h3 className="text-lg font-medium">No projects found</h3>
        <p className="text-sm mt-1">
          Create a new project or adjust your search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <Link 
          key={project.id} 
          to={`/projects/${project.id}`}
          className="block"
        >
          <Card className="h-full hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium truncate pr-4">{project.name}</h3>
                  <ProjectStatus status={project.status} />
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                
                <ProjectProgressBar progress={project.progress} />
                
                <div className="flex justify-between items-center mt-3">
                  <ProjectDueDate dueDate={project.dueDate} />
                  <ProjectCardMembers members={project.members} />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default ProjectsList;
