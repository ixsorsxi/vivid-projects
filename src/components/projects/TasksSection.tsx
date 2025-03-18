
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import TaskForm from "./task-form";
import { TaskFormFields } from "./task-form/TaskFormFields";
import TasksKanbanView from "./components/TasksKanbanView";
import { useTaskForm } from "./task-form/useTaskForm";

export interface TasksSectionProps {
  tasks: any[]; // Task type
  projectId: string;
  teamMembers: any[]; // TeamMember type
  onAddTask: (task: any) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: string) => void;
  onDeleteTask: (taskId: string) => void;
  fullView?: boolean; // Make fullView optional
}

const TasksSection: React.FC<TasksSectionProps> = ({
  tasks,
  projectId,
  teamMembers,
  onAddTask,
  onUpdateTaskStatus,
  onDeleteTask,
  fullView = false // Default to false if not provided
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { formState, handleInputChange, handleSubmit, resetForm } = useTaskForm();
  
  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e, (taskData) => {
      onAddTask({
        ...taskData,
        // Add any project-specific data
        project: projectId
      });
      setIsDialogOpen(false);
      resetForm();
    });
  };
  
  return (
    <div className={`glass-card p-6 rounded-xl ${fullView ? 'h-[calc(100vh-240px)]' : ''}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Create New Task</DialogTitle>
            <TaskForm onSubmit={handleTaskSubmit}>
              <TaskFormFields 
                formState={formState}
                onChange={handleInputChange}
                teamMembers={teamMembers}
              />
            </TaskForm>
          </DialogContent>
        </Dialog>
      </div>
      
      <TasksKanbanView 
        tasks={tasks}
        onStatusChange={onUpdateTaskStatus}
        onDeleteTask={onDeleteTask}
        fullHeight={fullView}
      />
    </div>
  );
};

export default TasksSection;
