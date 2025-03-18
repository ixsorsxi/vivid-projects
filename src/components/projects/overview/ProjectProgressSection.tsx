
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { CheckSquare, BarChart3 } from 'lucide-react';
import { PriorityLevel } from '@/lib/types/common';

interface ProjectProgressSectionProps {
  progress: number;
  completionRate: number;
  completedTasks: number;
  totalTasks: number;
  priority: PriorityLevel | string;
}

const ProjectProgressSection: React.FC<ProjectProgressSectionProps> = ({ 
  progress, 
  completionRate, 
  completedTasks, 
  totalTasks,
  priority
}) => {
  return (
    <div>
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <h3 className="font-medium">Project Progress</h3>
          <span className="text-sm font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
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
          <span className="text-sm font-medium">{completedTasks}/{totalTasks}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">Priority Level</span>
          </div>
          <span className={`text-sm font-medium ${
            priority === 'high' || priority === 'urgent' ? 'text-red-500' :
            priority === 'medium' ? 'text-amber-500' :
            'text-green-500'
          }`}>
            {typeof priority === 'string' ? priority.charAt(0).toUpperCase() + priority.slice(1) : 'Medium'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectProgressSection;
