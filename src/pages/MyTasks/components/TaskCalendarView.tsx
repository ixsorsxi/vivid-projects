
import React, { useState, useCallback, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Task } from '@/lib/data';
import { format, isSameDay, parse, parseISO, startOfMonth, addMonths, subMonths, isToday } from 'date-fns';
import { Card } from '@/components/ui/card';
import TaskCard from '@/components/dashboard/TaskCard';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TaskQuickEdit from './TaskQuickEdit';
import { cn } from '@/lib/utils';

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
  const [quickEditTask, setQuickEditTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState<Task[]>([]);

  // Function to safely parse dates from different formats
  const parseTaskDate = useCallback((dateStr: string | Date): Date => {
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
  }, []);

  // Get tasks for selected date - memoized to improve performance
  useEffect(() => {
    const filteredTasks = tasks.filter(task => {
      const taskDate = parseTaskDate(task.dueDate);
      return isSameDay(taskDate, selectedDate);
    });
    
    setTasksForSelectedDate(filteredTasks);
  }, [tasks, selectedDate, parseTaskDate]);

  // Function to highlight dates with tasks - memoized for performance
  const isDayWithTask = useCallback((day: Date) => {
    return tasks.some(task => {
      const taskDate = parseTaskDate(task.dueDate);
      return isSameDay(taskDate, day);
    });
  }, [tasks, parseTaskDate]);

  // Handlers for navigation
  const goToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setMonth(startOfMonth(today));
  };

  const goToPrevMonth = () => {
    setMonth(prev => subMonths(prev, 1));
  };

  const goToNextMonth = () => {
    setMonth(prev => addMonths(prev, 1));
  };

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
    
    // Update the selected date if the due date changed
    const newDueDate = new Date(updatedTask.dueDate);
    if (!isSameDay(newDueDate, selectedDate)) {
      setSelectedDate(newDueDate);
      setMonth(startOfMonth(newDueDate));
    }
    
    setQuickEditTask(null);
    setTimeout(() => setIsLoading(false), 300);
  }, [onEditTask, selectedDate]);
  
  // Drag handling for calendar items
  const onDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.add('opacity-50');
    }
  };
  
  // Allow dropping tasks on dates
  const onDateDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.add('bg-primary/20');
    }
  };
  
  const onDateDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.remove('bg-primary/20');
    }
  };
  
  // Handle dropping a task on a date to change its due date
  const onDateDrop = (e: React.DragEvent, date: Date) => {
    e.preventDefault();
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.remove('bg-primary/20');
    }
    
    const taskId = e.dataTransfer.getData('taskId');
    const task = tasks.find(t => t.id === taskId);
    
    if (task) {
      const updatedTask = { 
        ...task, 
        dueDate: date.toISOString() 
      };
      
      setIsLoading(true);
      onEditTask(updatedTask);
      
      // If dropping on selected date, update the task list
      if (isSameDay(date, selectedDate)) {
        setTasksForSelectedDate(prev => [...prev, updatedTask]);
      } else {
        // If dropping on a different date, update selected date
        setSelectedDate(date);
      }
      
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  return (
    <div className={cn(
      "space-y-6", 
      isLoading && "opacity-80 pointer-events-none transition-opacity"
    )}>
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
              today: (date) => isToday(date)
            }}
            modifiersClassNames={{
              hasTask: "bg-primary/20 font-bold",
              today: "ring-2 ring-primary"
            }}
            showOutsideDays
            // Add event handlers to each date cell for drag & drop
            components={{
              Day: ({ date, ...props }) => {
                return (
                  <div
                    {...props}
                    onDragOver={onDateDragOver}
                    onDragLeave={onDateDragLeave}
                    onDrop={(e) => onDateDrop(e, date)}
                    className={cn(
                      "day-cell cursor-pointer hover:bg-primary/10 transition-colors",
                      props.className
                    )}
                  >
                    {format(date, 'd')}
                  </div>
                );
              }
            }}
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
                  <div 
                    key={task.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, task.id)}
                    className="cursor-move transition-all"
                  >
                    <TaskCard
                      task={task}
                      onStatusChange={() => onStatusChange(task.id)}
                      onViewDetails={() => onViewTask(task)}
                      onEdit={() => handleQuickEdit(task)} // Changed to quick edit
                      onDelete={() => onDeleteTask(task.id)}
                    />
                  </div>
                ))
              ) : (
                <div className="text-center py-8 border border-dashed rounded-lg">
                  <p className="text-muted-foreground">No tasks due on this day</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    Add task for this day
                  </Button>
                </div>
              )}
            </div>
          </Card>
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
