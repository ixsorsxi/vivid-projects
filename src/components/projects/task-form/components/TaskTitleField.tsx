
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TaskTitleFieldProps {
  title: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TaskTitleField: React.FC<TaskTitleFieldProps> = ({ title, onChange }) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="title" className="text-right font-medium">
        Title <span className="text-destructive">*</span>
      </Label>
      <Input
        id="title"
        value={title}
        onChange={onChange}
        placeholder="Enter task title"
        className="col-span-3"
      />
    </div>
  );
};

export default TaskTitleField;
