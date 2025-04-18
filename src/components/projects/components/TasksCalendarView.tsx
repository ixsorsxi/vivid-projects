
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Task, TaskStatus } from '@/lib/types/task';
import { formatDate } from '@/utils/formatters';
import { 
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover';

interface TasksCalendarViewProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const TasksCalendarView: React.FC<TasksCalendarViewProps> = ({ tasks, onTaskClick }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Create an object to store tasks by date
  const tasksByDate: Record<string, Task[]> = {};
  
  // Create a Map to count tasks per day
  const taskCountByDay: Map<string, number> = new Map();
  
  // Group tasks by date
  tasks.forEach(task => {
    const dueDate = task.due_date || task.dueDate;
    if (!dueDate) return;
    
    const dateStr = dueDate.split('T')[0]; // Format: YYYY-MM-DD
    
    if (!tasksByDate[dateStr]) {
      tasksByDate[dateStr] = [];
    }
    
    tasksByDate[dateStr].push(task);
    
    // Count tasks for the dot indicators
    taskCountByDay.set(dateStr, (taskCountByDay.get(dateStr) || 0) + 1);
  });
  
  // Custom day rendering function for the calendar
  const renderDay = (day: Date) => {
    const dateStr = formatDate(day, 'yyyy-MM-dd');
    const count = taskCountByDay.get(dateStr) || 0;
    
    return (
      <div className="relative">
        <div>{day.getDate()}</div>
        {count > 0 && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-0.5">
            {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
              <div 
                key={i} 
                className="w-1 h-1 rounded-full bg-primary"
              />
            ))}
            {count > 3 && (
              <div className="w-1 h-1 rounded-full bg-primary opacity-50" />
            )}
          </div>
        )}
      </div>
    );
  };
  
  // Get tasks for the selected date
  const selectedDateStr = date ? formatDate(date, 'yyyy-MM-dd') : '';
  const selectedDateTasks = tasksByDate[selectedDateStr] || [];
  
  return (
    <div className="flex flex-col h-full">
      <div className="calendar-container p-1">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          components={{
            Day: ({ date: day }) => renderDay(day)
          }}
        />
      </div>
      
      <div className="mt-4 flex-1 overflow-auto">
        <h3 className="font-medium text-sm mb-2">
          {date ? formatDate(date, 'MMMM d, yyyy') : 'Select a date'}
        </h3>
        
        {selectedDateTasks.length > 0 ? (
          <div className="space-y-2">
            {selectedDateTasks.map(task => {
              // Create a decorated task with required properties for TaskCard
              const decoratedTask = {
                ...task,
                status: task.status as TaskStatus,
                assignees: task.assignees || [],
                dueDate: task.due_date || task.dueDate
              };
              
              return (
                <div 
                  key={task.id}
                  className={`p-3 border rounded-md cursor-pointer transition-colors hover:bg-accent/50 ${task.status === 'done' ? 'bg-muted/50' : ''}`}
                  onClick={() => onTaskClick(task)}
                >
                  <div className="flex items-center justify-between">
                    <span className={`${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {task.title}
                    </span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="h-5 w-5 rounded-full" style={{
                          backgroundColor: task.priority === 'high' ? '#f87171' :
                                          task.priority === 'medium' ? '#60a5fa' : '#a1a1aa'
                        }}></button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-2" side="top">
                        <p className="text-xs">{task.priority} priority</p>
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  {task.assignees && task.assignees.length > 0 && (
                    <div className="mt-1 flex items-center text-xs text-muted-foreground">
                      <span>Assigned to: </span>
                      <span className="ml-1">
                        {task.assignees.map(a => a.name).join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground text-sm">
            No tasks due on this date
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksCalendarView;
