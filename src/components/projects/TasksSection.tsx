
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar, X, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProjectTask } from '@/hooks/useProjectForm';
import { Textarea } from "@/components/ui/textarea";

interface TasksSectionProps {
  tasks: ProjectTask[];
  addTask: () => void;
  updateTask: (taskId: string, field: keyof ProjectTask, value: string) => void;
  removeTask: (taskId: string) => void;
}

const TasksSection: React.FC<TasksSectionProps> = ({
  tasks,
  addTask,
  updateTask,
  removeTask
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Project Tasks</h3>
        <Button type="button" variant="outline" size="sm" onClick={addTask}>
          <Calendar className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>
      
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <div key={task.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Task {index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeTask(task.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  placeholder="Task title"
                  value={task.title}
                  onChange={(e) => updateTask(task.id, 'title', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={task.dueDate}
                  onChange={(e) => updateTask(task.id, 'dueDate', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Task description"
                value={task.description}
                onChange={(e) => updateTask(task.id, 'description', e.target.value)}
                className="min-h-[80px]"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={task.status}
                  onValueChange={(value) => updateTask(task.id, 'status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="to-do">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={task.priority}
                  onValueChange={(value) => updateTask(task.id, 'priority', value)}
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
        ))}
      </div>
    </div>
  );
};

export default TasksSection;
