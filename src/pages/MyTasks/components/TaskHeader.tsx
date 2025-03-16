
import React from 'react';
import TaskFilterBar from './TaskFilterBar';
import TaskViewSwitcher from './TaskViewSwitcher';

interface TaskHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setFilterPriority: (priority: string | null) => void;
  setSortBy: (sortBy: 'dueDate' | 'priority' | 'status') => void;
  onAddTask: () => void;
  viewType: string;
  setViewType: (viewType: string) => void;
}

const TaskHeader: React.FC<TaskHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  setFilterPriority,
  setSortBy,
  onAddTask,
  viewType,
  setViewType
}) => {
  return (
    <div className="flex items-center justify-between">
      <TaskFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setFilterPriority={setFilterPriority}
        setSortBy={setSortBy}
        onAddTask={onAddTask}
      />
      <TaskViewSwitcher 
        viewType={viewType}
        setViewType={setViewType}
      />
    </div>
  );
};

export default TaskHeader;
