
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Task } from '@/lib/data';
import { format, isSameDay, parse, startOfMonth } from 'date-fns';
import TaskCard from '@/components/dashboard/TaskCard';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface TasksCalendarViewProps {
  tasks: Task[];
  onDeleteTask: (taskId: string) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: string) => void;
}

const TasksCalendarView: React.FC<TasksCalendarViewProps> = ({
  tasks,
  onDeleteTask,
  onUpdateTaskStatus
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [month, setMonth] = useState<Date>(startOfMonth(new Date()));

  // Filter tasks with due dates
  const tasksWithDueDates = tasks.filter(task => task.dueDate);

  // Get tasks for selected date
  const tasksForSelectedDate = tasksWithDueDates.filter(task => {
    const taskDate = typeof task.dueDate === 'string' 
      ? parse(task.dueDate, 'yyyy-MM-dd', new Date()) 
      : new Date(task.dueDate);
    return isSameDay(taskDate, selectedDate);
  });

  // Function to highlight dates with tasks
  const isDayWithTask = (day: Date) => {
    return tasksWithDueDates.some(task => {
      const taskDate = typeof task.dueDate === 'string' 
        ? parse(task.dueDate, 'yyyy-MM-dd', new Date()) 
        : new Date(task.dueDate);
      return isSameDay(taskDate, day);
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          month={month}
          onMonthChange={setMonth}
          className="rounded-md border"
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
          <h3 className="font-medium mb-4">
            Tasks for {format(selectedDate, 'MMMM d, yyyy')}
            {tasksForSelectedDate.length > 0 && (
              <Badge className="ml-2">{tasksForSelectedDate.length}</Badge>
            )}
          </h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {tasksForSelectedDate.length > 0 ? (
              tasksForSelectedDate.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={() => onUpdateTaskStatus(task.id, task.status === 'completed' ? 'to-do' : 'completed')}
                  onDelete={() => onDeleteTask(task.id)}
                />
              ))
            ) : (
              <p className="text-center text-muted-foreground py-6">No tasks due on this day</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TasksCalendarView;
