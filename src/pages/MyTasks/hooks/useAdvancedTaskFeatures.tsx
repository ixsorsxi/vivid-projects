
import React from 'react';
import { Task, Assignee, DependencyType } from '@/lib/data';
import { toast } from '@/components/ui/toast-wrapper';

export const useAdvancedTaskFeatures = (
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
) => {
  // Handle adding a dependency to a task
  const handleAddDependency = (taskId: string, dependencyTaskId: string, dependencyType: DependencyType) => {
    setTasks(prevTasks => {
      return prevTasks.map(task => {
        if (task.id === taskId) {
          const dependencies = task.dependencies || [];
          return {
            ...task,
            dependencies: [
              ...dependencies,
              { taskId: dependencyTaskId, type: dependencyType }
            ]
          };
        }
        return task;
      });
    });
    
    toast("Dependency added", {
      description: "Task dependency has been created",
    });
  };
  
  // Handle removing a dependency from a task
  const handleRemoveDependency = (taskId: string, dependencyTaskId: string) => {
    setTasks(prevTasks => {
      return prevTasks.map(task => {
        if (task.id === taskId && task.dependencies) {
          return {
            ...task,
            dependencies: task.dependencies.filter(dep => dep.taskId !== dependencyTaskId)
          };
        }
        return task;
      });
    });
    
    toast("Dependency removed", {
      description: "Task dependency has been removed",
    });
  };
  
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
  
  // Add an assignee to a task
  const handleAddAssignee = (taskId: string, assignee: Assignee) => {
    setTasks(prevTasks => {
      return prevTasks.map(task => {
        if (task.id === taskId) {
          // Check if assignee already exists
          if (task.assignees.some(a => a.name === assignee.name)) {
            return task;
          }
          
          return {
            ...task,
            assignees: [...task.assignees, assignee]
          };
        }
        return task;
      });
    });
    
    toast("Assignee added", {
      description: `${assignee.name} has been assigned to the task`,
    });
  };
  
  // Remove an assignee from a task
  const handleRemoveAssignee = (taskId: string, assigneeName: string) => {
    setTasks(prevTasks => {
      return prevTasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            assignees: task.assignees.filter(a => a.name !== assigneeName)
          };
        }
        return task;
      });
    });
    
    toast("Assignee removed", {
      description: `${assigneeName} has been removed from the task`,
    });
  };
  
  // Check if a task can be completed based on dependencies
  const canCompleteTask = (taskId: string): boolean => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return true;
    
    // Check if it has blocking dependencies
    if (task.dependencies) {
      const blockingDependencies = task.dependencies.filter(dep => dep.type === 'blocking');
      
      for (const dep of blockingDependencies) {
        const dependencyTask = tasks.find(t => t.id === dep.taskId);
        if (dependencyTask && !dependencyTask.completed) {
          return false;
        }
      }
    }
    
    return true;
  };
  
  // Update task status with dependency checking
  const handleUpdateTaskStatus = (taskId: string, newStatus: string) => {
    const completed = newStatus === 'completed';
    
    // Check if this task can be completed
    if (completed && !canCompleteTask(taskId)) {
      toast.error("Cannot complete task", {
        description: "This task has blocking dependencies that are not yet completed",
      });
      return false;
    }
    
    setTasks(prevTasks => {
      return prevTasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            status: newStatus,
            completed
          };
        }
        return task;
      });
    });
    
    return true;
  };
  
  // Get all available users for assignment
  const availableUsers: Assignee[] = [
    { name: 'Jane Smith', avatar: undefined },
    { name: 'John Doe', avatar: undefined },
    { name: 'Robert Johnson', avatar: undefined },
    { name: 'Michael Brown', avatar: undefined },
    { name: 'Emily Davis', avatar: undefined },
    { name: 'Sarah Williams', avatar: undefined }
  ];
  
  return {
    handleAddDependency,
    handleRemoveDependency,
    handleAddSubtask,
    handleToggleSubtask,
    handleDeleteSubtask,
    handleAddAssignee,
    handleRemoveAssignee,
    handleUpdateTaskStatus,
    canCompleteTask,
    availableUsers
  };
};

export default useAdvancedTaskFeatures;
