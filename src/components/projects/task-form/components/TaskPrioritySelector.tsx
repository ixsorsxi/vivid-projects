
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TaskPrioritySelectorProps {
  priority: string;
  onValueChange: (value: string) => void;
}

const TaskPrioritySelector: React.FC<TaskPrioritySelectorProps> = ({ priority, onValueChange }) => {
  return (
    <div>
      <Label htmlFor="priority">Priority</Label>
      <Select
        value={priority}
        onValueChange={onValueChange}
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
  );
};

export default TaskPrioritySelector;
