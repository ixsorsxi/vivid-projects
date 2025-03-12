
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Task } from '@/lib/data';
import TaskCard from '../dashboard/TaskCard';

interface TasksSectionProps {
  projectId: string;
  tasks: Task[];
}

const TasksSection: React.FC<TasksSectionProps> = ({ projectId, tasks }) => {
  const tasksByStatus = {
    'not-started': tasks.filter(task => task.status === 'to-do'),
    'in-progress': tasks.filter(task => task.status === 'in-progress'),
    'completed': tasks.filter(task => task.status === 'completed')
  };

  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Project Tasks</h2>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Not Started</h3>
            <Badge variant="outline">{tasksByStatus['not-started'].length}</Badge>
          </div>
          <div className="space-y-3">
            {tasksByStatus['not-started'].map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">In Progress</h3>
            <Badge variant="outline">{tasksByStatus['in-progress'].length}</Badge>
          </div>
          <div className="space-y-3">
            {tasksByStatus['in-progress'].map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Completed</h3>
            <Badge variant="outline">{tasksByStatus['completed'].length}</Badge>
          </div>
          <div className="space-y-3">
            {tasksByStatus['completed'].map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksSection;
