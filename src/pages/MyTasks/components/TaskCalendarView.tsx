
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Task } from '@/lib/data';
import { format, isSameDay, parse, parseISO, startOfMonth } from 'date-fns';
import { Card } from '@/components/ui/card';
import TaskCard from '@/components/dashboard/TaskCard';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TaskCalendarViewProps {
  tasks: Task[];
  onStatusChange: (taskId: string) => void;
  onViewTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskCalendarView: React.FC<TaskCalendarViewProps> = ({
  tasks,
  onStatusChange,
  onViewTask,
  onEditTask,
  onDeleteTask
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [month, setMonth] = useState<Date>(startOfMonth(new Date()));

  // Function to safely parse dates from different formats
  const parseTaskDate = (dateStr: string | Date): Date => {
    if (!dateStr) return new Date();
    
    if (typeof dateStr === 'string') {
      // Try parsing as ISO format first
      try {
        return parseISO(dateStr);
      } catch {
        // Fall back to yyyy-MM-dd format
        try {
          return parse(dateStr, 'yyyy-MM-dd', new Date());
        } catch {
          return new Date();
        }
      }
    }
    
    return new Date(dateStr);
  };

  // Filter tasks with due dates
  const tasksWithDueDates = tasks.filter(task => task.dueDate);

  // Get tasks for selected date
  const tasksForSelectedDate = tasksWithDueDates.filter(task => {
    const taskDate = parseTaskDate(task.dueDate);
    return isSameDay(taskDate, selectedDate);
  });

  // Function to highlight dates with tasks
  const isDayWithTask = (day: Date) => {
    return tasksWithDueDates.some(task => {
      const taskDate = parseTaskDate(task.dueDate);
      return isSameDay(taskDate, day);
    });
  };

  // Handlers for navigation
  const goToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setMonth(startOfMonth(today));
  };

  const goToPrevMonth = () => {
    const prevMonth = new Date(month);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setMonth(prevMonth);
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(month);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setMonth(nextMonth);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={goToPrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <h2 className="text-xl font-semibold">
            {format(month, 'MMMM yyyy')}
          </h2>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            month={month}
            onMonthChange={setMonth}
            className="rounded-md border pointer-events-auto"
            modifiers={{
              hasTask: (date) => isDayWithTask(date),
            }}
            modifiersClassNames={{
              hasTask: "bg-primary/20 font-bold",
            }}
            showOutsideDays
          />
        </div>
        <div>
          <Card className="p-4">
            <h3 className="font-medium mb-4 flex items-center">
              Tasks for {format(selectedDate, 'MMMM d, yyyy')}
              {tasksForSelectedDate.length > 0 && (
                <Badge className="ml-2">{tasksForSelectedDate.length}</Badge>
              )}
            </h3>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {tasksForSelectedDate.length > 0 ? (
                tasksForSelectedDate.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={() => onStatusChange(task.id)}
                    onViewDetails={() => onViewTask(task)}
                    onEdit={() => onEditTask(task)}
                    onDelete={() => onDeleteTask(task.id)}
                  />
                ))
              ) : (
                <div className="text-center py-8 border border-dashed rounded-lg">
                  <p className="text-muted-foreground">No tasks due on this day</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TaskCalendarView;
