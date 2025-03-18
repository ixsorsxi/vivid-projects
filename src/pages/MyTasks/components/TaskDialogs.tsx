
import React from 'react';
import { Task } from '@/lib/data';
import TaskForm from '@/components/tasks/task-form';
import TaskViewDialog from '@/components/tasks/task-view-dialog/TaskViewDialog';
import TaskEditDialog from '@/components/tasks/task-edit-dialog/TaskEditDialog';

interface TaskDialogsProps {
  isAddTaskOpen: boolean;
  setIsAddTaskOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isViewTaskOpen: boolean;
  setIsViewTaskOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isEditTaskOpen: boolean;
  setIsEditTaskOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTask: Task | null;
  tasks: Task[];
  handleAddTask: (task: Partial<Task>) => void;
  handleUpdateTask: (task: Task) => void;
  handleDeleteTask: (taskId: string) => void;
  handleTaskDependencyAdd?: (taskId: string, dependencyTaskId: string, dependencyType: any) => void;
  handleTaskDependencyRemove?: (taskId: string, dependencyTaskId: string) => void;
  handleTaskSubtaskAdd?: (taskId: string, subtaskTitle: string) => Promise<boolean>;
  handleToggleSubtask?: (taskId: string, subtaskId: string, completed: boolean) => Promise<boolean>;
  handleDeleteSubtask?: (taskId: string, subtaskId: string) => Promise<boolean>;
  handleTaskAssigneeAdd?: (taskId: string, userId: string) => Promise<boolean>;
  handleTaskAssigneeRemove?: (taskId: string, userId: string) => Promise<boolean>;
  availableUsers?: { id: string, name: string }[];
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
  handleDeleteTask,
  handleTaskDependencyAdd,
  handleTaskDependencyRemove,
  handleTaskSubtaskAdd,
  handleToggleSubtask,
  handleDeleteSubtask,
  handleTaskAssigneeAdd,
  handleTaskAssigneeRemove,
  availableUsers
}) => {
  return (
    <>
      {/* Add Task Dialog */}
      <TaskForm
        open={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
        onAddTask={handleAddTask}
      />
      
      {/* View Task Dialog */}
      {selectedTask && (
        <TaskViewDialog
          open={isViewTaskOpen}
          onOpenChange={setIsViewTaskOpen}
          task={selectedTask}
          allTasks={tasks}
          onEdit={() => {
            setIsViewTaskOpen(false);
            setIsEditTaskOpen(true);
          }}
          onDelete={() => {
            handleDeleteTask(selectedTask.id);
            setIsViewTaskOpen(false);
          }}
          onAddDependency={
            handleTaskDependencyAdd 
              ? (dependencyId, type) => selectedTask && handleTaskDependencyAdd(selectedTask.id, dependencyId, type)
              : undefined
          }
          onRemoveDependency={
            handleTaskDependencyRemove
              ? (dependencyId) => selectedTask && handleTaskDependencyRemove(selectedTask.id, dependencyId)
              : undefined
          }
          onAddSubtask={
            handleTaskSubtaskAdd
              ? (title) => selectedTask && handleTaskSubtaskAdd(selectedTask.id, title)
              : undefined
          }
          onToggleSubtask={
            handleToggleSubtask
              ? (subtaskId, completed) => selectedTask && handleToggleSubtask(selectedTask.id, subtaskId, completed ?? false)
              : undefined
          }
          onDeleteSubtask={
            handleDeleteSubtask
              ? (subtaskId) => selectedTask && handleDeleteSubtask(selectedTask.id, subtaskId)
              : undefined
          }
          onAddAssignee={
            handleTaskAssigneeAdd
              ? (userId) => selectedTask && handleTaskAssigneeAdd(selectedTask.id, userId)
              : undefined
          }
          onRemoveAssignee={
            handleTaskAssigneeRemove
              ? (userId) => selectedTask && handleTaskAssigneeRemove(selectedTask.id, userId)
              : undefined
          }
          availableUsers={availableUsers}
        />
      )}
      
      {/* Edit Task Dialog */}
      {selectedTask && (
        <TaskEditDialog
          open={isEditTaskOpen}
          onOpenChange={setIsEditTaskOpen}
          task={selectedTask}
          onUpdateTask={handleUpdateTask}
          onCancel={() => setIsEditTaskOpen(false)}
        />
      )}
    </>
  );
};

export default TaskDialogs;
