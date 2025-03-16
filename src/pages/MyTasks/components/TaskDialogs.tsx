
import React, { useEffect } from 'react';
import { Task } from '@/lib/data';
import TaskForm from '@/components/tasks/task-form';
import TaskDetailsDialog from './TaskDetailsDialog';
import TaskEditForm from './TaskEditForm';
import { useLocation } from 'react-router-dom';

interface TaskDialogsProps {
  isAddTaskOpen: boolean;
  setIsAddTaskOpen: (open: boolean) => void;
  isViewTaskOpen: boolean;
  setIsViewTaskOpen: (open: boolean) => void;
  isEditTaskOpen: boolean;
  setIsEditTaskOpen: (open: boolean) => void;
  selectedTask: Task | null;
  tasks: Task[];
  handleAddTask: (task: Partial<Task>) => void;
  handleUpdateTask: (task: Task) => void;
  handleTaskDependencyAdd: (taskId: string, dependencyType: string) => void;
  handleTaskDependencyRemove: (dependencyTaskId: string) => void;
  handleTaskSubtaskAdd: (parentId: string, title: string) => void;
  handleToggleSubtask: (taskId: string) => void;
  handleDeleteSubtask: (taskId: string) => void;
  handleTaskAssigneeAdd: (taskId: string, assignee: any) => void;
  handleTaskAssigneeRemove: (taskId: string, assigneeName: string) => void;
  availableUsers: any[];
}

const TaskDialogs: React.FC<TaskDialogsProps> = ({
  isAddTaskOpen,
  setIsAddTaskOpen,
  isViewTaskOpen,
  setIsViewTaskOpen,
  isEditTaskOpen,
  setIsEditTaskOpen,
  selectedTask,
  tasks,
  handleAddTask,
  handleUpdateTask,
  handleTaskDependencyAdd,
  handleTaskDependencyRemove,
  handleTaskSubtaskAdd,
  handleToggleSubtask,
  handleDeleteSubtask,
  handleTaskAssigneeAdd,
  handleTaskAssigneeRemove,
  availableUsers
}) => {
  // Get current location to detect navigation
  const location = useLocation();
  
  // Close all dialogs when location changes or component unmounts
  useEffect(() => {
    const closeAllDialogs = () => {
      setIsAddTaskOpen(false);
      setIsViewTaskOpen(false);
      setIsEditTaskOpen(false);
    };
    
    closeAllDialogs();
    
    // Clean up function that runs when component unmounts or when location changes
    return closeAllDialogs;
  }, [location, setIsAddTaskOpen, setIsViewTaskOpen, setIsEditTaskOpen]);

  // Safe way to close dialogs that ensures state is properly cleaned up
  const safelyCloseViewDialog = (isOpen: boolean) => {
    if (!isOpen) {
      // Give time for animations to complete
      setTimeout(() => {
        setIsViewTaskOpen(false);
      }, 100);
    } else {
      setIsViewTaskOpen(true);
    }
  };
  
  const safelyCloseEditDialog = (isOpen: boolean) => {
    if (!isOpen) {
      // Give time for animations to complete
      setTimeout(() => {
        setIsEditTaskOpen(false);
      }, 100);
    } else {
      setIsEditTaskOpen(true);
    }
  };

  return (
    <>
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
          onOpenChange={safelyCloseViewDialog}
          task={selectedTask}
          allTasks={tasks}
          onEditClick={() => {
            setIsViewTaskOpen(false);
            // Add delay to ensure dialogs don't conflict
            setTimeout(() => {
              setIsEditTaskOpen(true);
            }, 150);
          }}
          onAddDependency={handleTaskDependencyAdd}
          onRemoveDependency={handleTaskDependencyRemove}
          onAddSubtask={handleTaskSubtaskAdd}
          onToggleSubtask={handleToggleSubtask}
          onDeleteSubtask={handleDeleteSubtask}
          onAssigneeAdd={(assignee) => handleTaskAssigneeAdd(selectedTask.id, assignee)}
          onAssigneeRemove={(assigneeName) => handleTaskAssigneeRemove(selectedTask.id, assigneeName)}
          availableUsers={availableUsers}
        />
      )}
      
      {/* Task Edit Form */}
      {isEditTaskOpen && selectedTask && (
        <TaskEditForm
          open={isEditTaskOpen}
          onOpenChange={safelyCloseEditDialog}
          task={selectedTask}
          onUpdateTask={handleUpdateTask}
        />
      )}
    </>
  );
};

export default TaskDialogs;
