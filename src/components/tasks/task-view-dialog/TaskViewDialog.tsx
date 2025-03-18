
import React from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Task } from '@/lib/types/task';
import TaskDetailsHeader from '@/components/tasks/task-details/TaskDetailsHeader';
import TaskStatusBadges from '@/components/tasks/task-details/TaskStatusBadges';
import TaskDescription from '@/components/tasks/task-details/TaskDescription';
import TaskMetadata from '@/components/tasks/task-details/TaskMetadata';
import TaskDependencies from '@/components/tasks/task-details/TaskDependencies';
import TaskSubtasks from '@/components/tasks/task-details/TaskSubtasks';
import TaskAssigneeSelector from '@/components/tasks/task-details/TaskAssigneeSelector';
import TaskDetailsFooter from '@/components/tasks/task-details/TaskDetailsFooter';

interface TaskViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
  allTasks: Task[];
  onEdit: () => void;
  onDelete: () => void;
  onAddDependency?: (taskId: string, dependencyType: string) => void;
  onRemoveDependency?: (dependencyId: string) => void;
  onAddSubtask?: (parentId: string, title: string) => void;
  onToggleSubtask?: (subtaskId: string) => void;
  onDeleteSubtask?: (subtaskId: string) => void;
  onAddAssignee?: (userId: string) => Promise<boolean>;
  onRemoveAssignee?: (userId: string) => Promise<boolean>;
  availableUsers?: { id: string, name: string }[];
}

const TaskViewDialog: React.FC<TaskViewDialogProps> = ({
  open,
  onOpenChange,
  task,
  allTasks,
  onEdit,
  onDelete,
  onAddDependency,
  onRemoveDependency,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  onAddAssignee,
  onRemoveAssignee,
  availableUsers = []
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        {/* Use components that take only the needed props */}
        <TaskDetailsHeader task={task} />
        
        <div className="py-4 space-y-4">
          <TaskStatusBadges status={task.status} priority={task.priority} />
          
          <TaskDescription description={task.description || ''} />
          
          {task.dueDate && (
            <TaskMetadata 
              dueDate={task.dueDate} 
              project={task.project}
              createdAt=""
              formatDate={formatDate}
            />
          )}
          
          {onAddDependency && onRemoveDependency && (
            <TaskDependencies
              task={task}
              allTasks={allTasks}
              onAddDependency={(taskId, type) => onAddDependency(taskId, type as string)}
              onRemoveDependency={onRemoveDependency}
            />
          )}
          
          <TaskSubtasks
            task={task}
            onAddSubtask={onAddSubtask}
            onToggleSubtask={onToggleSubtask}
            onDeleteSubtask={onDeleteSubtask}
          />
          
          <TaskAssigneeSelector
            assignees={task.assignees}
            availableUsers={availableUsers.map(u => ({ name: u.name, id: u.id }))}
            onAssigneeAdd={user => onAddAssignee && onAddAssignee(user.id as string)}
            onAssigneeRemove={name => onRemoveAssignee && onRemoveAssignee(name)}
          />
        </div>
        
        <TaskDetailsFooter onOpenChange={onOpenChange} onEditClick={onEdit} />
      </DialogContent>
    </Dialog>
  );
};

export default TaskViewDialog;
