
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TaskTitleFieldProps {
  title: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TaskTitleField: React.FC<TaskTitleFieldProps> = ({ title, onChange }) => {
  return (
    <div className="w-full">
      <Label htmlFor="title" className="mb-1.5 block">
        Task Title <span className="text-destructive">*</span>
      </Label>
      <Input
        id="title"
        value={title}
        onChange={onChange}
        placeholder="Enter task title"
        className="w-full"
      />
    </div>
  );
};

export default TaskTitleField;
