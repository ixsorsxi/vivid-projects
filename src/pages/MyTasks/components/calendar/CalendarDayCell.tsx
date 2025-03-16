
import React from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface CalendarDayCellProps {
  date: Date;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, date: Date) => void;
  className?: string;
}

const CalendarDayCell: React.FC<CalendarDayCellProps> = ({
  date,
  onDragOver,
  onDragLeave,
  onDrop,
  className,
}) => {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, date)}
      className={cn(
        "day-cell cursor-pointer hover:bg-primary/10 transition-colors",
        className
      )}
    >
      {format(date, 'd')}
    </div>
  );
};

export default CalendarDayCell;
