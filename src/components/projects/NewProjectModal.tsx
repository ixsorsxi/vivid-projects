
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
import { toast } from '@/components/ui/toast-wrapper';
import { useProjectForm } from '@/hooks/useProjectForm';
import BasicInformationSection from './BasicInformationSection';
import PhasesSection from './PhasesSection';
import { createProject } from '@/api/projects/projectCrud';
import { useAuth } from '@/context/auth';

const NewProjectModal = ({ buttonClassName }: { buttonClassName?: string }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { user } = useAuth();
  
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

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectName.trim()) {
      toast.error(`Error`, {
        description: "Project name is required"
      });
      return;
    }

    if (!user) {
      toast.error(`Error`, {
        description: "You must be logged in to create a project"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get form data as an object
      const projectData = {
        projectName,
        projectDescription,
        projectCategory,
        dueDate,
        isPrivate,
        projectCode,
        budget, // Keep as string to match ProjectFormState
        currency,
        phases
      };
      
      console.log('Creating new project:', projectData);
      
      // Save to Supabase with better error handling
      const projectId = await createProject(projectData, user.id);
      
      if (projectId) {
        toast(`Success`, {
          description: `Project "${projectName}" created successfully`
        });
        
        setIsOpen(false);
        navigate('/projects/' + projectId);
      } else {
        // Error toast already shown in createProject function
        // Just reset the submitting state
      }
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error(`Error`, {
        description: "An unexpected error occurred while creating the project"
      });
    } finally {
      setIsSubmitting(false);
    }
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
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectModal;
