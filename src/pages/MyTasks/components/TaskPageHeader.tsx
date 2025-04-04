
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import FadeIn from '@/components/animations/FadeIn';

interface TaskPageHeaderProps {
  taskCount: number;
  onAddTask: () => void;
}

const TaskPageHeader: React.FC<TaskPageHeaderProps> = ({ taskCount, onAddTask }) => {
  return (
    <FadeIn duration={800}>
      <div className="flex flex-col mb-8 gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              My Tasks
            </h1>
            <Badge variant="primary">
              {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            Manage and track your assigned tasks and activities
          </p>
        </div>
        
        <Button onClick={onAddTask} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>
    </FadeIn>
  );
};

export default TaskPageHeader;
