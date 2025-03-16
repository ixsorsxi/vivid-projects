
import React, { useState, useCallback } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Task } from '@/lib/data';
import { isToday } from 'date-fns';
import { cn } from '@/lib/utils';
import TaskQuickEdit from './TaskQuickEdit';
import CalendarHeader from './calendar/CalendarHeader';
import TasksForDateCard from './calendar/TasksForDateCard';
import CalendarDayCell from './calendar/CalendarDayCell';
import useCalendarView from '../hooks/useCalendarView';
import useCalendarDragDrop from '../hooks/useCalendarDragDrop';

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
  const [quickEditTask, setQuickEditTask] = useState<Task | null>(null);
  
  const {
    selectedDate,
    setSelectedDate,
    month,
    setMonth,
    isLoading,
    setIsLoading,
    tasksForSelectedDate,
    setTasksForSelectedDate,
    isDayWithTask,
    goToToday,
    goToPrevMonth,
    goToNextMonth
  } = useCalendarView(tasks);

  const {
    onDragStart,
    onDateDragOver,
    onDateDragLeave,
    onDateDrop
  } = useCalendarDragDrop({
    tasks,
    selectedDate,
    setSelectedDate,
    setTasksForSelectedDate,
    setIsLoading,
    onEditTask
  });

  // Handle opening the quick edit modal
  const handleQuickEdit = useCallback((task: Task) => {
    setQuickEditTask(task);
  }, []);

  // Handle closing the quick edit modal
  const handleCloseQuickEdit = useCallback(() => {
    setQuickEditTask(null);
  }, []);

  // Handle saving quick edits
  const handleSaveQuickEdit = useCallback((updatedTask: Task) => {
    setIsLoading(true);
    onEditTask(updatedTask);
    setQuickEditTask(null);
    setTimeout(() => setIsLoading(false), 300);
  }, [onEditTask, setIsLoading]);

  return (
    <div className={cn(
      "space-y-6", 
      isLoading && "opacity-80 pointer-events-none transition-opacity"
    )}>
      <CalendarHeader 
        month={month}
        goToPrevMonth={goToPrevMonth}
        goToNextMonth={goToNextMonth}
        goToToday={goToToday}
      />

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
              today: (date) => isToday(date)
            }}
            modifiersClassNames={{
              hasTask: "bg-primary/20 font-bold",
              today: "ring-2 ring-primary"
            }}
            showOutsideDays
            components={{
              Day: ({ date, ...props }) => {
                return (
                  <CalendarDayCell
                    date={date}
                    onDragOver={onDateDragOver}
                    onDragLeave={onDateDragLeave}
                    onDrop={onDateDrop}
                    className={props.className}
                  />
                );
              }
            }}
          />
        </div>
        <div>
          <TasksForDateCard
            selectedDate={selectedDate}
            tasks={tasksForSelectedDate}
            onDragStart={onDragStart}
            onStatusChange={onStatusChange}
            onViewTask={onViewTask}
            onEditTask={handleQuickEdit}
            onDeleteTask={onDeleteTask}
          />
        </div>
      </div>
      
      {/* Quick Edit Modal */}
      {quickEditTask && (
        <TaskQuickEdit
          task={quickEditTask}
          onClose={handleCloseQuickEdit}
          onSave={handleSaveQuickEdit}
        />
      )}
    </div>
  );
};

export default TaskCalendarView;
