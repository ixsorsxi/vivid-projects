
import React, { useState, useEffect } from 'react';
import { useTaskManagement } from '../hooks/useTaskManagement';
import useViewPreference from '@/hooks/useViewPreference';
import useAdvancedTaskFeatures from '../hooks/useAdvancedTaskFeatures';
import TaskHeader from './TaskHeader';
import TaskDialogs from './TaskDialogs';
import TaskDashboard from './TaskDashboard';
import { useAuth } from '@/context/auth';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchUserTasks } from '@/api/tasks';

const TaskPageContent = () => {
  const [isLoadingView, setIsLoadingView] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const [assigningDemoTasks, setAssigningDemoTasks] = useState(false);
  
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

  // Function to manually assign demo tasks to current user
  const assignDemoTasksToCurrentUser = async () => {
    if (isAuthenticated && user && !assigningDemoTasks) {
      setAssigningDemoTasks(true);
      try {
        // Force assigning demo tasks to current user
        const assignedTasks = await fetchUserTasks(user.id, true);
        console.log('Assigned demo tasks to current user:', assignedTasks.length);
        
        // Refresh the task list
        if (refetchTasks) {
          refetchTasks();
        }
      } catch (error) {
        console.error('Error assigning demo tasks:', error);
      } finally {
        setAssigningDemoTasks(false);
      }
    }
  };

  // Determine if we should show the assign demo tasks button
  const showAssignDemoTasksButton = isAuthenticated && user && tasks.length === 0;

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

  // Refresh tasks when authentication state changes or user changes
  useEffect(() => {
    if (isAuthenticated && user && refetchTasks) {
      console.log('Authentication state changed, refreshing tasks');
      refetchTasks();
    }
  }, [isAuthenticated, user, refetchTasks]);

  return (
    <div className="flex flex-col h-full">
      {/* Modern header with gradient background */}
      <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-6 rounded-xl mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">My Tasks</h1>
            <p className="text-muted-foreground mt-1">
              {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'} to manage
            </p>
          </div>
          <div className="flex gap-2">
            {showAssignDemoTasksButton && (
              <Button 
                onClick={assignDemoTasksToCurrentUser}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                size="sm"
                disabled={assigningDemoTasks}
              >
                {assigningDemoTasks ? 'Assigning...' : 'Assign Demo Tasks'}
              </Button>
            )}
            <Button 
              onClick={() => setIsAddTaskOpen(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
              size="sm"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>
        </div>
      </div>
      
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
          onAddTaskClick={() => setIsAddTaskOpen(true)}
        />
      </div>

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
    </div>
  );
};

export default TaskPageContent;
