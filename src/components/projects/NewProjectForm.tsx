
import React from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import BasicInformationSection from './BasicInformationSection';
import PhasesSection from './PhasesSection';
import TasksSection from './TasksSection';
import { Phase, Milestone, ProjectTask } from '@/hooks/project-form/types';

interface NewProjectFormProps {
  isSubmitting: boolean;
  projectName: string;
  setProjectName: (value: string) => void;
  projectDescription: string;
  setProjectDescription: (value: string) => void;
  projectCategory: string;
  setProjectCategory: (value: string) => void;
  dueDate: string;
  setDueDate: (value: string) => void;
  isPrivate: boolean;
  setIsPrivate: (value: boolean) => void;
  projectCode: string;
  budget: string;
  setBudget: (value: string) => void;
  currency: string;
  setCurrency: (value: string) => void;
  phases: Phase[];
  addPhase: () => void;
  updatePhase: (phaseId: string, field: keyof Phase, value: string) => void;
  removePhase: (phaseId: string) => void;
  addMilestone: (phaseId: string) => void;
  updateMilestone: (phaseId: string, milestoneId: string, field: keyof Milestone, value: string) => void;
  removeMilestone: (phaseId: string, milestoneId: string) => void;
  tasks: ProjectTask[];
  addTask: (task: ProjectTask) => void;
  updateTask: (taskId: string, field: keyof ProjectTask, value: string) => void;
  removeTask: (taskId: string) => void;
  handleCreateProject: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
}

const NewProjectForm: React.FC<NewProjectFormProps> = ({
  isSubmitting,
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
  addPhase,
  updatePhase,
  removePhase,
  addMilestone,
  updateMilestone,
  removeMilestone,
  tasks,
  addTask,
  updateTask,
  removeTask,
  handleCreateProject,
  onCancel
}) => {
  // Create Promise-returning wrapper functions for TasksSection compatibility
  const handleAddTask = async (task: ProjectTask) => {
    addTask(task);
    return task; // Return the task to fulfill Promise<any> return type
  };
  
  const handleUpdateTask = async (taskId: string, field: keyof ProjectTask, value: string) => {
    updateTask(taskId, field, value);
    // Return Promise<void>
  };
  
  const handleRemoveTask = async (taskId: string) => {
    removeTask(taskId);
    // Return Promise<void>
  };

  return (
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
      
      <TasksSection
        tasks={tasks}
        addTask={handleAddTask}
        updateTask={handleUpdateTask}
        removeTask={handleRemoveTask}
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
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
};

export default NewProjectForm;
