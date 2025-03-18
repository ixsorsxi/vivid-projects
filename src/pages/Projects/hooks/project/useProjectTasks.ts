
import { useState, useEffect, useCallback } from 'react';
import { demoTasks } from '@/lib/data';
import { toast } from '@/components/ui/toast-wrapper';
import { setProjectData } from './utils';

export const useProjectTasks = (projectName: string | undefined, setProjectData: any) => {
  // Initialize project tasks based on project name
  const [projectTasks, setProjectTasks] = useState(
    demoTasks.filter(task => {
      // Check if task.project exists and matches projectName
      return task.project === projectName || 
        // Fallback to check title.toLowerCase if project doesn't exist
        (task.title && projectName && task.title.toLowerCase().includes(projectName.toLowerCase()));
    })
  );

  // Handler to add a new task
  const handleAddTask = useCallback((task: any) => {
    const newTask = {
      id: `task-${Date.now()}`,
      ...task,
      assignees: task.assignees || [],
      completed: task.status === 'completed',
      project: projectName
    };

    setProjectTasks(prev => [...prev, newTask]);
    
    // Update project task counts
    updateTaskCounts();

    toast(`Task created`, {
      description: "New task has been added to the project",
    });
  }, [projectName]);

  // Handler to update task status
  const handleUpdateTaskStatus = useCallback((taskId: string, newStatus: string) => {
    setProjectTasks(prev => 
      prev.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            status: newStatus,
            completed: newStatus === 'completed'
          };
        }
        return task;
      })
    );
    
    // Update project task counts
    updateTaskCounts();

    toast(`Task updated`, {
      description: `Task status changed to ${newStatus}`,
    });
  }, []);

  // Handler to delete a task
  const handleDeleteTask = useCallback((taskId: string) => {
    setProjectTasks(prev => prev.filter(task => task.id !== taskId));
    
    // Update project task counts
    updateTaskCounts();

    toast(`Task deleted`, {
      description: "Task has been removed from the project",
    });
  }, []);

  // Update task counts
  const updateTaskCounts = useCallback(() => {
    setTimeout(() => {
      const completed = projectTasks.filter(task => task.status === 'completed').length;
      const inProgress = projectTasks.filter(task => task.status === 'in-progress').length;
      const notStarted = projectTasks.filter(task => task.status === 'to-do').length;
      const total = completed + inProgress + notStarted;
      
      // Calculate progress percentage
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      setProjectData(prev => ({
        ...prev,
        progress,
        tasks: {
          total,
          completed,
          inProgress,
          notStarted
        }
      }));
    }, 0);
  }, [projectTasks, setProjectData]);

  // Initialize or update project tasks based on project name changes
  useEffect(() => {
    if (projectName) {
      setProjectTasks(demoTasks.filter(task => 
        task.project?.toLowerCase() === projectName.toLowerCase() ||
        (task.title && task.title.toLowerCase().includes(projectName.toLowerCase()))
      ));
    }
  }, [projectName]);

  return {
    projectTasks,
    handleAddTask,
    handleUpdateTaskStatus,
    handleDeleteTask
  };
};
