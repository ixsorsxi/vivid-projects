
import { Task } from '@/lib/data';

interface UseTaskFeatureHandlersProps {
  tasks: Task[];
  selectedTask: Task | null;
  handleAddDependency: (taskId: string, dependencyId: string, dependencyType: any) => void;
  handleRemoveDependency: (taskId: string, dependencyId: string) => void;
  handleAddSubtask: (parentId: string, title: string) => void;
  handleToggleSubtask: (taskId: string) => void;
  handleDeleteSubtask: (taskId: string) => void;
  handleAddAssignee: (taskId: string, assignee: any) => void;
  handleRemoveAssignee: (taskId: string, assigneeName: string) => void;
}

export const useTaskFeatureHandlers = ({
  tasks,
  selectedTask,
  handleAddDependency,
  handleRemoveDependency,
  handleAddSubtask,
  handleToggleSubtask,
  handleDeleteSubtask,
  handleAddAssignee,
  handleRemoveAssignee
}: UseTaskFeatureHandlersProps) => {
  
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

  return {
    handleTaskDependencyAdd,
    handleTaskDependencyRemove,
    handleTaskSubtaskAdd,
    handleTaskAssigneeAdd,
    handleTaskAssigneeRemove
  };
};

export default useTaskFeatureHandlers;
