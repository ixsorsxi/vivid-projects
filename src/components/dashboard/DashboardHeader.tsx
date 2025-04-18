
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import NewProjectModal from '../projects/NewProjectModal';

interface DashboardHeaderProps {
  title?: string;
  description?: string;
  onCreateProject?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title = "Dashboard",
  description = "Welcome to your project management dashboard.",
  onCreateProject
}) => {
  const navigate = useNavigate();
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  const handleProjectCreated = (projectId: string) => {
    // Navigate to the new project
    navigate(`/projects/${projectId}`);
    
    // Also call the parent's onCreateProject if provided
    if (onCreateProject) {
      onCreateProject();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 pt-2 border-b mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>
      
      <div className="mt-4 sm:mt-0">
        <Button 
          onClick={() => setIsNewProjectModalOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          New Project
        </Button>
      </div>
      
      <NewProjectModal 
        open={isNewProjectModalOpen}
        onOpenChange={setIsNewProjectModalOpen}
        onCreateProject={handleProjectCreated}
      />
    </div>
  );
};

export default DashboardHeader;
