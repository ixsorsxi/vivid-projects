
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useTaskManagement } from '../hooks/useTaskManagement';
import useViewPreference from '@/hooks/useViewPreference';
import useAdvancedTaskFeatures from '../hooks/useAdvancedTaskFeatures';
import TaskFilterTabs from './TaskFilterTabs';
import TaskContent from './TaskContent';
import TaskHeader from './TaskHeader';
import TaskDialogs from './TaskDialogs';
import { useAuth } from '@/context/auth';

const TaskPageContent = () => {
  const [isLoadingView, setIsLoadingView] = useState(false);
  const { isAuthenticated } = useAuth();
  
  const {
    tasks,
    setTasks,
    isLoading,
    searchQuery,
    setSearchQuery,
    filterPriority,
    setFilterPriority,
    sortBy,
    setSortBy,
    isAddTaskOpen,
    setIsAddTaskOpen,
    isViewTaskOpen,
    setIsViewTaskOpen,
    isEditTaskOpen,
    setIsEditTaskOpen,
    activeTab,
    setActiveTab,
    selectedTask,
    filteredTasks,
    handleToggleStatus,
    handleAddTask,
    handleViewTask,
    handleEditTask,
    handleDeleteTask,
    handleUpdateTask,
    formatDueDate,
    refetchTasks
  } = useTaskManagement([]);

  // Use our new advanced task features hook
  const {
    handleAddDependency,
    handleRemoveDependency,
    handleAddSubtask,
    handleToggleSubtask,
    handleDeleteSubtask,
    handleAddAssignee,
    handleRemoveAssignee,
    handleUpdateTaskStatus,
    availableUsers
  } = useAdvancedTaskFeatures(tasks, setTasks);

  // Use enhanced view preference hook with transition state
  const { viewType, setViewType, isViewTransitioning } = useViewPreference({
    defaultView: 'list',
    storageKey: 'myTasks.viewPreference',
    onViewChange: () => {
      setIsLoadingView(true);
      // Simulate loading state for view transitions
      setTimeout(() => setIsLoadingView(false), 300);
    }
  });
  
  // Wrapper for dependency add operations
  const handleTaskDependencyAdd = (taskId: string, dependencyType: string) => {
    if (selectedTask) {
      handleAddDependency(selectedTask.id, taskId, dependencyType as any);
    }
  };

  // Wrapper for dependency remove operations
  const handleTaskDependencyRemove = (dependencyTaskId: string) => {
    if (selectedTask) {
      handleRemoveDependency(selectedTask.id, dependencyTaskId);
    }
  };

  // Wrapper for subtask add operations
  const handleTaskSubtaskAdd = (parentId: string, title: string) => {
    handleAddSubtask(parentId, title);
  };

  // Wrapper for assignee operations
  const handleTaskAssigneeAdd = (taskId: string, assignee: any) => {
    handleAddAssignee(taskId, assignee);
  };

  const handleTaskAssigneeRemove = (taskId: string, assigneeName: string) => {
    handleRemoveAssignee(taskId, assigneeName);
  };

  // Refresh tasks when user auth state changes
  useEffect(() => {
    if (isAuthenticated && refetchTasks) {
      refetchTasks();
    }
  }, [isAuthenticated, refetchTasks]);

  return (
    <>
      <TaskHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setFilterPriority={setFilterPriority}
        setSortBy={setSortBy}
        onAddTask={() => setIsAddTaskOpen(true)}
        viewType={viewType}
        setViewType={setViewType}
      />
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TaskFilterTabs activeTab={activeTab} />
        
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
              onAddTaskClick={() => setIsAddTaskOpen(true)}
            />
          )}
        </TabsContent>
      </Tabs>

      <TaskDialogs
        isAddTaskOpen={isAddTaskOpen}
        setIsAddTaskOpen={setIsAddTaskOpen}
        isViewTaskOpen={isViewTaskOpen}
        setIsViewTaskOpen={setIsViewTaskOpen}
        isEditTaskOpen={isEditTaskOpen}
        setIsEditTaskOpen={setIsEditTaskOpen}
        selectedTask={selectedTask}
        tasks={tasks}
        handleAddTask={handleAddTask}
        handleUpdateTask={handleUpdateTask}
        handleTaskDependencyAdd={handleTaskDependencyAdd}
        handleTaskDependencyRemove={handleTaskDependencyRemove}
        handleTaskSubtaskAdd={handleTaskSubtaskAdd}
        handleToggleSubtask={handleToggleSubtask}
        handleDeleteSubtask={handleDeleteSubtask}
        handleTaskAssigneeAdd={handleTaskAssigneeAdd}
        handleTaskAssigneeRemove={handleTaskAssigneeRemove}
        availableUsers={availableUsers}
      />
    </>
  );
};

export default TaskPageContent;
