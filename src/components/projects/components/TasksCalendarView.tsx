
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { formatDateToYYYYMMDD, formatDateToMonthDayYear } from '@/utils/formatters';
import { Task } from '@/lib/types/task';

interface TasksCalendarViewProps {
  tasks: Task[];
  projectId?: string;
  onViewTask?: (task: Task) => void;
  onEditTask?: (task: Task) => void;
}

const TasksCalendarView: React.FC<TasksCalendarViewProps> = ({
  tasks,
  projectId,
  onViewTask,
  onEditTask
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  // Get formatted date
  const getFormattedDate = (date: Date): string => {
    return formatDateToYYYYMMDD(date);
  };
  
  // Filter tasks for the selected date
  const tasksForDate = selectedDate
    ? tasks.filter(task => {
        if (!task.due_date) return false;
        
        // Handle different date formats
        const taskDate = task.dueDate || task.due_date;
        return taskDate.startsWith(getFormattedDate(selectedDate));
      })
    : [];
  
  // Filter tasks for the current month view
  const tasksInCurrentMonth = tasks.filter(task => {
    if (!task.due_date) return false;
    
    // Handle different date formats
    const taskDate = task.dueDate || task.due_date;
    const taskDateTime = new Date(taskDate);
    
    return (
      taskDateTime.getMonth() === currentMonth.getMonth() &&
      taskDateTime.getFullYear() === currentMonth.getFullYear()
    );
  });
  
  // Get tasks due on a specific day
  const getTasksForDay = (date: Date): Task[] => {
    const formattedDate = formatDateToYYYYMMDD(date);
    
    return tasksInCurrentMonth.filter(task => {
      const taskDate = task.dueDate || task.due_date;
      if (!taskDate) return false;
      
      return taskDate.startsWith(formattedDate);
    });
  };
  
  // Custom renderer for calendar days
  const renderDay = (day: Date) => {
    const tasksForDay = getTasksForDay(day);
    const hasHighPriorityTask = tasksForDay.some(task => task.priority === 'high' || task.priority === 'urgent');
    const hasMediumPriorityTask = tasksForDay.some(task => task.priority === 'medium');
    
    let dotClassName = "absolute bottom-1 left-1/2 transform -translate-x-1/2 h-1.5 w-1.5 rounded-full";
    
    if (hasHighPriorityTask) {
      dotClassName += " bg-red-500";
    } else if (hasMediumPriorityTask) {
      dotClassName += " bg-amber-500";
    } else if (tasksForDay.length > 0) {
      dotClassName += " bg-green-500";
    } else {
      return null; // No dot for days without tasks
    }
    
    return <div className={dotClassName}></div>;
  };
  
  // Type for DayContentProps 
  interface CustomDayContentProps {
    date: Date;
    day: Date; // May need to adjust this based on your component
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calendar Component */}
        <Card className="col-span-1 p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            onMonthChange={setCurrentMonth}
            className="w-full"
            components={{
              DayContent: (props: any) => (
                <div className="relative flex items-center justify-center p-2">
                  {props.date?.getDate()}
                  {props.date && renderDay(props.date)}
                </div>
              )
            }}
          />
        </Card>
        
        {/* Tasks for selected date */}
        <Card className="col-span-1 md:col-span-2 p-4">
          <h3 className="text-lg font-medium mb-4">
            {selectedDate ? formatDateToMonthDayYear(selectedDate) : 'Select a date'}
          </h3>
          
          <div className="space-y-3">
            {tasksForDate.length > 0 ? (
              tasksForDate.map(task => (
                <div
                  key={task.id}
                  className="p-3 border rounded-md cursor-pointer hover:bg-muted/50"
                  onClick={() => onViewTask?.(task)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {task.description || 'No description'}
                      </p>
                    </div>
                    <div className={`px-2 py-1 text-xs rounded-full ${
                      task.priority === 'high' ? 'bg-red-100 text-red-800' :
                      task.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {selectedDate ? 'No tasks due on this date' : 'Select a date to view tasks'}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TasksCalendarView;
