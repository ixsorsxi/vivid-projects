
import React from 'react';
import TaskFilterBar from './TaskFilterBar';
import TaskViewSwitcher from './TaskViewSwitcher';

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
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div className="flex-1">
        <TaskFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setFilterPriority={setFilterPriority}
          setSortBy={setSortBy}
          sortBy={sortBy}
          onAddTask={onAddTask}
        />
        
        {/* Sort by badge removed as requested */}
      </div>
      
      <TaskViewSwitcher 
        viewType={viewType}
        setViewType={setViewType}
      />
    </div>
  );
};

export default TaskHeader;
