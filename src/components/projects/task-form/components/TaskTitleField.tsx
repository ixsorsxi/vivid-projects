
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormItem, FormMessage } from "@/components/ui/form";

interface TaskTitleFieldProps {
  title: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const TaskTitleField: React.FC<TaskTitleFieldProps> = ({ title, onChange, error }) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="title" className="text-right font-medium">
        Title <span className="text-destructive">*</span>
      </Label>
      <div className="col-span-3 space-y-1">
        <Input
          id="title"
          value={title}
          onChange={onChange}
          placeholder="Enter task title"
          className={error ? "border-destructive" : ""}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? "title-error" : undefined}
        />
        {error && (
          <p id="title-error" className="text-xs text-destructive mt-1">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default TaskTitleField;
