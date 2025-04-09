
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Project } from '@/lib/types/project';
import { Task } from '@/lib/types/task';

interface ProjectOverviewProps {
  project: Project;
  tasks: Task[];
  milestones?: any[];
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({ 
  project, 
  tasks,
  milestones
}) => {
  // Calculate stats
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const completionRate = tasks.length > 0 
    ? Math.round((completedTasks / tasks.length) * 100) 
    : 0;
  
  return (
    <Card className="glass-card p-6 rounded-xl">
      <CardHeader>
        <CardTitle>Project Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-md">
              <h3 className="font-semibold mb-2">Project Details</h3>
              <p><span className="font-medium">Name:</span> {project.name}</p>
              <p><span className="font-medium">Status:</span> {project.status}</p>
              <p><span className="font-medium">Due Date:</span> {new Date(project.dueDate).toLocaleDateString()}</p>
            </div>
            <div className="p-4 border rounded-md">
              <h3 className="font-semibold mb-2">Progress</h3>
              <p><span className="font-medium">Completion Rate:</span> {completionRate}%</p>
              <p><span className="font-medium">Tasks Completed:</span> {completedTasks} of {tasks.length}</p>
            </div>
          </div>
          
          {tasks.length > 0 ? (
            <div className="p-4 border rounded-md">
              <h3 className="font-semibold mb-2">Recent Tasks</h3>
              <ul className="space-y-2">
                {tasks.slice(0, 5).map((task) => (
                  <li key={task.id} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${task.completed ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                    <span>{task.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="p-4 border rounded-md text-center text-muted-foreground">
              No tasks found for this project.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectOverview;
