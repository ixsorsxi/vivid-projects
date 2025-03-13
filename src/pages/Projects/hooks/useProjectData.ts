
import { useState, useEffect, useCallback } from 'react';
import { demoTasks } from '@/lib/data';
import { toast } from '@/components/ui/toast-wrapper';

export const useProjectData = (projectId: string | undefined) => {
  // Format the project name
  const projectName = projectId?.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  
  // Add state for project data
  const [projectData, setProjectData] = useState({
    name: projectName,
    description: "This is a sample project description that explains the goals and objectives of this project.",
    status: "in-progress" as 'not-started' | 'in-progress' | 'on-hold' | 'completed',
    dueDate: "2025-05-15",
    category: "Development",
    progress: 35,
    tasks: {
      total: 24,
      completed: 8,
      inProgress: 12,
      notStarted: 4
    },
    team: [
      { id: 1, name: "John Doe", role: "Project Manager" },
      { id: 2, name: "Jane Smith", role: "Lead Developer" },
      { id: 3, name: "Mike Johnson", role: "Designer" },
      { id: 4, name: "Sarah Williams", role: "QA Engineer" }
    ]
  });

  // Add state for tasks
  const [projectTasks, setProjectTasks] = useState(
    demoTasks.filter(task => task.project === projectData.name)
  );

  // Handler to update project status
  const handleStatusChange = useCallback((newStatus: string) => {
    setProjectData(prev => ({
      ...prev,
      status: newStatus as 'not-started' | 'in-progress' | 'on-hold' | 'completed'
    }));

    toast(`Project status updated`, {
      description: `Project has been marked as ${newStatus === 'completed' ? 'complete' : newStatus.replace('-', ' ')}`,
    });
  }, []);

  // Handler to add members to the team
  const handleAddMember = useCallback((email: string, role?: string) => {
    // Check if member with this email already exists
    const memberName = email.split('@')[0];
    const memberExists = projectData.team.some(member => 
      member.name.toLowerCase() === memberName.toLowerCase()
    );
    
    if (memberExists) {
      toast.error(`Member already exists`, {
        description: "This team member is already part of the project",
      });
      return;
    }
    
    const newMember = {
      id: Date.now(),
      name: memberName,
      role: role || "Team Member"
    };

    setProjectData(prev => ({
      ...prev,
      team: [...prev.team, newMember]
    }));

    toast(`Team member added`, {
      description: `Invitation sent to ${email}`,
    });
  }, [projectData.team]);

  // Handler to remove team members
  const handleRemoveMember = useCallback((memberId: number) => {
    setProjectData(prev => ({
      ...prev,
      team: prev.team.filter(member => member.id !== memberId)
    }));

    toast(`Team member removed`, {
      description: "The team member has been removed from this project",
    });
  }, []);

  // Handler to add a new task
  const handleAddTask = useCallback((task: any) => {
    const newTask = {
      id: `task-${Date.now()}`,
      ...task,
      assignees: task.assignees || [],
      completed: task.status === 'completed'
    };

    setProjectTasks(prev => [...prev, newTask]);
    
    // Update project task counts
    updateTaskCounts();

    toast(`Task created`, {
      description: "New task has been added to the project",
    });
  }, []);

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
  }, [projectTasks]);

  // Initialize project tasks based on project name
  useEffect(() => {
    if (projectName) {
      setProjectTasks(demoTasks.filter(task => 
        task.project.toLowerCase() === projectName.toLowerCase()
      ));
    }
  }, [projectName]);

  return {
    projectData,
    projectTasks,
    handleStatusChange,
    handleAddMember,
    handleRemoveMember,
    handleAddTask,
    handleUpdateTaskStatus,
    handleDeleteTask
  };
};
