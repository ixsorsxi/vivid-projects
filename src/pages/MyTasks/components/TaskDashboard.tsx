
import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import TaskFilterTabs from './TaskFilterTabs';
import TaskContent from './TaskContent';
import TaskLoadingState from './TaskLoadingState';

interface TaskDashboardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isViewTransitioning: boolean;
  isLoadingView: boolean;
  isLoading: boolean;
  filteredTasks: any[];
  filterPriority: string | null;
  setFilterPriority: (priority: string | null) => void;
  handleToggleStatus: (taskId: string) => void;
  handleViewTask: (task: any) => void;
  handleEditTask: (task: any) => void;
  handleUpdateTask: (task: any) => void;
  handleDeleteTask: (taskId: string) => void;
  sortBy: 'dueDate' | 'priority' | 'status';
  formatDueDate: (date: string) => string;
  viewType: string;
  onAddTaskClick: () => void;
}

const TaskDashboard: React.FC<TaskDashboardProps> = ({
  activeTab,
  setActiveTab,
  isViewTransitioning,
  isLoadingView,
  isLoading,
  filteredTasks,
  filterPriority,
  setFilterPriority,
  handleToggleStatus,
  handleViewTask,
  handleEditTask,
  handleUpdateTask,
  handleDeleteTask,
  sortBy,
  formatDueDate,
  viewType,
  onAddTaskClick
}) => {
  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mt-4">
      <TaskFilterTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <TabsContent value={activeTab} className={cn(
        "mt-6 relative",
        (isViewTransitioning || isLoadingView || isLoading) && "opacity-70 pointer-events-none transition-opacity"
      )}>
        {isLoading ? (
          <TaskLoadingState />
        ) : (
          <TaskContent
            viewType={viewType}
            isViewTransitioning={isViewTransitioning}
            isLoadingView={isLoadingView}
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
            onAddTaskClick={onAddTaskClick}
          />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default TaskDashboard;
