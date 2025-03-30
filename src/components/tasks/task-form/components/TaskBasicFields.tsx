
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Task } from '@/lib/data';

interface TaskBasicFieldsProps {
  title: string;
  description: string;
  handleChange: (field: string, value: any) => void;
  errors?: {
    title?: string;
  };
}

const TaskBasicFields: React.FC<TaskBasicFieldsProps> = ({
  title,
  description,
  handleChange,
  errors
}) => {
  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="title" className="text-right font-medium">
          Title<span className="text-destructive ml-0.5">*</span>
        </Label>
        <div className="col-span-3 space-y-1">
          <Input
            id="title"
            value={title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            className={errors?.title ? "border-destructive" : ""}
            placeholder="Enter task title"
          />
          {errors?.title && <p className="text-xs text-destructive">{errors.title}</p>}
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">
          Description
        </Label>
        <Textarea
          id="description"
          value={description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          className="col-span-3"
          placeholder="Add details about the task"
          rows={3}
        />
      </div>
    </>
  );
};

export default TaskBasicFields;
