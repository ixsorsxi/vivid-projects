import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Edit, Briefcase, Users } from 'lucide-react';
import { Task, Assignee } from '@/lib/data';
import Avatar from '@/components/ui/avatar';
import TaskDependencies from '@/components/tasks/task-details/TaskDependencies';
import TaskSubtasks from '@/components/tasks/task-details/TaskSubtasks';
import TaskAssigneeSelector from '@/components/tasks/task-details/TaskAssigneeSelector';

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
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'to-do':
        return <Badge variant="outline">To Do</Badge>;
      case 'in-progress':
        return <Badge variant="primary">In Progress</Badge>;
      case 'in-review':
        return <Badge className="bg-purple-500/15 text-purple-500 border-purple-500/20">In Review</Badge>;
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      default:
        return null;
    }
  };
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'low':
        return <Badge className="bg-blue-500/15 text-blue-500 border-blue-500/20">Low Priority</Badge>;
      case 'medium':
        return <Badge className="bg-amber-500/15 text-amber-500 border-amber-500/20">Medium Priority</Badge>;
      case 'high':
        return <Badge className="bg-rose-500/15 text-rose-500 border-rose-500/20">High Priority</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{task.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-2">
          <div className="flex flex-wrap gap-2">
            {getStatusBadge(task.status)}
            {getPriorityBadge(task.priority)}
          </div>
          
          {task.description && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-1">Description</h4>
              <p className="text-sm text-muted-foreground">
                {task.description}
              </p>
            </div>
          )}
          
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Due Date: {formatDate(task.dueDate)}</span>
            </div>
            
            {task.project && (
              <div className="flex items-center">
                <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Project: {task.project}</span>
              </div>
            )}
          </div>
          
          {/* Task Dependencies Section */}
          {onAddDependency && onRemoveDependency && (
            <TaskDependencies
              task={task}
              allTasks={allTasks}
              onDependencyAdd={(taskId, type) => onAddDependency(taskId, type)}
              onDependencyRemove={onRemoveDependency}
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
        
        <DialogFooter className="mt-6">
          <Button onClick={() => {
            onOpenChange(false);
            onEditClick();
          }}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailsDialog;
