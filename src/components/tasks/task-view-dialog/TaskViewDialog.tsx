
import React from 'react';
import { Task } from '@/lib/data';
import {
  Dialog,
  DialogContent,
  DialogHeader
} from '@/components/ui/dialog';
import TaskDetailsHeader from '../task-details/TaskDetailsHeader';
import TaskDescription from '../task-details/TaskDescription';
import TaskMetadata from '../task-details/TaskMetadata';
import TaskDetailsFooter from '../task-details/TaskDetailsFooter';
import TaskStatusBadges from '../task-details/TaskStatusBadges';
import TaskDependencies from '../task-details/TaskDependencies';
import TaskSubtasks from '../task-details/TaskSubtasks';
import TaskAssigneeSelector from '../task-details/TaskAssigneeSelector';

interface TaskViewDialogProps {
  task: Task;
  allTasks: Task[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onAddDependency?: (taskId: string, dependencyTaskId: string, dependencyType: any) => void;
  onRemoveDependency?: (taskId: string, dependencyTaskId: string) => void;
  onAddSubtask?: (taskId: string, subtaskTitle: string) => Promise<boolean>;
  onToggleSubtask?: (taskId: string, subtaskId: string, completed: boolean) => Promise<boolean>;
  onDeleteSubtask?: (taskId: string, subtaskId: string) => Promise<boolean>;
  onAddAssignee?: (taskId: string, userId: string) => Promise<boolean>;
  onRemoveAssignee?: (taskId: string, userId: string) => Promise<boolean>;
  availableUsers?: { id: string, name: string }[];
}

const TaskViewDialog: React.FC<TaskViewDialogProps> = ({
  task,
  allTasks,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  onAddDependency,
  onRemoveDependency,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  onAddAssignee,
  onRemoveAssignee,
  availableUsers
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <TaskDetailsHeader 
            task={task} 
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </DialogHeader>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 space-y-4">
            <TaskStatusBadges task={task} />
            <TaskDescription task={task} />
            
            <div className="border-t pt-4">
              <TaskSubtasks 
                task={task}
                onAddSubtask={onAddSubtask && ((title) => onAddSubtask(task.id, title))}
                onToggleSubtask={onToggleSubtask && ((subtaskId, completed) => onToggleSubtask(task.id, subtaskId, completed))}
                onDeleteSubtask={onDeleteSubtask && ((subtaskId) => onDeleteSubtask(task.id, subtaskId))}
              />
            </div>
            
            <div className="border-t pt-4">
              <TaskDependencies 
                task={task}
                allTasks={allTasks}
                onAddDependency={onAddDependency && ((dependencyTaskId, type) => onAddDependency(task.id, dependencyTaskId, type))}
                onRemoveDependency={onRemoveDependency && ((dependencyTaskId) => onRemoveDependency(task.id, dependencyTaskId))}
              />
            </div>
          </div>
          
          <div className="col-span-1 space-y-4">
            <TaskMetadata task={task} />
            
            <div className="border-t pt-4">
              <TaskAssigneeSelector 
                task={task}
                availableUsers={availableUsers || []}
                onAddAssignee={onAddAssignee && ((userId) => onAddAssignee(task.id, userId))}
                onRemoveAssignee={onRemoveAssignee && ((userId) => onRemoveAssignee(task.id, userId))}
              />
            </div>
          </div>
        </div>
        
        <TaskDetailsFooter task={task} />
      </DialogContent>
    </Dialog>
  );
};

export default TaskViewDialog;
