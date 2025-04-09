
import React from 'react';
import { Project } from '@/lib/types/project';
import { Task } from '@/lib/types/task';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProjectOverviewProps {
  project: Project;
  tasks: Task[];
  milestones: any[];
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({ project, tasks, milestones }) => {
  // Calculate some stats
  const completedTasks = tasks.filter(task => task.status === 'completed' || task.completed).length;
  const totalTasks = tasks.length;
  const percentComplete = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Project Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-medium">{project.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tasks:</span>
                <span className="font-medium">{completedTasks} of {totalTasks} completed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Progress:</span>
                <span className="font-medium">{percentComplete}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category:</span>
                <span className="font-medium">{project.category || 'Not specified'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {tasks.length > 0 ? (
              <div className="space-y-3">
                {tasks.slice(0, 3).map(task => (
                  <div key={task.id} className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${task.completed ? 'bg-green-500' : 'bg-amber-500'}`} />
                    <span className="truncate">{task.title}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No recent activity</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Upcoming Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            {milestones && milestones.length > 0 ? (
              <div className="space-y-3">
                {milestones.slice(0, 3).map((milestone, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <span className="truncate">{milestone.title || 'Unnamed milestone'}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No upcoming milestones</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Project Description</CardTitle>
        </CardHeader>
        <CardContent>
          {project.description ? (
            <p>{project.description}</p>
          ) : (
            <p className="text-muted-foreground">No description provided for this project.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectOverview;
