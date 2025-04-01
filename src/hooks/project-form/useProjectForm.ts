
import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/toast-wrapper';
import { ProjectFormState, TeamMember, ProjectTask } from './types';

export const useProjectForm = (initialState?: Partial<ProjectFormState>) => {
  const [formData, setFormData] = useState<ProjectFormState>({
    projectName: initialState?.projectName || '',
    projectDescription: initialState?.projectDescription || '',
    projectCategory: initialState?.projectCategory || 'Development',
    projectType: initialState?.projectType || 'Development',
    dueDate: initialState?.dueDate || '',
    isPrivate: initialState?.isPrivate !== undefined ? initialState.isPrivate : true,
    projectCode: initialState?.projectCode || '',
    budget: initialState?.budget || '0',
    currency: initialState?.currency || 'USD',
    phases: initialState?.phases || [],
    tasks: initialState?.tasks || [],
    teamMembers: initialState?.teamMembers || []
  });

  const updateFormField = useCallback(<K extends keyof ProjectFormState>(
    field: K,
    value: ProjectFormState[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const addTeamMember = useCallback((member: TeamMember) => {
    // Check if this member is already added
    if (formData.teamMembers.some(m => m.id === member.id)) {
      toast({
        title: "Already added",
        description: `${member.name} is already a team member for this project.`,
      });
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, member]
    }));
    
    toast({
      title: "Team member added",
      description: `${member.name} has been added to the project.`,
    });
  }, [formData.teamMembers]);

  const removeTeamMember = useCallback((memberId: string) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter(member => member.id !== memberId)
    }));
  }, []);
  
  const updateTeamMemberRole = useCallback((memberId: string, role: string) => {
    setFormData(prev => {
      const updatedMembers = [...prev.teamMembers];
      const memberIndex = updatedMembers.findIndex(member => member.id === memberId);
      
      if (memberIndex >= 0) {
        updatedMembers[memberIndex] = { ...updatedMembers[memberIndex], role };
        
        // If this member is being made a Project Manager, ensure no one else has that role
        if (role === 'Project Manager') {
          updatedMembers.forEach((member, i) => {
            if (i !== memberIndex && member.role === 'Project Manager') {
              member.role = 'Team Member';
            }
          });
        }
      }
      
      return { ...prev, teamMembers: updatedMembers };
    });
  }, []);

  // Fix task-related functions to use the correct types
  const addTask = useCallback((task: ProjectTask) => {
    // Ensure task has a valid ID
    const taskWithId: ProjectTask = {
      ...task,
      id: task.id || `task-${Date.now()}`
    };
    
    setFormData(prev => ({
      ...prev,
      tasks: [...prev.tasks, taskWithId]
    }));
  }, []);

  const removeTask = useCallback((taskId: string) => {
    setFormData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== taskId)
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      projectName: '',
      projectDescription: '',
      projectCategory: 'Development',
      projectType: 'Development',
      dueDate: '',
      isPrivate: true,
      projectCode: '',
      budget: '0',
      currency: 'USD',
      phases: [],
      tasks: [],
      teamMembers: []
    });
  }, []);

  return {
    formData,
    updateFormField,
    addTeamMember,
    removeTeamMember,
    updateTeamMemberRole,
    addTask,
    removeTask,
    resetForm
  };
};

export default useProjectForm;
