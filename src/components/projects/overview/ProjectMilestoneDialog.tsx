
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProjectMilestone } from '@/lib/types/project';
import { addProjectMilestone, updateProjectMilestone } from '@/api/projects/modules/projectData';
import { toast } from '@/components/ui/toast-wrapper';
import { useQueryClient } from '@tanstack/react-query';

interface ProjectMilestoneDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  milestone?: ProjectMilestone;
  isEditing?: boolean;
}

const ProjectMilestoneDialog: React.FC<ProjectMilestoneDialogProps> = ({
  open,
  onOpenChange,
  projectId,
  milestone,
  isEditing = false
}) => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: milestone?.title || '',
    description: milestone?.description || '',
    due_date: milestone?.due_date ? new Date(milestone.due_date).toISOString().split('T')[0] : '',
    status: milestone?.status || 'not-started'
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.due_date) {
      toast.error('Missing required fields', {
        description: 'Please provide a title and due date for the milestone'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        due_date: new Date(formData.due_date).toISOString()
      };
      
      if (isEditing && milestone) {
        const success = await updateProjectMilestone(milestone.id, payload);
        if (success) {
          toast.success('Milestone updated', {
            description: 'The milestone has been updated successfully'
          });
        } else {
          throw new Error('Failed to update milestone');
        }
      } else {
        const result = await addProjectMilestone(projectId, payload);
        if (result) {
          toast.success('Milestone created', {
            description: 'The milestone has been added to the project'
          });
        } else {
          throw new Error('Failed to create milestone');
        }
      }
      
      // Invalidate queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ['project-milestones', projectId] });
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving milestone:', error);
      toast.error('Error saving milestone', {
        description: 'Please try again later'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Milestone' : 'Add New Milestone'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title*</Label>
            <Input 
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Milestone title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe the milestone"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="due_date">Due Date*</Label>
            <Input 
              id="due_date"
              type="date"
              value={formData.due_date}
              onChange={(e) => handleChange('due_date', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => handleChange('status', value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not-started">Not Started</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Milestone' : 'Add Milestone'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectMilestoneDialog;
