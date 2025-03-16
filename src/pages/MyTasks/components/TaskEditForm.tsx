import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Task, Assignee } from '@/lib/data';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Avatar from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import TaskAssigneeSelector from '@/components/tasks/task-details/TaskAssigneeSelector';

interface TaskEditFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onUpdateTask: (task: Task) => void;
  availableUsers?: Assignee[];
}

const TaskEditForm: React.FC<TaskEditFormProps> = ({
  open,
  onOpenChange,
  task,
  onUpdateTask,
  availableUsers = [
    { name: 'Jane Smith' },
    { name: 'John Doe' },
    { name: 'Robert Johnson' },
    { name: 'Michael Brown' },
    { name: 'Emily Davis' },
    { name: 'Sarah Williams' }
  ]
}) => {
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  
  useEffect(() => {
    if (task && open) {
      setEditedTask({ ...task });
    }
  }, [task, open]);
  
  useEffect(() => {
    return () => {
      if (open) {
        onOpenChange(false);
      }
    };
  }, []);
  
  if (!editedTask) return null;
  
  const handleSubmit = () => {
    if (editedTask) {
      onUpdateTask(editedTask);
    }
    onOpenChange(false);
  };
  
  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleAddAssignee = (assignee: Assignee) => {
    if (editedTask.assignees.some(a => a.name === assignee.name)) {
      return;
    }
    
    setEditedTask({
      ...editedTask,
      assignees: [...editedTask.assignees, assignee]
    });
  };
  
  const handleRemoveAssignee = (assigneeName: string) => {
    setEditedTask({
      ...editedTask,
      assignees: editedTask.assignees.filter(a => a.name !== assigneeName)
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        setTimeout(() => onOpenChange(isOpen), 0);
      } else {
        onOpenChange(isOpen);
      }
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Make changes to your task here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title*
            </Label>
            <Input
              id="title"
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              className="col-span-3"
              placeholder="Enter task title"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={editedTask.description || ''}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              className="col-span-3"
              placeholder="Add details about the task"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select 
              value={editedTask.status} 
              onValueChange={(value) => setEditedTask({ 
                ...editedTask, 
                status: value,
                completed: value === 'completed'
              })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="to-do">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="in-review">In Review</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              Priority
            </Label>
            <Select 
              value={editedTask.priority} 
              onValueChange={(value) => setEditedTask({ ...editedTask, priority: value })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dueDate" className="text-right">
              Due Date
            </Label>
            <div className="col-span-3 relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="dueDate"
                type="date"
                value={formatDateForInput(editedTask.dueDate)}
                onChange={(e) => setEditedTask({ ...editedTask, dueDate: new Date(e.target.value).toISOString() })}
                className={cn("pl-9")}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Assignees
            </Label>
            <div className="col-span-3">
              <TaskAssigneeSelector
                assignees={editedTask.assignees}
                availableUsers={availableUsers}
                onAssigneeAdd={handleAddAssignee}
                onAssigneeRemove={handleRemoveAssignee}
              />
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskEditForm;
