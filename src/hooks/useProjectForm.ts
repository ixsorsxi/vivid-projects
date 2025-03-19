
import React, { useState, useEffect } from 'react';

export interface Milestone {
  id: string;
  name: string;
  dueDate: string;
}

export interface Phase {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  milestones: Milestone[];
}

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  priority: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email?: string;
}

export interface ProjectFormState {
  projectName: string;
  projectDescription: string;
  projectCategory: string;
  dueDate: string;
  isPrivate: boolean;
  projectCode: string;
  budget: string;
  currency: string;
  phases: Phase[];
  tasks: ProjectTask[];
  teamMembers: TeamMember[];
}

export const useProjectForm = () => {
  // Basic project details
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectCategory, setProjectCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [projectCode, setProjectCode] = useState('');
  
  // Advanced project details
  const [budget, setBudget] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [phases, setPhases] = useState<Phase[]>([]);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  const generateProjectCode = () => {
    const random = Math.floor(1000 + Math.random() * 9000);
    setProjectCode(`PRJ-${random}`);
  };

  // Phase management
  const addPhase = () => {
    const newPhase: Phase = {
      id: `phase-${phases.length + 1}`,
      name: '',
      startDate: '',
      endDate: '',
      milestones: []
    };
    setPhases([...phases, newPhase]);
  };

  const updatePhase = (phaseId: string, field: keyof Phase, value: string) => {
    const updatedPhases = phases.map(phase => {
      if (phase.id === phaseId) {
        return { ...phase, [field]: value };
      }
      return phase;
    });
    setPhases(updatedPhases);
  };

  const removePhase = (phaseId: string) => {
    setPhases(phases.filter(phase => phase.id !== phaseId));
  };

  // Milestone management
  const addMilestone = (phaseId: string) => {
    const updatedPhases = phases.map(phase => {
      if (phase.id === phaseId) {
        return {
          ...phase,
          milestones: [
            ...phase.milestones,
            {
              id: `milestone-${phase.milestones.length + 1}`,
              name: '',
              dueDate: ''
            }
          ]
        };
      }
      return phase;
    });
    setPhases(updatedPhases);
  };

  const updateMilestone = (phaseId: string, milestoneId: string, field: keyof Milestone, value: string) => {
    const updatedPhases = phases.map(phase => {
      if (phase.id === phaseId) {
        const updatedMilestones = phase.milestones.map(milestone => {
          if (milestone.id === milestoneId) {
            return { ...milestone, [field]: value };
          }
          return milestone;
        });
        return { ...phase, milestones: updatedMilestones };
      }
      return phase;
    });
    setPhases(updatedPhases);
  };

  const removeMilestone = (phaseId: string, milestoneId: string) => {
    const updatedPhases = phases.map(phase => {
      if (phase.id === phaseId) {
        return {
          ...phase,
          milestones: phase.milestones.filter(m => m.id !== milestoneId)
        };
      }
      return phase;
    });
    setPhases(updatedPhases);
  };

  // Task management
  const addTask = () => {
    const newTask: ProjectTask = {
      id: `task-${tasks.length + 1}`,
      title: '',
      description: '',
      dueDate: '',
      status: 'to-do',
      priority: 'medium'
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (taskId: string, field: keyof ProjectTask, value: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, [field]: value };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const removeTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // Team member management
  const addTeamMember = () => {
    const newMember: TeamMember = {
      id: `member-${teamMembers.length + 1}`,
      name: '',
      role: '',
      email: ''
    };
    setTeamMembers([...teamMembers, newMember]);
  };

  const updateTeamMember = (memberId: string, field: keyof TeamMember, value: string) => {
    const updatedMembers = teamMembers.map(member => {
      if (member.id === memberId) {
        return { ...member, [field]: value };
      }
      return member;
    });
    setTeamMembers(updatedMembers);
  };

  const removeTeamMember = (memberId: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== memberId));
  };

  const resetForm = () => {
    setProjectName('');
    setProjectDescription('');
    setProjectCategory('');
    setDueDate('');
    setIsPrivate(false);
    setBudget('');
    setCurrency('USD');
    setPhases([]);
    setTasks([]);
    setTeamMembers([]);
    generateProjectCode();
  };

  return {
    projectName,
    setProjectName,
    projectDescription,
    setProjectDescription,
    projectCategory,
    setProjectCategory,
    dueDate,
    setDueDate,
    isPrivate,
    setIsPrivate,
    projectCode,
    setProjectCode,
    budget,
    setBudget,
    currency,
    setCurrency,
    phases,
    setPhases,
    tasks,
    setTasks,
    teamMembers,
    setTeamMembers,
    generateProjectCode,
    addPhase,
    updatePhase,
    removePhase,
    addMilestone,
    updateMilestone,
    removeMilestone,
    addTask,
    updateTask,
    removeTask,
    addTeamMember,
    updateTeamMember,
    removeTeamMember,
    resetForm
  };
};
