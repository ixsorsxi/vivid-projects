
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface NewProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProject: (project: any) => Promise<void>;
}

const NewProjectModal: React.FC<NewProjectModalProps> = ({
  open,
  onOpenChange,
  onCreateProject
}) => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectStatus, setProjectStatus] = useState('not-started');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectName.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onCreateProject({
        name: projectName,
        description: projectDescription,
        status: projectStatus,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
      
      // Reset form
      setProjectName('');
      setProjectDescription('');
      setProjectStatus('not-started');
      
      // Close modal
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="projectDescription">Description</Label>
            <Textarea
              id="projectDescription"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Project description"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="projectStatus">Status</Label>
            <Select
              value={projectStatus}
              onValueChange={setProjectStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not-started">Not Started</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectModal;
