
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Task } from '@/lib/types/task';
import { Project } from '@/lib/types/project';

interface ProjectOverviewProps {
  project: Project;
  tasks?: Task[];
  milestones?: any[];
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({ project, tasks = [], milestones = [] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <p className="font-medium">Name</p>
              <p className="text-sm text-muted-foreground">{project.name}</p>
            </div>
            <div>
              <p className="font-medium">Description</p>
              <p className="text-sm text-muted-foreground">{project.description || 'No description provided'}</p>
            </div>
            <div>
              <p className="font-medium">Status</p>
              <p className="text-sm text-muted-foreground capitalize">{project.status}</p>
            </div>
            <div>
              <p className="font-medium">Project Manager</p>
              <p className="text-sm text-muted-foreground">{project.project_manager_name || 'Not assigned'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <p className="font-medium">Overall Progress</p>
              <div className="w-full bg-secondary h-2 rounded-full mt-1">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${project.progress || 0}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground text-right">{project.progress || 0}%</p>
            </div>
            <div>
              <p className="font-medium">Tasks</p>
              <p className="text-sm text-muted-foreground">{tasks.length} total</p>
            </div>
            <div>
              <p className="font-medium">Milestones</p>
              <p className="text-sm text-muted-foreground">{milestones.length} total</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectOverview;
