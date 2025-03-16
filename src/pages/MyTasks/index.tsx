
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import PageContainer from '@/components/PageContainer';
import FadeIn from '@/components/animations/FadeIn';
import { Task, DependencyType } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useTaskManagement } from './hooks/useTaskManagement';
import useViewPreference from '@/hooks/useViewPreference';
import useAdvancedTaskFeatures from './hooks/useAdvancedTaskFeatures';
import TaskFilterTabs from './components/TaskFilterTabs';
import TaskContent from './components/TaskContent';
import TaskHeader from './components/TaskHeader';
import TaskDialogs from './components/TaskDialogs';
import { useAuth } from '@/context/auth';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

const MyTasks = () => {
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
      handleAddDependency(selectedTask.id, taskId, dependencyType as DependencyType);
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
    <PageContainer title="My Tasks" subtitle="Manage and track tasks assigned to you">
      <div className="space-y-6">
        {!isAuthenticated && (
          <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-md mb-6">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800">Authentication Required</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  You're using the app in demo mode. Sign in to save your tasks and access all features.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <TaskHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setFilterPriority={setFilterPriority}
          setSortBy={setSortBy}
          onAddTask={() => setIsAddTaskOpen(true)}
          viewType={viewType}
          setViewType={setViewType}
        />
        
        <FadeIn duration={800} delay={100}>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TaskFilterTabs activeTab={activeTab} />
            
            <TabsContent value={activeTab} className={cn(
              "mt-6 relative",
              (isViewTransitioning || isLoadingView || isLoading) && "opacity-70 pointer-events-none transition-opacity"
            )}>
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-slate-200 rounded w-32 mx-auto"></div>
                    <div className="h-4 bg-slate-200 rounded w-48 mx-auto"></div>
                    <div className="flex justify-center mt-4">
                      <div className="w-8 h-8 border-t-2 border-primary rounded-full animate-spin"></div>
                    </div>
                  </div>
                </div>
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
        </FadeIn>
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
        handleTaskDependencyAdd={handleTaskDependencyAdd}
        handleTaskDependencyRemove={handleTaskDependencyRemove}
        handleTaskSubtaskAdd={handleTaskSubtaskAdd}
        handleToggleSubtask={handleToggleSubtask}
        handleDeleteSubtask={handleDeleteSubtask}
        handleTaskAssigneeAdd={handleTaskAssigneeAdd}
        handleTaskAssigneeRemove={handleTaskAssigneeRemove}
        availableUsers={availableUsers}
      />
    </PageContainer>
  );
};

export default MyTasks;
