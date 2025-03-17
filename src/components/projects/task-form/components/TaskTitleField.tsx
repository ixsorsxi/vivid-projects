
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TaskTitleFieldProps {
  title: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TaskTitleField: React.FC<TaskTitleFieldProps> = ({ title, onChange }) => {
  return (
    <div>
      <Label htmlFor="title">Task Title <span className="text-destructive">*</span></Label>
      <Input
        id="title"
        value={title}
        onChange={onChange}
        placeholder="Enter task title"
      />
    </div>
  );
};

export default TaskTitleField;
