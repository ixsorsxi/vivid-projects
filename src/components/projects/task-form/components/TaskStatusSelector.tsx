
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TaskStatusSelectorProps {
  status: string;
  onValueChange: (value: string) => void;
}

const TaskStatusSelector: React.FC<TaskStatusSelectorProps> = ({ status, onValueChange }) => {
  return (
    <div>
      <Label htmlFor="status">Status</Label>
      <Select
        value={status}
        onValueChange={onValueChange}
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
  );
};

export default TaskStatusSelector;
