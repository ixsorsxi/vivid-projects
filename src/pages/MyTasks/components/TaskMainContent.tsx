
import React from 'react';
import TaskHeader from './TaskHeader';
import TaskDashboard from './TaskDashboard';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

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
    <motion.div 
      className="flex flex-col gap-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
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
      
      <Card className="flex-grow backdrop-blur-sm p-5 md:p-6 rounded-xl border shadow-sm bg-gradient-to-br from-card/95 to-card/90">
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
      </Card>
    </motion.div>
  );
};

export default TaskMainContent;
