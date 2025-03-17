
import React from 'react';
import TaskHeader from './TaskHeader';
import TaskDashboard from './TaskDashboard';

interface TaskMainContentProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterPriority: string | null;
  setFilterPriority: (priority: string | null) => void;
  sortBy: 'dueDate' | 'priority' | 'status';
  setSortBy: (sortBy: 'dueDate' | 'priority' | 'status') => void;
  onAddTask: () => void;
  viewType: string;
  setViewType: (viewType: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isViewTransitioning: boolean;
  isLoadingView: boolean;
  isLoading: boolean;
  filteredTasks: any[];
  handleToggleStatus: (taskId: string) => void;
  handleViewTask: (task: any) => void;
  handleEditTask: (task: any) => void;
  handleUpdateTask: (task: any) => void;
  handleDeleteTask: (taskId: string) => void;
  formatDueDate: (date: string) => string;
}

const TaskMainContent: React.FC<TaskMainContentProps> = ({
  searchQuery,
  setSearchQuery,
  filterPriority,
  setFilterPriority,
  sortBy,
  setSortBy,
  onAddTask,
  viewType,
  setViewType,
  activeTab,
  setActiveTab,
  isViewTransitioning,
  isLoadingView,
  isLoading,
  filteredTasks,
  handleToggleStatus,
  handleViewTask,
  handleEditTask,
  handleUpdateTask,
  handleDeleteTask,
  formatDueDate
}) => {
  return (
    <>
      <TaskHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setFilterPriority={setFilterPriority}
        setSortBy={setSortBy}
        onAddTask={onAddTask}
        viewType={viewType}
        setViewType={setViewType}
        sortBy={sortBy}
      />
      
      <div className="flex-grow bg-card/30 backdrop-blur-sm p-6 rounded-xl border border-border/50 shadow-sm">
        <TaskDashboard
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isViewTransitioning={isViewTransitioning}
          isLoadingView={isLoadingView}
          isLoading={isLoading}
          filteredTasks={filteredTasks}
          filterPriority={filterPriority}
          setFilterPriority={setFilterPriority}
          handleToggleStatus={handleToggleStatus}
          handleViewTask={handleViewTask}
          handleEditTask={handleEditTask}
          handleUpdateTask={handleUpdateTask}
          handleDeleteTask={handleDeleteTask}
          sortBy={sortBy}
          formatDueDate={formatDueDate}
          viewType={viewType}
          onAddTaskClick={onAddTask}
        />
      </div>
    </>
  );
};

export default TaskMainContent;
