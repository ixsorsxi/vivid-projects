// Import required dependencies
import { useState } from 'react';
import { toast } from '@/components/ui/toast-wrapper';

// Define ProjectTask interface matching the expected structure
export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  status?: string;
  dueDate?: string;
  priority?: string;
}

export const useProjectForm = () => {
  // State for each section of the form
  const [basicDetails, setBasicDetails] = useState({
    name: '',
    description: '',
    dueDate: '',
    category: 'Development'
  });
  
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  
  const [team, setTeam] = useState<{ id: string; name: string; role: string; email?: string }[]>([]);

  // Add a new task - fixed to accept ProjectTask type
  const addTask = (task: ProjectTask) => {
    setTasks([...tasks, { ...task, id: `task-${Date.now()}` }]);
    toast('Task Added', {
      description: 'A new task has been added to the project'
    });
  };
  
  // Remove a task - fixed to accept string ID
  const removeTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast('Task Removed', {
      description: 'The task has been removed from the project'
    });
  };
  
  // Handler to update basic details
  const updateBasicDetails = (details: Partial<{ name: string; description: string; dueDate: string; category: string }>) => {
    setBasicDetails(prev => ({ ...prev, ...details }));
  };

  // Handler to add a team member
  const addTeamMember = (member: { id: string; name: string; role: string; email?: string }) => {
    setTeam([...team, member]);
    toast('Team Member Added', {
      description: `${member.name} has been added to the project team`
    });
  };

  // Handler to remove a team member
  const removeTeamMember = (memberId: string) => {
    setTeam(team.filter(member => member.id !== memberId));
    toast('Team Member Removed', {
      description: 'The team member has been removed from the project team'
    });
  };

  return {
    basicDetails,
    setBasicDetails,
    tasks,
    setTasks,
    addTask,
    removeTask,
    team,
    setTeam,
    updateBasicDetails,
    addTeamMember,
    removeTeamMember
  };
};

export default useProjectForm;
