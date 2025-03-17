
import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TaskPageHeaderProps {
  taskCount: number;
  onAddTask: () => void;
}

const TaskPageHeader: React.FC<TaskPageHeaderProps> = ({ 
  taskCount, 
  onAddTask 
}) => {
  return (
    <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-6 rounded-xl mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">My Tasks</h1>
          <p className="text-muted-foreground mt-1">
            {taskCount} {taskCount === 1 ? 'task' : 'tasks'} to manage
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={onAddTask}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
            size="sm"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskPageHeader;
