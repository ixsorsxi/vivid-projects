
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Task } from '@/lib/data';
import { CalendarIcon, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskFormFieldsProps {
  newTask: Partial<Task>;
  handleChange: (field: string, value: any) => void;
}

const TaskFormFields: React.FC<TaskFormFieldsProps> = ({
  newTask,
  handleChange
}) => {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="title" className="text-right">
          Title*
        </Label>
        <Input
          id="title"
          value={newTask.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          className="col-span-3"
          placeholder="Enter task title"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">
          Description
        </Label>
        <Textarea
          id="description"
          value={newTask.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          className="col-span-3"
          placeholder="Add details about the task"
          rows={3}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="status" className="text-right">
          Status
        </Label>
        <Select 
          value={newTask.status || 'to-do'} 
          onValueChange={(value) => handleChange('status', value)}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="to-do">To Do</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="in-review">In Review</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="priority" className="text-right">
          Priority
        </Label>
        <Select 
          value={newTask.priority || 'medium'} 
          onValueChange={(value) => handleChange('priority', value)}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="dueDate" className="text-right">
          Due Date
        </Label>
        <div className="col-span-3 relative">
          <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="dueDate"
            type="date"
            min={today}
            value={newTask.dueDate || today}
            onChange={(e) => handleChange('dueDate', e.target.value)}
            className={cn("pl-9", newTask.dueDate && "text-foreground")}
          />
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">
          Assignee
        </Label>
        <div className="col-span-3 bg-muted/50 rounded-md p-2 flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
            <UserPlus className="h-3 w-3 text-primary" />
          </div>
          <span className="text-sm">Me</span>
        </div>
      </div>
    </div>
  );
};

export default TaskFormFields;
