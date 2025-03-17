
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TaskDescriptionFieldProps {
  description: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TaskDescriptionField: React.FC<TaskDescriptionFieldProps> = ({ description, onChange }) => {
  return (
    <div>
      <Label htmlFor="description">Description</Label>
      <Textarea
        id="description"
        value={description}
        onChange={onChange}
        placeholder="Enter task description"
        rows={3}
      />
    </div>
  );
};

export default TaskDescriptionField;
