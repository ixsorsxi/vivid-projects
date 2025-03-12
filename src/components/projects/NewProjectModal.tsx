
import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useProjectForm } from '@/hooks/useProjectForm';
import BasicInformationSection from './BasicInformationSection';
import PhasesSection from './PhasesSection';

const NewProjectModal = ({ buttonClassName }: { buttonClassName?: string }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = React.useState(false);
  
  const {
    projectName,
    setProjectName,
    projectDescription,
    setProjectDescription,
    projectCategory,
    setProjectCategory,
    dueDate,
    setDueDate,
    isPrivate,
    setIsPrivate,
    projectCode,
    budget,
    setBudget,
    currency,
    setCurrency,
    phases,
    generateProjectCode,
    addPhase,
    updatePhase,
    removePhase,
    addMilestone,
    updateMilestone,
    removeMilestone,
    resetForm
  } = useProjectForm();

  useEffect(() => {
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
      code: projectCode,
      budget: parseFloat(budget),
      currency,
      phases
    });
    
    toast({
      title: "Success",
      description: `Project "${projectName}" created successfully`,
    });
    
    setIsOpen(false);
    navigate('/projects/' + encodeURIComponent(projectName.toLowerCase().replace(/\s+/g, '-')));
  };

  useEffect(() => {
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
      <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Enter the details for your new project. Fill in all required information.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateProject} className="space-y-6 mt-4">
          {/* Basic Information */}
          <BasicInformationSection 
            projectName={projectName}
            setProjectName={setProjectName}
            projectDescription={projectDescription}
            setProjectDescription={setProjectDescription}
            projectCategory={projectCategory}
            setProjectCategory={setProjectCategory}
            dueDate={dueDate}
            setDueDate={setDueDate}
            projectCode={projectCode}
            budget={budget}
            setBudget={setBudget}
            currency={currency}
            setCurrency={setCurrency}
          />

          {/* Project Phases */}
          <PhasesSection 
            phases={phases}
            addPhase={addPhase}
            updatePhase={updatePhase}
            removePhase={removePhase}
            addMilestone={addMilestone}
            updateMilestone={updateMilestone}
            removeMilestone={removeMilestone}
          />
          
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
