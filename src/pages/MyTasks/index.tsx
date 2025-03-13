
import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import PageContainer from '@/components/PageContainer';
import FadeIn from '@/components/animations/FadeIn';
import { demoTasks } from '@/lib/data';
import TaskForm from '@/components/tasks/task-form';
import TaskFilterBar from './components/TaskFilterBar';
import TaskFilterTabs from './components/TaskFilterTabs';
import TaskList from './components/TaskList';
import TaskDetailsDialog from './components/TaskDetailsDialog';
import TaskEditForm from './components/TaskEditForm';
import { useTaskManagement } from './hooks/useTaskManagement';

const MyTasks = () => {
  const {
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

  return (
    <PageContainer title="My Tasks" subtitle="Manage and track tasks assigned to you">
      <div className="space-y-6">
        <TaskFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setFilterPriority={setFilterPriority}
          setSortBy={setSortBy}
          onAddTask={() => setIsAddTaskOpen(true)}
        />
        
        <FadeIn duration={800} delay={100}>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TaskFilterTabs activeTab={activeTab} />
            
            <TabsContent value={activeTab} className="mt-6">
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
      
      {/* Task Details Dialog */}
      {isViewTaskOpen && selectedTask && (
        <TaskDetailsDialog
          open={isViewTaskOpen}
          onOpenChange={setIsViewTaskOpen}
          task={selectedTask}
          onEditClick={() => {
            setIsViewTaskOpen(false);
            setIsEditTaskOpen(true);
          }}
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
