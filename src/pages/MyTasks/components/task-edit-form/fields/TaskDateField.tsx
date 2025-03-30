
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskDateFieldProps {
  dueDate?: string;
  onDateChange: (value: string) => void;
}

const TaskDateField: React.FC<TaskDateFieldProps> = ({ 
  dueDate, 
  onDateChange 
}) => {
  const formatDateForInput = (dateString?: string) => {
    try {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (e) {
      console.error("Date formatting error:", e);
      return new Date().toISOString().split('T')[0];
    }
  };

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="dueDate" className="text-right">
        Due Date
      </Label>
      <div className="col-span-3 relative">
        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id="dueDate"
          type="date"
          value={formatDateForInput(dueDate)}
          onChange={(e) => onDateChange(new Date(e.target.value).toISOString())}
          className={cn("pl-9 w-full")}
        />
      </div>
    </div>
  );
};

export default TaskDateField;
