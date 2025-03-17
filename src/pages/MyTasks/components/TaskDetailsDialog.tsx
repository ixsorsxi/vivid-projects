
import React, { useEffect } from 'react';
import { 
  Dialog, 
  DialogContent,
} from '@/components/ui/dialog';
import { Task } from '@/lib/data';
import TaskDetailsHeader from '@/components/tasks/task-details/TaskDetailsHeader';
import TaskDetailsFooter from '@/components/tasks/task-details/TaskDetailsFooter';
import TaskDetailsSections from './TaskDetailsSections';

interface TaskDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  allTasks: Task[];
  onEditClick: () => void;
  onAddDependency?: (taskId: string, dependencyType: string) => void;
  onRemoveDependency?: (taskId: string) => void;
  onAddSubtask?: (parentId: string, title: string) => void;
  onToggleSubtask?: (taskId: string) => void;
  onDeleteSubtask?: (taskId: string) => void;
  onAssigneeAdd?: (taskId: string, assignee: any) => void;
  onAssigneeRemove?: (taskId: string, assigneeName: string) => void;
  availableUsers?: any[];
}

const TaskDetailsDialog: React.FC<TaskDetailsDialogProps> = ({
  open,
  onOpenChange,
  task,
  allTasks,
  onEditClick,
  onAddDependency,
  onRemoveDependency,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  onAssigneeAdd,
  onAssigneeRemove,
  availableUsers = []
}) => {
  // Clean up when dialog closes or component unmounts
  useEffect(() => {
    return () => {
      if (open) {
        // Use timeout to ensure this runs after render
        setTimeout(() => {
          onOpenChange(false);
        }, 0);
      }
    };
  }, []);
  
  if (!task) return null;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      // Safely handle dialog open/close
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <TaskDetailsHeader task={task} />
        
        <TaskDetailsSections
          task={task}
          allTasks={allTasks}
          formatDate={formatDate}
          onAddDependency={onAddDependency}
          onRemoveDependency={onRemoveDependency}
          onAddSubtask={onAddSubtask ? (parentId, title) => onAddSubtask(parentId, title) : undefined}
          onToggleSubtask={onToggleSubtask}
          onDeleteSubtask={onDeleteSubtask}
          onAssigneeAdd={assignee => onAssigneeAdd && onAssigneeAdd(task.id, assignee)}
          onAssigneeRemove={userName => onAssigneeRemove && onAssigneeRemove(task.id, userName)}
          availableUsers={availableUsers}
        />
        
        <TaskDetailsFooter onOpenChange={onOpenChange} onEditClick={onEditClick} />
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailsDialog;
