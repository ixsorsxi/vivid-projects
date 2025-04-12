
import React from 'react';
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";

interface TeamHeaderProps {
  onAddMember: () => void;
}

const TeamHeader: React.FC<TeamHeaderProps> = ({ onAddMember }) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle>Project Team</CardTitle>
      <Button 
        onClick={onAddMember}
        size="sm"
        className="flex items-center gap-1"
      >
        <UserPlus className="h-4 w-4" />
        Add Member
      </Button>
    </CardHeader>
  );
};

export default TeamHeader;
