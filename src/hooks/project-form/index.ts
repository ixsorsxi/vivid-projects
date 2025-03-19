
import { useBasicDetails } from './useBasicDetails';
import { usePhaseManagement } from './usePhaseManagement';
import { useTaskManagement } from './useTaskManagement';
import { useTeamManagement } from './useTeamManagement';
import { ProjectFormState } from './types';

// Re-export types
export * from './types';

export const useProjectForm = () => {
  const basicDetails = useBasicDetails();
  const phaseManagement = usePhaseManagement();
  const taskManagement = useTaskManagement();
  const teamManagement = useTeamManagement();

  const resetForm = () => {
    // Reset basic details
    basicDetails.setProjectName('');
    basicDetails.setProjectDescription('');
    basicDetails.setProjectCategory('');
    basicDetails.setDueDate('');
    basicDetails.setIsPrivate(false);
    basicDetails.setBudget('');
    basicDetails.setCurrency('USD');
    
    // Reset phases
    phaseManagement.setPhases([]);
    
    // Reset tasks
    taskManagement.setTasks([]);
    
    // Reset team members
    teamManagement.setTeamMembers([]);
    
    // Generate a new project code
    basicDetails.generateProjectCode();
  };

  return {
    ...basicDetails,
    ...phaseManagement,
    ...taskManagement,
    ...teamManagement,
    resetForm
  };
};
