
import React from 'react';
import { Task } from '@/lib/data';
import { cn } from '@/lib/utils';
import TaskList from './TaskList';
import TaskBoardView from './TaskBoardView';
import TaskCalendarView from './TaskCalendarView';

interface TaskContentProps {
  viewType: string;
  isViewTransitioning: boolean;
  isLoadingView: boolean;
  filteredTasks: Task[];
  filterPriority: string | null;
  setFilterPriority: (priority: string | null) => void;
  handleToggleStatus: (taskId: string) => void;
  handleViewTask: (task: Task) => void;
  handleEditTask: (task: Task) => void;
  handleUpdateTask: (task: Task) => void;
  handleDeleteTask: (taskId: string) => void;
  sortBy: 'dueDate' | 'priority' | 'status';
  formatDueDate: (date: string) => string;
  onAddTaskClick: () => void;
}

const TaskContent: React.FC<TaskContentProps> = ({
  viewType,
  isViewTransitioning,
  isLoadingView,
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
  onAddTaskClick
}) => {
  
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
          onAddTaskClick={onAddTaskClick}
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
};

export default TaskContent;
