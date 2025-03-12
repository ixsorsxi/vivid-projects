
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

  const generateProjectCode = () => {
    const random = Math.floor(1000 + Math.random() * 9000);
    setProjectCode(`PRJ-${random}`);
  };

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

  const resetForm = () => {
    setProjectName('');
    setProjectDescription('');
    setProjectCategory('');
    setDueDate('');
    setIsPrivate(false);
    setBudget('');
    setCurrency('USD');
    setPhases([]);
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
    generateProjectCode,
    addPhase,
    updatePhase,
    removePhase,
    addMilestone,
    updateMilestone,
    removeMilestone,
    resetForm
  };
};
