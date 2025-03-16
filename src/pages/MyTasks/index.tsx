
import React, { useState, useCallback, useEffect } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import PageContainer from '@/components/PageContainer';
import FadeIn from '@/components/animations/FadeIn';
import { demoTasks, Task, DependencyType } from '@/lib/data';
import TaskForm from '@/components/tasks/task-form';
import TaskFilterBar from './components/TaskFilterBar';
import TaskFilterTabs from './components/TaskFilterTabs';
import TaskList from './components/TaskList';
import TaskDetailsDialog from './components/TaskDetailsDialog';
import TaskEditForm from './components/TaskEditForm';
import { useTaskManagement } from './hooks/useTaskManagement';
import TaskBoardView from './components/TaskBoardView';
import TaskCalendarView from './components/TaskCalendarView';
import { LayoutGrid, CalendarDays, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useViewPreference from '@/hooks/useViewPreference';
import { cn } from '@/lib/utils';
import useAdvancedTaskFeatures from './hooks/useAdvancedTaskFeatures';

const MyTasks = () => {
  const [isLoadingView, setIsLoadingView] = useState(false);
  
  const {
    tasks,
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
    setTasks
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
  
  // Render the current view based on the view type
  const renderCurrentView = useCallback(() => {
    switch (viewType) {
      case 'list':
        return (
          <TaskList
            filteredTasks={filteredTasks}
            filterPriority={filterPriority}
            setFilterPriority={setFilterPriority}
            handleToggleStatus={handleToggleStatus}
            handleViewTask={handleViewTask}
            handleEditTask={handleEditTask}
            handleDeleteTask={handleDeleteTask}
            sortBy={sortBy}
            formatDueDate={formatDueDate}
            onAddTaskClick={() => setIsAddTaskOpen(true)}
          />
        );
      case 'kanban':
        return (
          <TaskBoardView
            tasks={filteredTasks}
            onStatusChange={handleToggleStatus}
            onViewTask={handleViewTask}
            onEditTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            formatDueDate={formatDueDate}
          />
        );
      case 'calendar':
        return (
          <TaskCalendarView
            tasks={filteredTasks}
            onStatusChange={handleToggleStatus}
            onViewTask={handleViewTask}
            onEditTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        );
      default:
        return null;
    }
  }, [
    viewType, 
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
    setIsAddTaskOpen
  ]);

  return (
    <PageContainer title="My Tasks" subtitle="Manage and track tasks assigned to you">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <TaskFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setFilterPriority={setFilterPriority}
            setSortBy={setSortBy}
            onAddTask={() => setIsAddTaskOpen(true)}
          />
          <div className="flex gap-2">
            <Button 
              variant={viewType === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewType('list')}
              className={cn(
                viewType === 'list' && 'bg-primary text-primary-foreground',
                'transition-all'
              )}
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
            <Button 
              variant={viewType === 'kanban' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewType('kanban')}
              className={cn(
                viewType === 'kanban' && 'bg-primary text-primary-foreground',
                'transition-all'
              )}
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Board
            </Button>
            <Button 
              variant={viewType === 'calendar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewType('calendar')}
              className={cn(
                viewType === 'calendar' && 'bg-primary text-primary-foreground',
                'transition-all'
              )}
            >
              <CalendarDays className="h-4 w-4 mr-2" />
              Calendar
            </Button>
          </div>
        </div>
        
        <FadeIn duration={800} delay={100}>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TaskFilterTabs activeTab={activeTab} />
            
            <TabsContent value={activeTab} className={cn(
              "mt-6 relative",
              (isViewTransitioning || isLoadingView) && "opacity-70 pointer-events-none transition-opacity"
            )}>
              {renderCurrentView()}
            </TabsContent>
          </Tabs>
        </FadeIn>
      </div>

      {/* Task Form Modal */}
      {isAddTaskOpen && (
        <TaskForm 
          open={isAddTaskOpen}
          onOpenChange={setIsAddTaskOpen}
          onAddTask={handleAddTask}
        />
      )}
      
      {/* Task Details Dialog with Advanced Features */}
      {isViewTaskOpen && selectedTask && (
        <TaskDetailsDialog
          open={isViewTaskOpen}
          onOpenChange={setIsViewTaskOpen}
          task={selectedTask}
          allTasks={tasks}
          onEditClick={() => {
            setIsViewTaskOpen(false);
            setIsEditTaskOpen(true);
          }}
          onAddDependency={handleTaskDependencyAdd}
          onRemoveDependency={handleTaskDependencyRemove}
          onAddSubtask={handleTaskSubtaskAdd}
          onToggleSubtask={handleToggleSubtask}
          onDeleteSubtask={handleDeleteSubtask}
          onAssigneeAdd={handleTaskAssigneeAdd}
          onAssigneeRemove={handleTaskAssigneeRemove}
          availableUsers={availableUsers}
        />
      )}
      
      {/* Task Edit Form */}
      {isEditTaskOpen && selectedTask && (
        <TaskEditForm
          open={isEditTaskOpen}
          onOpenChange={setIsEditTaskOpen}
          task={selectedTask}
          onUpdateTask={handleUpdateTask}
        />
      )}
    </PageContainer>
  );
};

export default MyTasks;
