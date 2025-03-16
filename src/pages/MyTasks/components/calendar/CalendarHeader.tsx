
import React from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CalendarHeaderProps {
  month: Date;
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
  goToToday: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  month,
  goToPrevMonth,
  goToNextMonth,
  goToToday,
}) => {
  return (
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
  );
};

export default CalendarHeader;
