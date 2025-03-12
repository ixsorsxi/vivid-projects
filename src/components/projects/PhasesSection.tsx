
import React from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import PhaseItem from './PhaseItem';
import { Phase, Milestone } from '@/hooks/useProjectForm';

interface PhasesSectionProps {
  phases: Phase[];
  addPhase: () => void;
  updatePhase: (phaseId: string, field: keyof Phase, value: string) => void;
  removePhase: (phaseId: string) => void;
  addMilestone: (phaseId: string) => void;
  updateMilestone: (phaseId: string, milestoneId: string, field: keyof Milestone, value: string) => void;
  removeMilestone: (phaseId: string, milestoneId: string) => void;
}

const PhasesSection: React.FC<PhasesSectionProps> = ({
  phases,
  addPhase,
  updatePhase,
  removePhase,
  addMilestone,
  updateMilestone,
  removeMilestone
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Project Phases</h3>
        <Button type="button" variant="outline" size="sm" onClick={addPhase}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Phase
        </Button>
      </div>
      
      <div className="space-y-4">
        {phases.map((phase, index) => (
          <PhaseItem
            key={phase.id}
            phase={phase}
            index={index}
            updatePhase={updatePhase}
            removePhase={removePhase}
            addMilestone={addMilestone}
            updateMilestone={updateMilestone}
            removeMilestone={removeMilestone}
          />
        ))}
      </div>
    </div>
  );
};

export default PhasesSection;
