
import React, { useState, useEffect } from 'react';
import { useTaskManagement } from '../hooks/useTaskManagement';
import useViewPreference from '@/hooks/useViewPreference';
import { useAuth } from '@/context/auth';
import TaskPageHeader from './TaskPageHeader';
import TaskMainContent from './TaskMainContent';
import TaskDialogs from './TaskDialogs';
import useTaskFeaturesManager from '../hooks/useTaskFeaturesManager';

const TaskPageContent = () => {
  const [isLoadingView, setIsLoadingView] = useState(false);
  const { isAuthenticated, user } = useAuth();
  
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

  const taskFeatures = useTaskFeaturesManager(tasks, setTasks, selectedTask);

  const { viewType, setViewType, isViewTransitioning } = useViewPreference({
    defaultView: 'list',
    storageKey: 'myTasks.viewPreference',
    onViewChange: () => {
      setIsLoadingView(true);
      setTimeout(() => setIsLoadingView(false), 300);
    }
  });

  // Refresh tasks when authentication state changes or user changes
  useEffect(() => {
    if (isAuthenticated && user && refetchTasks) {
      console.log('Authentication state changed, refreshing tasks');
      refetchTasks();
    }
  }, [isAuthenticated, user, refetchTasks]);

  return (
    <div className="flex flex-col h-full">
      <TaskPageHeader 
        taskCount={filteredTasks.length}
        onAddTask={() => setIsAddTaskOpen(true)}
      />
      
      <TaskMainContent
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onAddTask={() => setIsAddTaskOpen(true)}
        viewType={viewType}
        setViewType={setViewType}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isViewTransitioning={isViewTransitioning}
        isLoadingView={isLoadingView}
        isLoading={isLoading}
        filteredTasks={filteredTasks}
        handleToggleStatus={handleToggleStatus}
        handleViewTask={handleViewTask}
        handleEditTask={handleEditTask}
        handleUpdateTask={handleUpdateTask}
        handleDeleteTask={handleDeleteTask}
        formatDueDate={formatDueDate}
      />

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
        handleDeleteTask={handleDeleteTask}
        handleTaskDependencyAdd={taskFeatures.handleTaskDependencyAdd}
        handleTaskDependencyRemove={taskFeatures.handleTaskDependencyRemove}
        handleTaskSubtaskAdd={taskFeatures.handleTaskSubtaskAdd}
        handleToggleSubtask={taskFeatures.handleToggleSubtask}
        handleDeleteSubtask={taskFeatures.handleDeleteSubtask}
        handleTaskAssigneeAdd={taskFeatures.handleTaskAssigneeAdd}
        handleTaskAssigneeRemove={taskFeatures.handleTaskAssigneeRemove}
        availableUsers={taskFeatures.availableUsers}
      />
    </div>
  );
};

export default TaskPageContent;
