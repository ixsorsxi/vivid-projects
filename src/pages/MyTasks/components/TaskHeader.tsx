
import React from 'react';
import TaskFilterBar from './TaskFilterBar';
import TaskViewSwitcher from './TaskViewSwitcher';
import { Badge } from '@/components/ui/badge';
import { useTaskState } from '../hooks/task-state/useTaskState';

interface TaskHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setFilterPriority: (priority: string | null) => void;
  setSortBy: (sortBy: 'dueDate' | 'priority' | 'status') => void;
  sortBy: 'dueDate' | 'priority' | 'status';
  onAddTask: () => void;
  viewType: string;
  setViewType: (viewType: string) => void;
}

const TaskHeader: React.FC<TaskHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  setFilterPriority,
  setSortBy,
  sortBy,
  onAddTask,
  viewType,
  setViewType
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex-1">
        <TaskFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setFilterPriority={setFilterPriority}
          setSortBy={setSortBy}
          sortBy={sortBy}
          onAddTask={onAddTask}
        />
        
        {sortBy && (
          <div className="mt-2 flex gap-2">
            <Badge variant="outline" className="bg-background">
              Sorted by: {sortBy === 'dueDate' ? 'Due Date' : sortBy === 'priority' ? 'Priority' : 'Status'}
            </Badge>
          </div>
        )}
      </div>
      
      <TaskViewSwitcher 
        viewType={viewType}
        setViewType={setViewType}
      />
    </div>
  );
};

export default TaskHeader;
