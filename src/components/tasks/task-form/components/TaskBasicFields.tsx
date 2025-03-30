
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Task } from '@/lib/data';

interface TaskBasicFieldsProps {
  title: string;
  description: string;
  handleChange: (field: string, value: any) => void;
}

const TaskBasicFields: React.FC<TaskBasicFieldsProps> = ({
  title,
  description,
  handleChange
}) => {
  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="title" className="text-right">
          Title<span className="text-destructive ml-0.5">*</span>
        </Label>
        <Input
          id="title"
          value={title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          className="col-span-3 w-full"
          placeholder="Enter task title"
        />
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
