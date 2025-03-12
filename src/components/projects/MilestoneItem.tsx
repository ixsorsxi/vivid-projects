
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, X } from "lucide-react";
import { Milestone } from '@/hooks/useProjectForm';

interface MilestoneItemProps {
  milestone: Milestone;
  phaseId: string;
  updateMilestone: (phaseId: string, milestoneId: string, field: keyof Milestone, value: string) => void;
  removeMilestone: (phaseId: string, milestoneId: string) => void;
}

const MilestoneItem: React.FC<MilestoneItemProps> = ({
  milestone,
  phaseId,
  updateMilestone,
  removeMilestone
}) => {
  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder="Milestone name"
        value={milestone.name}
        onChange={(e) => updateMilestone(phaseId, milestone.id, 'name', e.target.value)}
      />
      <Input
        type="date"
        value={milestone.dueDate}
        onChange={(e) => updateMilestone(phaseId, milestone.id, 'dueDate', e.target.value)}
        prefix={<Calendar className="h-4 w-4 text-muted-foreground" />}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => removeMilestone(phaseId, milestone.id)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default MilestoneItem;
