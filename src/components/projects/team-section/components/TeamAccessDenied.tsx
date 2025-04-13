
import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TeamAccessDeniedProps {
  onCheckAccessAgain: () => void;
}

const TeamAccessDenied: React.FC<TeamAccessDeniedProps> = ({ onCheckAccessAgain }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <ShieldAlert className="h-12 w-12 text-destructive mb-4" />
      <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
      <p className="text-muted-foreground mb-4">
        You don't have permission to view team members for this project.
      </p>
      <Button 
        variant="outline" 
        onClick={onCheckAccessAgain}
      >
        Check Access Again
      </Button>
    </div>
  );
};

export default TeamAccessDenied;
