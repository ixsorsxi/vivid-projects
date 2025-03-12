
import React from 'react';
import { Clock, ListFilter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TaskCard from './TaskCard';
import FadeIn from '../animations/FadeIn';

interface TasksListProps {
  tasks: Array<any>;
}

export const TasksList = ({ tasks }: TasksListProps) => {
  return (
    <div className="glass-card rounded-xl p-5">
      <FadeIn duration={800} delay={200}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">My Tasks</h2>
            <p className="text-muted-foreground text-sm">
              <Clock className="inline h-3.5 w-3.5 mr-1" />
              Updated 3 minutes ago
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-8">
              <ListFilter className="h-3.5 w-3.5 mr-2" />
              Filter
            </Button>
            <Button size="sm" className="h-8">
              <Plus className="h-3.5 w-3.5 mr-2" />
              Add Task
            </Button>
          </div>
        </div>
        
        <div className="space-y-3">
          {tasks.map((task, index) => (
            <TaskCard 
              key={task.id}
              task={task}
            />
          ))}
        </div>
        
        {tasks.length === 0 && (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No tasks found</p>
          </div>
        )}
        
        {tasks.length > 0 && (
          <div className="mt-4 text-center">
            <Button variant="ghost" size="sm">View All Tasks</Button>
          </div>
        )}
      </FadeIn>
    </div>
  );
};

export default TasksList;
