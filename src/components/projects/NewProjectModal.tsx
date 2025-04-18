
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createProject } from '@/api/projects/projectCreate';
import { toast } from '@/components/ui/toast-wrapper';

export interface NewProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProject: (projectId: string) => void;
}

const NewProjectModal: React.FC<NewProjectModalProps> = ({
  open,
  onOpenChange,
  onCreateProject
}) => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectStatus, setProjectStatus] = useState<string>('in-progress');
  const [projectCategory, setProjectCategory] = useState<string>('Development');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      toast.error('Project name is required');
      return;
    }

    try {
      setIsCreating(true);
      
      const result = await createProject({
        name: projectName,
        description: projectDescription,
        status: projectStatus,
        category: projectCategory
      });

      if (result.success && result.project) {
        toast.success('Project created successfully');
        onCreateProject(result.project.id);
        onOpenChange(false);
        
        // Reset form
        setProjectName('');
        setProjectDescription('');
        setProjectStatus('in-progress');
        setProjectCategory('Development');
      } else {
        toast.error('Failed to create project', {
          description: result.message || 'An error occurred'
        });
      }
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input
              id="name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea
              id="description"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Status</Label>
            <Select
              value={projectStatus}
              onValueChange={setProjectStatus}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not-started">Not Started</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Category</Label>
            <Select
              value={projectCategory}
              onValueChange={setProjectCategory}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Development">Development</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Research">Research</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateProject} 
            disabled={isCreating || !projectName.trim()}
          >
            {isCreating ? 'Creating...' : 'Create Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectModal;
