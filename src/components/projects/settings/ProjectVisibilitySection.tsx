
import React from 'react';
import { Button } from "@/components/ui/button";

interface ProjectVisibilityProps {
  visibility: string;
  onVisibilityChange: (value: string) => void;
}

const ProjectVisibilitySection: React.FC<ProjectVisibilityProps> = ({
  visibility,
  onVisibilityChange
}) => {
  return (
    <div className="border-b pb-4">
      <h3 className="font-medium mb-2">Project Visibility</h3>
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
  );
};

export default ProjectVisibilitySection;
