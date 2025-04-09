
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Project } from '@/lib/types/project';
import { Task } from '@/lib/types/task';

interface ProjectOverviewProps {
  project: Project;
  tasks: Task[];
  milestones: any[];
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({ project, tasks, milestones }) => {
  // Calculate stats
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const taskCompletion = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Name</h3>
              <p>{project.name}</p>
            </div>
            <div>
              <h3 className="font-medium">Description</h3>
              <p>{project.description || 'No description provided'}</p>
            </div>
            <div>
              <h3 className="font-medium">Status</h3>
              <p className="capitalize">{project.status?.replace('-', ' ') || 'Not Started'}</p>
            </div>
            <div>
              <h3 className="font-medium">Due Date</h3>
              <p>{project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'No due date'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Tasks</h3>
              <p>{completedTasks} of {totalTasks} completed ({taskCompletion}%)</p>
            </div>
            <div>
              <h3 className="font-medium">Milestones</h3>
              <p>{milestones.length} milestone(s)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectOverview;
