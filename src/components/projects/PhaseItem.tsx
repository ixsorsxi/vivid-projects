
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar, Milestone as MilestoneIcon, X } from "lucide-react";
import MilestoneItem from './MilestoneItem';
import { Phase, Milestone } from '@/hooks/useProjectForm';

interface PhaseItemProps {
  phase: Phase;
  index: number;
  updatePhase: (phaseId: string, field: keyof Phase, value: string) => void;
  removePhase: (phaseId: string) => void;
  addMilestone: (phaseId: string) => void;
  updateMilestone: (phaseId: string, milestoneId: string, field: keyof Milestone, value: string) => void;
  removeMilestone: (phaseId: string, milestoneId: string) => void;
}

const PhaseItem: React.FC<PhaseItemProps> = ({
  phase,
  index,
  updatePhase,
  removePhase,
  addMilestone,
  updateMilestone,
  removeMilestone
}) => {
  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Phase {index + 1}</h4>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => removePhase(phase.id)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="Phase name"
          value={phase.name}
          onChange={(e) => updatePhase(phase.id, 'name', e.target.value)}
        />
        <Input
          type="date"
          value={phase.startDate}
          onChange={(e) => updatePhase(phase.id, 'startDate', e.target.value)}
          prefix={<Calendar className="h-4 w-4 text-muted-foreground" />}
        />
        <Input
          type="date"
          value={phase.endDate}
          onChange={(e) => updatePhase(phase.id, 'endDate', e.target.value)}
          prefix={<Calendar className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
      
      {/* Milestones */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Milestones</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => addMilestone(phase.id)}
          >
            <MilestoneIcon className="h-4 w-4 mr-2" />
            Add Milestone
          </Button>
        </div>
        
        <div className="space-y-2">
          {phase.milestones.map((milestone) => (
            <MilestoneItem
              key={milestone.id}
              milestone={milestone}
              phaseId={phase.id}
              updateMilestone={updateMilestone}
              removeMilestone={removeMilestone}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhaseItem;
