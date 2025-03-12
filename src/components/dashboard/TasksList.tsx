
import React from 'react';
import { Clock, ListFilter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TaskCard from './TaskCard';
import FadeIn from '../animations/FadeIn';
import { useToast } from '@/hooks/use-toast';
import { Task } from '@/lib/data';

interface TasksListProps {
  tasks: Task[];
}

export const TasksList = ({ tasks }: TasksListProps) => {
  const { toast } = useToast();
  const [localTasks, setLocalTasks] = React.useState<Task[]>(tasks);
  
  React.useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);
  
  const handleToggleTaskStatus = (taskId: string) => {
    const updatedTasks = localTasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          completed: !task.completed,
          status: !task.completed ? 'completed' : 'in-progress'
        };
      }
      return task;
    });
    
    setLocalTasks(updatedTasks);
    
    toast({
      title: "Task updated",
      description: "Task status has been updated",
    });
  };

  return (
    <div className="glass-card rounded-xl p-5">
      <FadeIn duration={800} delay={200}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">My Tasks</h2>
            <p className="text-muted-foreground text-sm">
              <Clock className="inline h-3.5 w-3.5 mr-1" />
              {localTasks.length} pending tasks
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
          {localTasks.map((task) => (
            <TaskCard 
              key={task.id}
              task={task}
              onStatusChange={() => handleToggleTaskStatus(task.id)}
            />
          ))}
        </div>
        
        {localTasks.length === 0 && (
          <div className="text-center py-10">
            <p className="text-muted-foreground">All tasks completed! 🎉</p>
          </div>
        )}
        
        {localTasks.length > 0 && (
          <div className="mt-4 text-center">
            <Button variant="ghost" size="sm">View All Tasks</Button>
          </div>
        )}
      </FadeIn>
    </div>
  );
};

export default TasksList;
