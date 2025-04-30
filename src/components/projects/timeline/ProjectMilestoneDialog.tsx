
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from 'lucide-react';
import { ProjectMilestone } from '@/lib/types/project';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from '@/components/ui/toast-wrapper';
import { format } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ProjectMilestoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onAddMilestone: (milestone: Omit<ProjectMilestone, 'id' | 'project_id' | 'created_at'>) => Promise<void>;
  milestone?: ProjectMilestone | null;
  isEditing?: boolean;
}

const ProjectMilestoneDialog: React.FC<ProjectMilestoneDialogProps> = ({
  open,
  onOpenChange,
  projectId,
  onAddMilestone,
  milestone = null,
  isEditing = false
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
  const [status, setStatus] = useState<'not-started' | 'in-progress' | 'completed' | 'delayed' | 'blocked'>('not-started');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (milestone) {
      setTitle(milestone.title);
      setDescription(milestone.description || '');
      setDueDate(milestone.due_date ? new Date(milestone.due_date) : undefined);
      setStatus(milestone.status as 'not-started' | 'in-progress' | 'completed' | 'delayed' | 'blocked');
    } else {
      // Reset form when opening for new milestone
      setTitle('');
      setDescription('');
      setDueDate(new Date());
      setStatus('not-started');
    }
  }, [milestone, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !dueDate) {
      toast.error("Missing required information", {
        description: "Please provide a title and due date for the milestone"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onAddMilestone({
        title,
        description,
        due_date: dueDate.toISOString(),
        status,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding milestone:', error);
      toast.error("Failed to save milestone", {
        description: "There was an error saving the milestone"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Milestone' : 'Add New Milestone'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Milestone Title *</Label>
              <Input
                id="title"
                placeholder="Enter milestone title"
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={status} 
                  onValueChange={(value) => setStatus(value as 'not-started' | 'in-progress' | 'completed' | 'delayed' | 'blocked')}
                >
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
                <Label>Due Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${!dueDate ? 'text-muted-foreground' : ''}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, 'PPP') : <span>Pick a date</span>}
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
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !title || !dueDate}>
              {isSubmitting ? "Saving..." : isEditing ? "Update Milestone" : "Add Milestone"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectMilestoneDialog;
