
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TaskTeamSelectorProps {
  handleChange: (field: string, value: any) => void;
}

const TaskTeamSelector: React.FC<TaskTeamSelectorProps> = ({
  handleChange
}) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label className="text-right">
        Team
      </Label>
      <div className="col-span-3">
        <Select onValueChange={(value) => { 
          // This would typically fetch team members, but for now just add a placeholder
          if (value === 'my-team') {
            handleChange('assignees', [{ name: "Team Member" }]);
          }
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Select team" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="my-team">My Team</SelectItem>
            <SelectItem value="other-team">Other Team</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TaskTeamSelector;
