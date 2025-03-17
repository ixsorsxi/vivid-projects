
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Plus, X } from 'lucide-react';
import { TeamMember } from '@/components/projects/team/types';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from '@/lib/utils';

interface TaskFormFieldsProps {
  newTask: {
    title: string;
    description: string;
    priority: string;
    dueDate: string;
    status: string;
    assignees: Array<{ name: string }>;
  };
  setNewTask: React.Dispatch<React.SetStateAction<{
    title: string;
    description: string;
    priority: string;
    dueDate: string;
    status: string;
    assignees: Array<{ name: string }>;
  }>>;
  teamMembers: TeamMember[];
  selectedMember: string;
  setSelectedMember: React.Dispatch<React.SetStateAction<string>>;
  handleAddAssignee: () => void;
  handleRemoveAssignee: (name: string) => void;
}

const TaskFormFields: React.FC<TaskFormFieldsProps> = ({
  newTask,
  setNewTask,
  teamMembers,
  selectedMember,
  setSelectedMember,
  handleAddAssignee,
  handleRemoveAssignee
}) => {
  // Convert string date to Date object for the Calendar component
  const dueDateValue = newTask.dueDate ? new Date(newTask.dueDate) : new Date();
  
  const onDateChange = (date: Date | undefined) => {
    if (date) {
      const formattedDate = date.toISOString().split('T')[0];
      setNewTask({ ...newTask, dueDate: formattedDate });
    }
  };

  return (
    <div className="space-y-4 py-4">
      <div>
        <Label htmlFor="title">Task Title <span className="text-destructive">*</span></Label>
        <Input
          id="title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          placeholder="Enter task title"
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          placeholder="Enter task description"
          rows={3}
        />
      </div>
      
      <div>
        <Label htmlFor="status">Status</Label>
        <Select
          value={newTask.status}
          onValueChange={(value) => setNewTask({ ...newTask, status: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="to-do">Not Started</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="priority">Priority</Label>
        <Select
          value={newTask.priority}
          onValueChange={(value) => setNewTask({ ...newTask, priority: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="dueDate">Due Date <span className="text-destructive">*</span></Label>
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
      
      <AssigneeSelector
        assignees={newTask.assignees}
        teamMembers={teamMembers}
        selectedMember={selectedMember}
        setSelectedMember={setSelectedMember}
        handleAddAssignee={handleAddAssignee}
        handleRemoveAssignee={handleRemoveAssignee}
      />
    </div>
  );
};

export default TaskFormFields;

interface AssigneeSelectorProps {
  assignees: Array<{ name: string }>;
  teamMembers: TeamMember[];
  selectedMember: string;
  setSelectedMember: React.Dispatch<React.SetStateAction<string>>;
  handleAddAssignee: () => void;
  handleRemoveAssignee: (name: string) => void;
}

const AssigneeSelector: React.FC<AssigneeSelectorProps> = ({
  assignees,
  teamMembers,
  selectedMember,
  setSelectedMember,
  handleAddAssignee,
  handleRemoveAssignee
}) => {
  return (
    <div>
      <Label>Assignees</Label>
      <div className="flex gap-2 mt-1 mb-2">
        {assignees.map((assignee, index) => (
          <Badge key={index} className="flex items-center gap-1">
            {assignee.name}
            <button 
              onClick={() => handleRemoveAssignee(assignee.name)}
              className="h-4 w-4 rounded-full hover:bg-primary/20 inline-flex items-center justify-center"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Select value={selectedMember} onValueChange={setSelectedMember}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select team member" />
          </SelectTrigger>
          <SelectContent>
            {teamMembers.map(member => (
              <SelectItem key={member.id} value={member.name}>
                {member.name} - {member.role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="button" size="sm" onClick={handleAddAssignee}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
