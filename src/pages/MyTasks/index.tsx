
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import PageContainer from '@/components/PageContainer';
import FadeIn from '@/components/animations/FadeIn';
import { demoTasks, Task, DependencyType } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useTaskManagement } from './hooks/useTaskManagement';
import useViewPreference from '@/hooks/useViewPreference';
import useAdvancedTaskFeatures from './hooks/useAdvancedTaskFeatures';
import TaskFilterTabs from './components/TaskFilterTabs';
import TaskContent from './components/TaskContent';
import TaskHeader from './components/TaskHeader';
import TaskDialogs from './components/TaskDialogs';

const MyTasks = () => {
  const [isLoadingView, setIsLoadingView] = useState(false);
  
  const {
    tasks,
    setTasks,
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
    formatDueDate
  } = useTaskManagement(demoTasks);

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

  return (
    <PageContainer title="My Tasks" subtitle="Manage and track tasks assigned to you">
      <div className="space-y-6">
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
              (isViewTransitioning || isLoadingView) && "opacity-70 pointer-events-none transition-opacity"
            )}>
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
