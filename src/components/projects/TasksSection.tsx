
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import TaskForm from "./task-form";
import TaskFormFields from "./task-form/TaskFormFields";
import { Task } from '@/lib/types/task';
import { TeamMember } from '@/components/projects/team/types';
import TasksKanbanView from './components/TasksKanbanView';

export interface TasksSectionProps {
  tasks: Task[]; 
  projectId: string;
  teamMembers: TeamMember[];
  onAddTask: (task: any) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: string) => void;
  onDeleteTask: (taskId: string) => void;
  fullView?: boolean;
}

const TasksSection: React.FC<TasksSectionProps> = ({
  tasks,
  projectId,
  teamMembers,
  onAddTask,
  onUpdateTaskStatus,
  onDeleteTask,
  fullView = false
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0],
    status: 'to-do',
    assignees: []
  });
  
  const handleAddTask = () => {
    onAddTask({
      ...newTask,
      project: projectId
    });
    setIsDialogOpen(false);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      status: 'to-do',
      assignees: []
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
            <TaskForm
              open={isDialogOpen}
              onOpenChange={setIsDialogOpen}
              onAddTask={handleAddTask}
              teamMembers={teamMembers}
              newTask={newTask}
              setNewTask={setNewTask}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <TasksKanbanView 
        tasksByStatus={{
          'not-started': tasks.filter(t => t.status === 'to-do' || t.status === 'not-started'),
          'in-progress': tasks.filter(t => t.status === 'in-progress'),
          'completed': tasks.filter(t => t.status === 'completed')
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e, status) => {
          const taskId = e.dataTransfer.getData('taskId');
          onUpdateTaskStatus(taskId, status);
        }}
        onDragStart={(e, taskId, currentStatus) => {
          e.dataTransfer.setData('taskId', taskId);
          e.dataTransfer.setData('currentStatus', currentStatus);
        }}
        onDeleteTask={onDeleteTask}
        fullHeight={fullView}
      />
    </div>
  );
};

export default TasksSection;
