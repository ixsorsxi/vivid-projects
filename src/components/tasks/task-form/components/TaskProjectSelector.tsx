
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TaskProjectSelectorProps {
  project: string | undefined;
  handleChange: (field: string, value: any) => void;
}

const TaskProjectSelector: React.FC<TaskProjectSelectorProps> = ({
  project,
  handleChange
}) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="project" className="text-right">
        Project
      </Label>
      <Select 
        value={project || ''} 
        onValueChange={(value) => handleChange('project', value)}
      >
        <SelectTrigger className="col-span-3">
          <SelectValue placeholder="Select project" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Project A">Project A</SelectItem>
          <SelectItem value="Project B">Project B</SelectItem>
          <SelectItem value="Personal Tasks">Personal Tasks</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TaskProjectSelector;
