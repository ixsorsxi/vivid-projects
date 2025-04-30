
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProjectMilestone } from '@/lib/types/project';
import { toast } from '@/components/ui/toast-wrapper';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export interface ProjectMilestoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  milestone?: ProjectMilestone;
  isEditing?: boolean;
  onAddMilestone: (milestone: Omit<ProjectMilestone, "id" | "created_at" | "project_id">) => Promise<void>;
}

const ProjectMilestoneDialog: React.FC<ProjectMilestoneDialogProps> = ({
  open,
  onOpenChange,
  projectId,
  milestone,
  isEditing = false,
  onAddMilestone
}) => {
  const [title, setTitle] = useState(milestone?.title || '');
  const [description, setDescription] = useState(milestone?.description || '');
  const [status, setStatus] = useState(milestone?.status || 'not-started');
  const [dueDate, setDueDate] = useState<Date | undefined>(
    milestone?.due_date ? new Date(milestone.due_date) : undefined
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !dueDate) {
      toast.error('Required fields missing', {
        description: 'Please fill in all required fields.'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onAddMilestone({
        title,
        description,
        status: status as ProjectMilestone['status'],
        due_date: dueDate.toISOString(),
        completion_date: status === 'completed' ? new Date().toISOString() : undefined
      });
      
      toast({
        title: `Milestone ${isEditing ? 'Updated' : 'Added'}`,
        description: `${title} has been ${isEditing ? 'updated' : 'added'} successfully.`,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving milestone:', error);
      toast.error('Failed to save milestone', {
        description: 'An error occurred while saving the milestone.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Milestone' : 'Add Milestone'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
            <Input
              id="title"
              placeholder="Milestone title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the milestone"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not-started">Not Started</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date <span className="text-red-500">*</span></Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, 'PP') : <span>Select a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !title || !dueDate}>
              {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Milestone'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectMilestoneDialog;
