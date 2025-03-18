
import React from 'react';
import { format, isAfter, isBefore, isToday, parseISO } from 'date-fns';
import { CalendarClock } from 'lucide-react';

interface ProjectDueDateProps {
  dueDate: string;
}

const ProjectDueDate: React.FC<ProjectDueDateProps> = ({ dueDate }) => {
  if (!dueDate) return null;

  const dueDateObj = parseISO(dueDate);
  const today = new Date();
  const isOverdue = isBefore(dueDateObj, today) && !isToday(dueDateObj);
  const isUpcoming = isAfter(dueDateObj, today) && !isToday(dueDateObj);
  const isDueToday = isToday(dueDateObj);
  
  let textColorClass = "text-muted-foreground";
  if (isOverdue) textColorClass = "text-red-500";
  if (isDueToday) textColorClass = "text-amber-500";
  
  return (
    <div className={`flex items-center text-xs ${textColorClass}`}>
      <CalendarClock className="h-3.5 w-3.5 mr-1.5" />
      <span>{format(dueDateObj, 'MMM d, yyyy')}</span>
    </div>
  );
};

export default ProjectDueDate;
