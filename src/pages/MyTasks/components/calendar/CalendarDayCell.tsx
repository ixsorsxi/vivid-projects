
import React from 'react';
import { cn } from '@/lib/utils';

interface CalendarDayCellProps {
  date: Date;
  onDragOver?: (e: React.DragEvent, date: Date) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, date: Date) => void;
  className?: string;
}

const CalendarDayCell: React.FC<CalendarDayCellProps> = ({
  date,
  onDragOver,
  onDragLeave,
  onDrop,
  className
}) => {
  const handleDragOver = (e: React.DragEvent) => {
    if (onDragOver) {
      e.preventDefault();
      onDragOver(e, date);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    if (onDrop) {
      e.preventDefault();
      onDrop(e, date);
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center h-9 w-9 rounded-md transition-colors",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={onDragLeave}
      onDrop={handleDrop}
    >
      {date.getDate()}
    </div>
  );
};

export default CalendarDayCell;
