
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { User } from 'lucide-react';
import ProjectTitle from './ProjectTitle';
import ProjectStatusActions from './ProjectStatusActions';
import AddMemberDialog from '../team/add-member';

interface ProjectHeaderProps {
  projectName: string;
  projectStatus: string;
  projectDescription: string;
  onStatusChange?: (newStatus: string) => void;
  onAddMember?: (email: string) => void;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  projectName,
  projectStatus,
  projectDescription,
  onStatusChange,
  onAddMember
}) => {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <ProjectTitle 
          projectName={projectName}
          projectStatus={projectStatus}
          projectDescription={projectDescription}
        />
        
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <Button variant="outline" size="sm" onClick={() => setIsAddMemberOpen(true)}>
            <User className="mr-2 h-4 w-4" />
            Add Member
          </Button>
          <ProjectStatusActions 
            projectStatus={projectStatus}
            onStatusChange={onStatusChange}
          />
        </div>
      </div>

      <AddMemberDialog
        open={isAddMemberOpen}
        onOpenChange={setIsAddMemberOpen}
        onAddMember={onAddMember}
      />
    </>
  );
};

export default ProjectHeader;
