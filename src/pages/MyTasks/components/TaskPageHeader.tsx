
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ListTodo } from 'lucide-react';
import { Badge } from '@/components/ui/badge.custom';
import { motion } from 'framer-motion';

interface TaskPageHeaderProps {
  taskCount: number;
  onAddTask: () => void;
}

const TaskPageHeader: React.FC<TaskPageHeaderProps> = ({ taskCount, onAddTask }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="mb-8"
    >
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <ListTodo className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">
                My Tasks
              </h1>
            </div>
            <Badge variant="primary" className="bg-primary/15 text-primary">
              {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-2 max-w-3xl">
            Manage and track your assigned tasks and activities. Stay organized and prioritize your work efficiently.
          </p>
        </div>
        
        <Button onClick={onAddTask} className="gap-2 shadow-sm transition-all hover:shadow-md hover:translate-y-[-1px]">
          <Plus className="h-4 w-4" />
          Create New Task
        </Button>
      </div>
      
      <div className="mt-6 h-1 w-full bg-gradient-to-r from-primary/10 via-primary/30 to-primary/5 rounded-full" />
    </motion.div>
  );
};

export default TaskPageHeader;
