
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
import TaskBoardView from './components/TaskBoardView';
import TaskCalendarView from './components/TaskCalendarView';
import { LayoutGrid, CalendarDays, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useViewPreference from '@/hooks/useViewPreference';

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

  const { viewType, setViewType } = useViewPreference('list', 'myTasks.viewPreference');

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
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
            <Button 
              variant={viewType === 'kanban' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewType('kanban')}
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Board
            </Button>
            <Button 
              variant={viewType === 'calendar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewType('calendar')}
            >
              <CalendarDays className="h-4 w-4 mr-2" />
              Calendar
            </Button>
          </div>
        </div>
        
        <FadeIn duration={800} delay={100}>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TaskFilterTabs activeTab={activeTab} />
            
            <TabsContent value={activeTab} className="mt-6">
              {viewType === 'list' && (
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
              )}

              {viewType === 'kanban' && (
                <TaskBoardView
                  tasks={filteredTasks}
                  onStatusChange={handleToggleStatus}
                  onViewTask={handleViewTask}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  formatDueDate={formatDueDate}
                />
              )}

              {viewType === 'calendar' && (
                <TaskCalendarView
                  tasks={filteredTasks}
                  onStatusChange={handleToggleStatus}
                  onViewTask={handleViewTask}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                />
              )}
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
