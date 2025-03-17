
import React, { useState, useEffect } from 'react';
import { useTaskManagement } from '../hooks/useTaskManagement';
import useViewPreference from '@/hooks/useViewPreference';
import useAdvancedTaskFeatures from '../hooks/useAdvancedTaskFeatures';
import TaskHeader from './TaskHeader';
import TaskDialogs from './TaskDialogs';
import TaskDashboard from './TaskDashboard';
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

  const { viewType, setViewType, isViewTransitioning } = useViewPreference({
    defaultView: 'list',
    storageKey: 'myTasks.viewPreference',
    onViewChange: () => {
      setIsLoadingView(true);
      setTimeout(() => setIsLoadingView(false), 300);
    }
  });

  const handleTaskDependencyAdd = (taskId: string, dependencyType: string) => {
    if (selectedTask) {
      handleAddDependency(selectedTask.id, taskId, dependencyType as any);
    }
  };

  const handleTaskDependencyRemove = (dependencyTaskId: string) => {
    if (selectedTask) {
      handleRemoveDependency(selectedTask.id, dependencyTaskId);
    }
  };

  const handleTaskSubtaskAdd = (parentId: string, title: string) => {
    handleAddSubtask(parentId, title);
  };

  const handleTaskAssigneeAdd = (taskId: string, assignee: any) => {
    handleAddAssignee(taskId, assignee);
  };

  const handleTaskAssigneeRemove = (taskId: string, assigneeName: string) => {
    handleRemoveAssignee(taskId, assigneeName);
  };

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
        sortBy={sortBy}
      />
      
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
        onAddTaskClick={() => setIsAddTaskOpen(true)}
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
