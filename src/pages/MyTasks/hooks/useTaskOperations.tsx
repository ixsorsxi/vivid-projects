
import React, { useEffect } from 'react';
import { Task } from '@/lib/data';
import { toast } from '@/components/ui/toast-wrapper';
import { 
  fetchUserTasks, 
  createTask, 
  updateTask, 
  deleteTask, 
  toggleTaskStatus 
} from '@/api/supabaseTasksApi';
import { useAuth } from '@/context/auth';

export const useTaskOperations = (initialTasks: Task[] = []) => {
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks);
  const [isLoading, setIsLoading] = React.useState(true);
  const { isAuthenticated } = useAuth();

  const fetchTasks = async () => {
    if (!isAuthenticated) {
      setTasks(initialTasks);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const fetchedTasks = await fetchUserTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [isAuthenticated]);

  const handleToggleStatus = async (taskId: string) => {
    try {
      if (!isAuthenticated) {
        // Offline mode fallback
        const updatedTasks = tasks.map(task => {
          if (task.id === taskId) {
            const newStatus = task.status === 'completed' ? 'in-progress' : 'completed';
            const newCompleted = newStatus === 'completed';
            
            toast(`Task ${newCompleted ? 'completed' : 'reopened'}`, {
              description: `"${task.title}" has been ${newCompleted ? 'marked as complete' : 'reopened'}`,
            });
            
            return {
              ...task,
              status: newStatus,
              completed: newCompleted
            };
          }
          return task;
        });
        
        setTasks(updatedTasks);
        return updatedTasks.find(task => task.id === taskId) || null;
      }

      // Online mode
      const task = tasks.find(t => t.id === taskId);
      if (!task) return null;
      
      const updatedTask = await toggleTaskStatus(taskId, !task.completed);
      if (updatedTask) {
        setTasks(prevTasks => 
          prevTasks.map(task => task.id === taskId ? updatedTask : task)
        );
        
        toast(`Task ${updatedTask.completed ? 'completed' : 'reopened'}`, {
          description: `"${updatedTask.title}" has been ${updatedTask.completed ? 'marked as complete' : 'reopened'}`,
        });
        
        return updatedTask;
      }
      return null;
    } catch (error) {
      console.error('Error toggling task status:', error);
      toast.error('Failed to update task status');
      return null;
    }
  };

  const handleAddTask = async (newTaskData: Partial<Task>) => {
    try {
      if (!isAuthenticated) {
        // Offline mode fallback
        const taskId = `task-${Date.now()}`;
        const task: Task = {
          id: taskId,
          title: newTaskData.title || 'Untitled Task',
          description: newTaskData.description || '',
          status: newTaskData.status || 'to-do',
          priority: newTaskData.priority || 'medium',
          dueDate: newTaskData.dueDate || new Date().toISOString(),
          completed: newTaskData.completed || false,
          project: newTaskData.project || 'Personal Tasks',
          assignees: newTaskData.assignees || [{ name: 'Me' }]
        };
        
        setTasks(prevTasks => [...prevTasks, task]);
        
        toast("Task added", {
          description: `"${task.title}" has been added to your tasks`,
        });
        
        return task;
      }

      // Online mode - make sure we have a required title
      if (!newTaskData.title) {
        newTaskData.title = 'Untitled Task';
      }
      
      const taskToCreate = {
        title: newTaskData.title,
        description: newTaskData.description || '',
        status: newTaskData.status || 'to-do',
        priority: newTaskData.priority || 'medium',
        dueDate: newTaskData.dueDate || new Date().toISOString(),
        completed: newTaskData.completed || false,
        project: newTaskData.project || 'Personal Tasks',
        assignees: newTaskData.assignees || [{ name: 'Me' }]
      } as Omit<Task, 'id'>;
      
      const newTask = await createTask(taskToCreate);
      if (newTask) {
        setTasks(prevTasks => [...prevTasks, newTask]);
        
        toast("Task added", {
          description: `"${newTask.title}" has been added to your tasks`,
        });
        
        return newTask;
      }
      return null;
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task');
      return null;
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      if (!isAuthenticated) {
        // Offline mode fallback
        setTasks(prevTasks => 
          prevTasks.map(task => {
            if (task.id === updatedTask.id) {
              toast("Task updated", {
                description: `"${updatedTask.title}" has been updated`,
              });
              
              return updatedTask;
            }
            return task;
          })
        );
        
        return updatedTask;
      }

      // Online mode
      const result = await updateTask(updatedTask.id, updatedTask);
      if (result) {
        setTasks(prevTasks => 
          prevTasks.map(task => task.id === result.id ? result : task)
        );
        
        toast("Task updated", {
          description: `"${result.title}" has been updated`,
        });
        
        return result;
      }
      return null;
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
      return null;
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const taskToDelete = tasks.find(task => task.id === taskId);
      if (!taskToDelete) return null;
      
      if (!isAuthenticated) {
        // Offline mode fallback
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        
        toast("Task deleted", {
          description: `"${taskToDelete.title}" has been removed from your tasks`,
        });
        
        return taskToDelete;
      }

      // Online mode
      const success = await deleteTask(taskId);
      if (success) {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        
        toast("Task deleted", {
          description: `"${taskToDelete.title}" has been removed from your tasks`,
        });
        
        return taskToDelete;
      }
      return null;
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
      return null;
    }
  };

  return {
    tasks,
    setTasks,
    isLoading,
    handleToggleStatus,
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask,
    refetchTasks: fetchTasks
  };
};
