
import React from 'react';
import { Calendar, Tag, Clock, CheckCircle } from 'lucide-react';

interface ProjectStatsProps {
  dueDate: string;
  category: string;
  progress: number;
  tasks: {
    total: number;
    completed: number;
  };
}

const ProjectStats: React.FC<ProjectStatsProps> = ({
  dueDate,
  category,
  progress,
  tasks
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="glass-card p-5 rounded-xl flex items-center gap-4">
        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
          <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Due Date</p>
          <p className="font-medium">{dueDate}</p>
        </div>
      </div>
      
      <div className="glass-card p-5 rounded-xl flex items-center gap-4">
        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-lg">
          <Tag className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Category</p>
          <p className="font-medium">{category}</p>
        </div>
      </div>
      
      <div className="glass-card p-5 rounded-xl flex items-center gap-4">
        <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-lg">
          <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Progress</p>
          <div className="flex items-center gap-2">
            <div className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 rounded-full" 
                style={{width: `${progress}%`}}
              ></div>
            </div>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
        </div>
      </div>
      
      <div className="glass-card p-5 rounded-xl flex items-center gap-4">
        <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
          <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Tasks</p>
          <p className="font-medium">
            {tasks.completed}/{tasks.total} Completed
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectStats;
