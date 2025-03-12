
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, Calendar, User, Hash } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface NewProjectModalProps {
  buttonClassName?: string;
}

const NewProjectModal = ({ buttonClassName }: NewProjectModalProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = React.useState(false);
  
  // Project form state
  const [projectName, setProjectName] = React.useState('');
  const [projectDescription, setProjectDescription] = React.useState('');
  const [projectCategory, setProjectCategory] = React.useState('');
  const [dueDate, setDueDate] = React.useState('');
  const [isPrivate, setIsPrivate] = React.useState(false);
  const [projectCode, setProjectCode] = React.useState('');

  const generateProjectCode = () => {
    // Generate a random project code (e.g., PRJ-1234)
    const random = Math.floor(1000 + Math.random() * 9000);
    setProjectCode(`PRJ-${random}`);
  };

  React.useEffect(() => {
    if (isOpen) {
      generateProjectCode();
    }
  }, [isOpen]);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectName.trim()) {
      toast({
        title: "Error",
        description: "Project name is required",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would create a project in the backend
    console.log('Creating new project:', {
      name: projectName,
      description: projectDescription,
      category: projectCategory,
      dueDate,
      isPrivate,
      code: projectCode
    });
    
    toast({
      title: "Success",
      description: `Project "${projectName}" created successfully`,
    });
    
    setIsOpen(false);
    navigate('/projects/' + encodeURIComponent(projectName.toLowerCase().replace(/\s+/g, '-')));
  };

  const resetForm = () => {
    setProjectName('');
    setProjectDescription('');
    setProjectCategory('');
    setDueDate('');
    setIsPrivate(false);
    generateProjectCode();
  };

  React.useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={buttonClassName || "gap-2"}>
          <PlusCircle className="h-4 w-4" />
          <span>New Project</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Enter the details for your new project. Fill in all required information.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateProject} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="projectName">Project Name *</Label>
            <Input
              id="projectName"
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="projectCode">Project Code</Label>
            <Input
              id="projectCode"
              value={projectCode}
              onChange={(e) => setProjectCode(e.target.value)}
              className="w-full"
              prefix={<Hash className="h-4 w-4 text-muted-foreground" />}
              readOnly
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="projectDescription">Description</Label>
            <textarea
              id="projectDescription"
              placeholder="Enter project description"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectCategory">Category</Label>
              <Select value={projectCategory} onValueChange={setProjectCategory}>
                <SelectTrigger id="projectCategory">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                prefix={<Calendar className="h-4 w-4 text-muted-foreground" />}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="isPrivate" 
              checked={isPrivate} 
              onCheckedChange={(checked) => setIsPrivate(checked as boolean)} 
            />
            <Label htmlFor="isPrivate" className="text-sm font-normal">
              Make this project private
            </Label>
          </div>
          
          <div className="flex justify-between pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Project</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectModal;
