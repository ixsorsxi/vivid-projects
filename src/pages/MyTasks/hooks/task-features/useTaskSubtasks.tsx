
import React from 'react';
import { Task } from '@/lib/data';
import { toast } from '@/components/ui/toast-wrapper';

export const useTaskSubtasks = (
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
) => {
  // Add a subtask to a parent task
  const handleAddSubtask = (parentId: string, subtaskTitle: string) => {
    const subtaskId = `subtask-${Date.now()}`;
    
    // Find the parent task to get its project
    const parentTask = tasks.find(task => task.id === parentId);
    if (!parentTask) return;
    
    const newSubtask: Task = {
      id: subtaskId,
      title: subtaskTitle,
      status: 'to-do',
      priority: 'medium',
      dueDate: parentTask.dueDate,
      project: parentTask.project,
      assignees: [],
      completed: false,
      parentId: parentId
    };
    
    setTasks(prevTasks => {
      return prevTasks.map(task => {
        if (task.id === parentId) {
          const subtasks = task.subtasks || [];
          return {
            ...task,
            subtasks: [...subtasks, newSubtask]
          };
        }
        return task;
      });
    });
    
    toast("Subtask added", {
      description: `Subtask "${subtaskTitle}" has been added`,
    });
  };
  
  // Toggle a subtask's completion status
  const handleToggleSubtask = (subtaskId: string) => {
    setTasks(prevTasks => {
      // Helper function to recursively find and update the subtask
      const updateSubtaskInTask = (task: Task): Task => {
        // Check if this task has the subtask we're looking for
        if (task.subtasks) {
          const subtaskIndex = task.subtasks.findIndex(st => st.id === subtaskId);
          
          if (subtaskIndex >= 0) {
            // Found it, toggle its completed status
            const updatedSubtasks = [...task.subtasks];
            updatedSubtasks[subtaskIndex] = {
              ...updatedSubtasks[subtaskIndex],
              completed: !updatedSubtasks[subtaskIndex].completed,
              status: updatedSubtasks[subtaskIndex].completed ? 'to-do' : 'completed'
            };
            
            return {
              ...task,
              subtasks: updatedSubtasks
            };
          }
          
          // If not found directly, check nested subtasks
          return {
            ...task,
            subtasks: task.subtasks.map(updateSubtaskInTask)
          };
        }
        
        // This task doesn't have subtasks
        return task;
      };
      
      // Check top-level tasks to find the one with our subtask
      const taskWithSubtask = prevTasks.find(t => 
        t.subtasks?.some(st => st.id === subtaskId || st.subtasks?.some(nst => nst.id === subtaskId))
      );
      
      if (taskWithSubtask) {
        return prevTasks.map(task => 
          task.id === taskWithSubtask.id ? updateSubtaskInTask(task) : task
        );
      }
      
      return prevTasks;
    });
    
    toast("Subtask updated", {
      description: "Subtask status has been updated",
    });
  };
  
  // Delete a subtask
  const handleDeleteSubtask = (subtaskId: string) => {
    setTasks(prevTasks => {
      // Helper function to recursively find and remove the subtask
      const removeSubtaskFromTask = (task: Task): Task => {
        if (task.subtasks) {
          // Check if the subtask is a direct child
          const directSubtask = task.subtasks.find(st => st.id === subtaskId);
          
          if (directSubtask) {
            // Found it, remove it
            return {
              ...task,
              subtasks: task.subtasks.filter(st => st.id !== subtaskId)
            };
          }
          
          // If not a direct child, check each subtask recursively
          return {
            ...task,
            subtasks: task.subtasks.map(removeSubtaskFromTask)
          };
        }
        
        // This task doesn't have subtasks
        return task;
      };
      
      // Find the parent task containing our subtask
      const parentTask = prevTasks.find(t => 
        t.subtasks?.some(st => st.id === subtaskId || st.subtasks?.some(nst => nst.id === subtaskId))
      );
      
      if (parentTask) {
        return prevTasks.map(task => 
          task.id === parentTask.id ? removeSubtaskFromTask(task) : task
        );
      }
      
      return prevTasks;
    });
    
    toast("Subtask deleted", {
      description: "Subtask has been removed",
    });
  };

  return {
    handleAddSubtask,
    handleToggleSubtask,
    handleDeleteSubtask
  };
};

export default useTaskSubtasks;
