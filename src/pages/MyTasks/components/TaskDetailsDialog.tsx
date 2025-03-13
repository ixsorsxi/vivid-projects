
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
import { Task } from '@/lib/data';
import Avatar from '@/components/ui/avatar';

interface TaskDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onEditClick: () => void;
}

const TaskDetailsDialog: React.FC<TaskDetailsDialogProps> = ({
  open,
  onOpenChange,
  task,
  onEditClick
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
      <DialogContent className="sm:max-w-[500px]">
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
          
          {task.assignees && task.assignees.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <Users className="h-4 w-4 mr-1" />
                Assignees
              </h4>
              <div className="flex flex-wrap gap-2">
                {task.assignees.map((assignee, index) => (
                  <div key={index} className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-md">
                    <Avatar name={assignee.name} src={assignee.avatar || undefined} size="xs" />
                    <span className="text-sm">{assignee.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
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
