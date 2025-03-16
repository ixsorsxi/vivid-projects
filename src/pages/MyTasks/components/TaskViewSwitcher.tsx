
import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid, CalendarDays, List } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskViewSwitcherProps {
  viewType: string;
  setViewType: (viewType: string) => void;
}

const TaskViewSwitcher: React.FC<TaskViewSwitcherProps> = ({ 
  viewType, 
  setViewType 
}) => {
  return (
    <div className="flex gap-2">
      <Button 
        variant={viewType === 'list' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setViewType('list')}
        className={cn(
          viewType === 'list' && 'bg-primary text-primary-foreground',
          'transition-all'
        )}
      >
        <List className="h-4 w-4 mr-2" />
        List
      </Button>
      <Button 
        variant={viewType === 'kanban' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setViewType('kanban')}
        className={cn(
          viewType === 'kanban' && 'bg-primary text-primary-foreground',
          'transition-all'
        )}
      >
        <LayoutGrid className="h-4 w-4 mr-2" />
        Board
      </Button>
      <Button 
        variant={viewType === 'calendar' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setViewType('calendar')}
        className={cn(
          viewType === 'calendar' && 'bg-primary text-primary-foreground',
          'transition-all'
        )}
      >
        <CalendarDays className="h-4 w-4 mr-2" />
        Calendar
      </Button>
    </div>
  );
};

export default TaskViewSwitcher;
