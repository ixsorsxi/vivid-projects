
import React from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from '@/lib/utils';

interface TaskDatePickerProps {
  dueDate: string;
  onDateChange: (date: Date | undefined) => void;
}

const TaskDatePicker: React.FC<TaskDatePickerProps> = ({ dueDate, onDateChange }) => {
  // Convert string date to Date object for the Calendar component
  const dueDateValue = dueDate ? new Date(dueDate) : new Date();
  
  return (
    <div>
      <Label htmlFor="dueDate">Due Date <span className="text-destructive">*</span></Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !dueDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dueDate ? format(dueDateValue, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dueDateValue}
            onSelect={onDateChange}
            initialFocus
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TaskDatePicker;
