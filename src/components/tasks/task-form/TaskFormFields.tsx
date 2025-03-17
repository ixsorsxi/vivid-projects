
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Task } from '@/lib/data';
import { CalendarIcon, UserPlus } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from '@/lib/utils';
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar.custom";

interface TaskFormFieldsProps {
  newTask: Partial<Task>;
  handleChange: (field: string, value: any) => void;
  userRole?: 'admin' | 'manager' | 'user' | string;
}

const TaskFormFields: React.FC<TaskFormFieldsProps> = ({
  newTask,
  handleChange,
  userRole = 'user'
}) => {
  const today = new Date().toISOString().split('T')[0];
  
  // Convert string date to Date object for the Calendar component
  const dueDateValue = newTask.dueDate ? new Date(newTask.dueDate) : new Date();
  
  const onDateChange = (date: Date | undefined) => {
    if (date) {
      const formattedDate = date.toISOString().split('T')[0];
      handleChange('dueDate', formattedDate);
    }
  };

  const handleRemoveAssignee = (name: string) => {
    if (newTask.assignees) {
      handleChange('assignees', newTask.assignees.filter(a => a.name !== name));
    }
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="title" className="text-right">
          Title<span className="text-destructive ml-0.5">*</span>
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
        <div className="col-span-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !newTask.dueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {newTask.dueDate ? format(dueDateValue, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDateValue}
                onSelect={onDateChange}
                initialFocus
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">
          Assignee
        </Label>
        <div className="col-span-3">
          {newTask.assignees && newTask.assignees.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-2">
              {newTask.assignees.map((assignee, idx) => (
                <Badge key={idx} variant="outline" className="flex items-center gap-1 py-1 pl-1 pr-2">
                  <Avatar name={assignee.name} size="xs" />
                  <span>{assignee.name}</span>
                  {(userRole === 'admin' || userRole === 'manager') && (
                    <button 
                      onClick={() => handleRemoveAssignee(assignee.name)}
                      className="ml-1 rounded-full hover:bg-muted inline-flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                      </svg>
                    </button>
                  )}
                </Badge>
              ))}
            </div>
          ) : (
            <div className="bg-muted/50 rounded-md p-2 flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                <UserPlus className="h-3 w-3 text-primary" />
              </div>
              <span className="text-sm">Me</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Show team member selector for admin/manager roles */}
      {(userRole === 'admin' || userRole === 'manager') && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right">
            Team
          </Label>
          <div className="col-span-3">
            <Select onValueChange={(value) => { 
              // This would typically fetch team members, but for now just add a placeholder
              if (value === 'my-team') {
                handleChange('assignees', [...(newTask.assignees || []), { name: "Team Member" }]);
              }
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="my-team">My Team</SelectItem>
                <SelectItem value="other-team">Other Team</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Show advanced options for admin role */}
      {userRole === 'admin' && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="project" className="text-right">
            Project
          </Label>
          <Select 
            value={newTask.project || ''} 
            onValueChange={(value) => handleChange('project', value)}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Project A">Project A</SelectItem>
              <SelectItem value="Project B">Project B</SelectItem>
              <SelectItem value="Personal Tasks">Personal Tasks</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default TaskFormFields;
