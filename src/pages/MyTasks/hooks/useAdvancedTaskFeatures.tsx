
import React, { useState, useEffect } from 'react';
import { Task, Assignee, DependencyType } from '@/lib/data';
import { toast } from '@/components/ui/toast-wrapper';
import { 
  addTaskDependency, 
  removeTaskDependency, 
  addTaskSubtask, 
  toggleSubtaskCompletion, 
  deleteSubtask,
  fetchAvailableUsers
} from '@/api/tasks';

const useAdvancedTaskFeatures = (
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
) => {
  const [availableUsers, setAvailableUsers] = useState<Assignee[]>([]);

  // Fetch available users when the component mounts
  useEffect(() => {
    const loadUsers = async () => {
      const users = await fetchAvailableUsers();
      setAvailableUsers(users);
    };
    
    loadUsers();
  }, []);

  // Handle adding a dependency
  const handleAddDependency = async (taskId: string, dependencyTaskId: string, dependencyType: DependencyType) => {
    // Add dependency in the database
    const success = await addTaskDependency(taskId, dependencyTaskId, dependencyType);
    
    if (success) {
      // Update state
      setTasks(prevTasks => {
        return prevTasks.map(task => {
          if (task.id === taskId) {
            // Create or update dependencies array
            const dependencies = task.dependencies || [];
            // Only add if it doesn't already exist
            if (!dependencies.some(dep => dep.taskId === dependencyTaskId)) {
              return {
                ...task,
                dependencies: [...dependencies, { taskId: dependencyTaskId, type: dependencyType }]
              };
            }
          }
          return task;
        });
      });
      
      toast("Dependency added", {
        description: "Task dependency has been created",
      });
      
      return true;
    }
    
    return false;
  };
  
  // Handle removing a dependency
  const handleRemoveDependency = async (taskId: string, dependencyTaskId: string) => {
    // Remove dependency from the database
    const success = await removeTaskDependency(taskId, dependencyTaskId);
    
    if (success) {
      // Update state
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
      
      return true;
    }
    
    return false;
  };
  
  // Handle adding a subtask
  const handleAddSubtask = async (parentId: string, title: string) => {
    // Add subtask to the database
    const success = await addTaskSubtask(parentId, title);
    
    if (success) {
      // Refresh tasks to get updated data
      // In a more sophisticated implementation, we would return the new subtask
      // and update the state more precisely
      
      // For now, we'll create a temporary ID and update the state
      const tempId = `temp-${Date.now()}`;
      setTasks(prevTasks => {
        return prevTasks.map(task => {
          if (task.id === parentId) {
            const subtasks = task.subtasks || [];
            const newSubtask = {
              id: tempId,
              title,
              status: 'to-do',
              priority: 'medium',
              dueDate: task.dueDate,
              project: task.project,
              assignees: [],
              completed: false,
              parentId
            };
            
            return {
              ...task,
              subtasks: [...subtasks, newSubtask]
            };
          }
          return task;
        });
      });
      
      toast("Subtask added", {
        description: `"${title}" has been added as a subtask`,
      });
      
      return true;
    }
    
    return false;
  };
  
  // Handle toggling a subtask's completion status
  const handleToggleSubtask = async (subtaskId: string) => {
    // Toggle subtask completion in the database
    const success = await toggleSubtaskCompletion(subtaskId);
    
    if (success) {
      // Update state
      setTasks(prevTasks => {
        return prevTasks.map(task => {
          if (task.subtasks) {
            const updatedSubtasks = task.subtasks.map(subtask => {
              if (subtask.id === subtaskId) {
                return {
                  ...subtask,
                  status: subtask.status === 'completed' ? 'to-do' : 'completed',
                  completed: !subtask.completed
                };
              }
              return subtask;
            });
            
            return {
              ...task,
              subtasks: updatedSubtasks
            };
          }
          return task;
        });
      });
      
      return true;
    }
    
    return false;
  };
  
  // Handle deleting a subtask
  const handleDeleteSubtask = async (subtaskId: string) => {
    // Delete subtask from the database
    const success = await deleteSubtask(subtaskId);
    
    if (success) {
      // Update state
      setTasks(prevTasks => {
        return prevTasks.map(task => {
          if (task.subtasks) {
            return {
              ...task,
              subtasks: task.subtasks.filter(subtask => subtask.id !== subtaskId)
            };
          }
          return task;
        });
      });
      
      toast("Subtask deleted", {
        description: "The subtask has been removed",
      });
      
      return true;
    }
    
    return false;
  };
  
  // Handle adding an assignee to a task
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
  
  // Handle removing an assignee from a task
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
  
  // Handle updating a task's status
  const handleUpdateTaskStatus = (taskId: string, newStatus: string) => {
    const completed = newStatus === 'completed';
    
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

  return {
    handleAddDependency,
    handleRemoveDependency,
    handleAddSubtask,
    handleToggleSubtask,
    handleDeleteSubtask,
    handleAddAssignee,
    handleRemoveAssignee,
    handleUpdateTaskStatus,
    availableUsers
  };
};

export default useAdvancedTaskFeatures;
