
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

interface TeamAccessDeniedProps {
  onCheckAccessAgain: () => void;
}

const TeamAccessDenied: React.FC<TeamAccessDeniedProps> = ({ onCheckAccessAgain }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center">
      <div className="bg-amber-100 p-3 rounded-full">
        <ShieldAlert className="h-8 w-8 text-amber-500" />
      </div>
      <h3 className="text-lg font-semibold">Access Denied</h3>
      <p className="text-muted-foreground max-w-md">
        You don't have permission to view the team for this project. 
        You need to be a project member or owner to access this section.
      </p>
      <Button variant="outline" onClick={onCheckAccessAgain}>
        Check Access Again
      </Button>
    </div>
  );
};

export default TeamAccessDenied;
