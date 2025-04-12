
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectType } from '@/types/project';
import { FolderKanban, MoreHorizontal, Calendar, Users, Trash2 } from 'lucide-react';
import ProjectDueDate from '@/components/dashboard/ProjectCard/ProjectDueDate';
import ProjectStatus from '@/components/dashboard/ProjectCard/ProjectStatus';
import ProjectCardMembers from '@/components/dashboard/ProjectCardMembers';
import ProjectProgressBar from '@/components/dashboard/ProjectProgressBar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useProjectDelete } from '@/components/projects/settings/hooks/useProjectDelete';
import DeleteConfirmDialog from '@/components/projects/settings/components/DeleteConfirmDialog';
import DeleteErrorDialog from '@/components/projects/settings/components/DeleteErrorDialog';

interface ProjectsListProps {
  projects: ProjectType[];
  isLoading?: boolean;
  refetchProjects?: () => void;
}

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="overflow-hidden border border-border/70">
        <div className="h-3 bg-gradient-to-r from-primary/70 to-primary/30 w-full"></div>
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

const ProjectsList: React.FC<ProjectsListProps> = ({ projects, isLoading = false, refetchProjects }) => {
  const navigate = useNavigate();
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  
  const { 
    isDeleting, 
    deleteError, 
    deleteProject, 
    showConfirmDialog, 
    setShowConfirmDialog,
    showErrorDialog,
    setShowErrorDialog
  } = useProjectDelete({ 
    projectId: activeProjectId || '',
    refetchProjects,
    onSuccess: () => {
      // This will be called after successful deletion
      // No need to do anything here as navigation is handled in the hook
    }
  });

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

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500';
      case 'in progress':
        return 'bg-blue-500';
      case 'on hold':
        return 'bg-amber-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const handleDeleteClick = (projectId: string, projectName: string) => {
    setActiveProjectId(projectId);
    setShowConfirmDialog(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((project) => (
          <Card 
            key={project.id} 
            className="overflow-hidden border border-border/70 hover:shadow-md hover:border-primary/20 transition-all duration-200"
          >
            <div className={`h-1.5 ${getStatusColor(project.status)} w-full`}></div>
            <CardContent className="p-5">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium truncate pr-4">{project.name}</h3>
                  <ProjectStatus status={project.status} />
                </div>
                
                <p className="text-sm text-muted-foreground truncate-2 min-h-[40px]">
                  {project.description || 'No description provided.'}
                </p>
                
                <ProjectProgressBar progress={project.progress} />
                
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    <ProjectDueDate dueDate={project.dueDate} />
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{(project.members || []).length} members</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-0 border-t">
              <div className="flex items-center w-full">
                <Button 
                  variant="ghost" 
                  className="flex-1 rounded-none h-12 text-primary hover:text-primary hover:bg-primary/5"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  View Details
                </Button>
                <div className="border-l h-12 flex items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-none h-12 w-12 text-muted-foreground">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/projects/${project.id}/edit`)}>
                        Edit Project
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/projects/${project.id}`)}>
                        View Tasks
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDeleteClick(project.id, project.name)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Confirmation Dialog */}
      <DeleteConfirmDialog 
        isOpen={showConfirmDialog}
        projectName={projects.find(p => p.id === activeProjectId)?.name || "this"}
        onOpenChange={setShowConfirmDialog}
        onConfirmDelete={deleteProject}
        isDeleting={isDeleting}
      />
      
      {/* Error Dialog */}
      <DeleteErrorDialog
        isOpen={showErrorDialog}
        onOpenChange={setShowErrorDialog}
        errorMessage={deleteError}
      />
    </>
  );
}

export default ProjectsList;
