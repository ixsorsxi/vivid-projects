
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { SettingsCard } from "@/pages/Admin/settings/components/SettingsCard";

interface ProjectInformationProps {
  projectName: string;
  projectSlug: string;
  category: string;
  onProjectNameChange: (value: string) => void;
  onProjectSlugChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

const ProjectInformationSection: React.FC<ProjectInformationProps> = ({
  projectName,
  projectSlug,
  category,
  onProjectNameChange,
  onProjectSlugChange,
  onCategoryChange
}) => {
  const { toast } = useToast();
  
  const handleSave = () => {
    toast({
      title: "Project information updated",
      description: "Project details have been saved successfully.",
    });
  };
  
  return (
    <SettingsCard 
      title="Project Information"
      onSave={handleSave}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              id="projectName"
              value={projectName}
              onChange={(e) => onProjectNameChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectSlug">Project URL Slug</Label>
            <Input
              id="projectSlug"
              value={projectSlug}
              onChange={(e) => onProjectSlugChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={category}
              onValueChange={onCategoryChange}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Development">Development</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Research">Research</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </SettingsCard>
  );
};

export default ProjectInformationSection;
