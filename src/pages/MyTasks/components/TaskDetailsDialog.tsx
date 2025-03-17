
import React, { useEffect } from 'react';
import { 
  Dialog, 
  DialogContent,
} from '@/components/ui/dialog';
import { Task, Assignee, DependencyType } from '@/lib/data';
import TaskDetailsHeader from '@/components/tasks/task-details/TaskDetailsHeader';
import TaskDescription from '@/components/tasks/task-details/TaskDescription';
import TaskMetadata from '@/components/tasks/task-details/TaskMetadata';
import TaskDependencies from '@/components/tasks/task-details/TaskDependencies';
import TaskSubtasks from '@/components/tasks/task-details/TaskSubtasks';
import TaskAssigneeSelector from '@/components/tasks/task-details/TaskAssigneeSelector';
import TaskDetailsFooter from '@/components/tasks/task-details/TaskDetailsFooter';

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
  onAssigneeAdd?: (taskId: string, assignee: Assignee) => void;
  onAssigneeRemove?: (taskId: string, assigneeName: string) => void;
  availableUsers?: Assignee[];
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
        
        <div className="space-y-4 mt-2">
          <TaskDescription description={task.description} />
          
          <TaskMetadata 
            dueDate={task.dueDate} 
            project={task.project} 
            formatDate={formatDate} 
          />
          
          {/* Task Dependencies Section */}
          {onAddDependency && onRemoveDependency && (
            <TaskDependencies
              task={task}
              allTasks={allTasks}
              onAddDependency={(taskId, type) => onAddDependency(taskId, type)}
              onRemoveDependency={onRemoveDependency}
            />
          )}
          
          {/* Subtasks Section */}
          <TaskSubtasks
            task={task}
            onAddSubtask={onAddSubtask}
            onToggleSubtask={onToggleSubtask}
            onDeleteSubtask={onDeleteSubtask}
          />
          
          {/* Assignees Section */}
          <TaskAssigneeSelector
            assignees={task.assignees}
            availableUsers={availableUsers}
            onAssigneeAdd={assignee => onAssigneeAdd && onAssigneeAdd(task.id, assignee)}
            onAssigneeRemove={userName => onAssigneeRemove && onAssigneeRemove(task.id, userName)}
          />
        </div>
        
        <TaskDetailsFooter onOpenChange={onOpenChange} onEditClick={onEditClick} />
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailsDialog;
