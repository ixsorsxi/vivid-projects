
import React from 'react';
import { Button } from "@/components/ui/button";
import SettingsCard from "@/pages/Admin/settings/components/SettingsCard";

interface ProjectVisibilityProps {
  visibility: string;
  onVisibilityChange: (value: string) => void;
}

const ProjectVisibilitySection: React.FC<ProjectVisibilityProps> = ({
  visibility,
  onVisibilityChange
}) => {
  return (
    <SettingsCard 
      title="Project Visibility"
      description="Control who can access your project"
      onSave={() => {}}
      footer={
        <div className="w-full">
          <div className="flex items-center gap-4">
            <Button 
              variant={visibility === "private" ? "outline" : "ghost"} 
              size="sm" 
              className={visibility === "private" ? "rounded-full" : "rounded-full"}
              onClick={() => onVisibilityChange("private")}
            >
              Private
            </Button>
            <Button 
              variant={visibility === "public" ? "outline" : "ghost"} 
              size="sm" 
              className={visibility === "public" ? "rounded-full" : "rounded-full"}
              onClick={() => onVisibilityChange("public")}
            >
              Public
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {visibility === "private" 
              ? "Only team members can access this project." 
              : "Anyone with the link can view this project."}
          </p>
        </div>
      }
    />
  );
};

export default ProjectVisibilitySection;
