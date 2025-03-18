
import React from 'react';
import { 
  Calendar, 
  BarChart3, 
  Users, 
  Clock, 
  CheckSquare,
  AlertCircle 
} from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { demoProjects, demoTasks } from '@/lib/data';
import { useParams } from 'react-router-dom';

const ProjectOverview: React.FC = () => {
  const { projectId } = useParams();
  
  // Find the current project (in a real app this would be fetched from API)
  const project = demoProjects.find(p => p.id === projectId) || demoProjects[0];
  
  // Get tasks for this project
  const projectTasks = demoTasks.filter(task => 
    task.project === project.name || task.project === project.name
  );
  
  // Calculate stats
  const completedTasks = projectTasks.filter(task => task.completed).length;
  const completionRate = projectTasks.length > 0 
    ? Math.round((completedTasks / projectTasks.length) * 100) 
    : 0;
  
  // Calculate days remaining
  const dueDate = new Date(project.dueDate);
  const today = new Date();
  const daysRemaining = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  // Check if project has recent activity
  const hasActivity = projectTasks.length > 0;
  
  // Get team members from either members or team property
  const projectMembers = project.members || (project.team?.map(member => ({ name: member.name })) || []);
  
  // Set default priority if not available
  const projectPriority = project.priority || 'medium';
  
  return (
    <div className="glass-card p-6 rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Project Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-medium">Due Date</h3>
              <p className="text-sm text-muted-foreground">
                {new Date(project.dueDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
                {daysRemaining > 0 ? ` (${daysRemaining} days remaining)` : ' (Overdue)'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-medium">Team Members</h3>
              <p className="text-sm text-muted-foreground">
                {projectMembers.length} members working on this project
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <h3 className="font-medium">Project Status</h3>
              <div className="text-sm">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  project.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                  project.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                  project.status === 'on-hold' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300' :
                  'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                }`}>
                  {project.status === 'in-progress' ? 'In Progress' : 
                   project.status === 'not-started' ? 'Not Started' : 
                   project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <h3 className="font-medium">Project Progress</h3>
              <span className="text-sm font-medium">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <h3 className="font-medium">Task Completion</h3>
              <span className="text-sm font-medium">{completionRate}%</span>
            </div>
            <Progress value={completionRate} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckSquare className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Completed Tasks</span>
              </div>
              <span className="text-sm font-medium">{completedTasks}/{projectTasks.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Priority Level</span>
              </div>
              <span className={`text-sm font-medium ${
                projectPriority === 'high' ? 'text-red-500' :
                projectPriority === 'medium' ? 'text-amber-500' :
                'text-green-500'
              }`}>
                {projectPriority.charAt(0).toUpperCase() + projectPriority.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {!hasActivity && (
        <div className="mt-6 p-5 border border-dashed rounded-lg flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <h3 className="font-medium">No recent activity</h3>
            <p className="text-sm text-muted-foreground mt-1">
              This project doesn't have any recorded activity yet.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectOverview;
