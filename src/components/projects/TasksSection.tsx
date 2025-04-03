
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProjectTask } from '@/hooks/project-form/types';

interface TasksSectionProps {
  tasks: ProjectTask[];
  addTask: (task: ProjectTask) => Promise<any>;
  updateTask: (taskId: string, field: keyof ProjectTask, value: string) => Promise<void>;
  removeTask: (taskId: string) => Promise<void>;
  projectId?: string;
}

const TasksSection: React.FC<TasksSectionProps> = ({
  tasks,
  addTask,
  updateTask,
  removeTask,
  projectId
}) => {
  const handleAddTask = () => {
    const newTask: ProjectTask = {
      id: `task-${Date.now()}`,
      title: '',
      description: '',
      status: 'to-do',
      priority: 'medium',
      dueDate: ''
    };
    
    // If we have a projectId, add it to the task
    if (projectId) {
      (newTask as any).project_id = projectId;
    }
    
    addTask(newTask);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Project Tasks</h3>
        <Button type="button" variant="outline" size="sm" onClick={handleAddTask}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>
      
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <div key={task.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Task {index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeTask(task.id || '')}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  placeholder="Task title"
                  value={task.title}
                  onChange={(e) => updateTask(task.id || '', 'title', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Task description"
                  value={task.description || ''}
                  onChange={(e) => updateTask(task.id || '', 'description', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={task.dueDate || ''}
                    onChange={(e) => updateTask(task.id || '', 'dueDate', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={task.status || 'to-do'}
                    onValueChange={(value) => updateTask(task.id || '', 'status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="to-do">To Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={task.priority || 'medium'}
                    onValueChange={(value) => updateTask(task.id || '', 'priority', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {tasks.length === 0 && (
          <div className="text-center p-4 border border-dashed rounded-lg">
            <p className="text-muted-foreground">No tasks added yet. Click the button above to add a task.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksSection;
