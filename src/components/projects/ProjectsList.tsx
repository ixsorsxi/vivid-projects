
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Project } from '@/lib/types/project';

interface ProjectsListProps {
  projects: Project[];
  status?: string;
}

const ProjectsList: React.FC<ProjectsListProps> = ({ projects, status }) => {
  const filteredProjects = status 
    ? projects.filter(project => project.status === status) 
    : projects;

  return (
    <div className="space-y-4">
      {filteredProjects.length > 0 ? (
        filteredProjects.map(project => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <h3 className="text-lg font-medium">{project.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {project.description || 'No description'}
              </p>
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {project.status}
                  </span>
                  {project.category && (
                    <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">
                      {project.category}
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  Due: {new Date(project.dueDate).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center py-6 text-muted-foreground">
          <p>No projects found</p>
        </div>
      )}
    </div>
  );
};

export default ProjectsList;
