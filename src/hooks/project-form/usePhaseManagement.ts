
import { useState } from 'react';
import { Phase, Milestone } from './types';

export const usePhaseManagement = () => {
  const [phases, setPhases] = useState<Phase[]>([]);

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

  return {
    phases,
    setPhases,
    addPhase,
    updatePhase,
    removePhase,
    addMilestone,
    updateMilestone,
    removeMilestone
  };
};
