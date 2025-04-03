
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
import { PlusCircle } from "lucide-react";
import { useNewProjectModal } from '@/hooks/useNewProjectModal';
import NewProjectForm from './NewProjectForm';

const NewProjectModal = ({ buttonClassName }: { buttonClassName?: string }) => {
  const {
    isOpen,
    setIsOpen,
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
    tasks,
    addPhase,
    updatePhase,
    removePhase,
    addMilestone,
    updateMilestone,
    removeMilestone,
    addTask,
    updateTask,
    removeTask,
    handleCreateProject
  } = useNewProjectModal();

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
        <NewProjectForm
          isSubmitting={isSubmitting}
          projectName={projectName}
          setProjectName={setProjectName}
          projectDescription={projectDescription}
          setProjectDescription={setProjectDescription}
          projectCategory={projectCategory}
          setProjectCategory={setProjectCategory}
          dueDate={dueDate}
          setDueDate={setDueDate}
          isPrivate={isPrivate}
          setIsPrivate={setIsPrivate}
          projectCode={projectCode}
          budget={budget}
          setBudget={setBudget}
          currency={currency}
          setCurrency={setCurrency}
          phases={phases}
          addPhase={addPhase}
          updatePhase={updatePhase}
          removePhase={removePhase}
          addMilestone={addMilestone}
          updateMilestone={updateMilestone}
          removeMilestone={removeMilestone}
          tasks={tasks}
          addTask={addTask}
          updateTask={updateTask}
          removeTask={removeTask}
          handleCreateProject={handleCreateProject}
          onCancel={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectModal;
