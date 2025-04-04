
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, RefreshCw, Code, Bug } from 'lucide-react';
import { TeamMember } from '../types';
import TeamGrid from './TeamGrid';
import { enableDebugLogs, disableDebugLogs } from '@/utils/debugLogger';

interface TeamContentProps {
  teamMembers: TeamMember[];
  projectManagerName: string | null;
  isRefreshing: boolean;
  isRemoving: boolean;
  isUpdating: boolean;
  refreshTeamMembers: () => Promise<void>;
  onAddMember: () => void;
  onRemove: (memberId: string) => Promise<boolean>;
  onMakeManager: (memberId: string) => Promise<boolean>;
}

const TeamContent: React.FC<TeamContentProps> = ({
  teamMembers,
  projectManagerName,
  isRefreshing,
  isRemoving,
  isUpdating,
  refreshTeamMembers,
  onAddMember,
  onRemove,
  onMakeManager,
}) => {
  const [debugMode, setDebugMode] = React.useState(false);
  const [showDetails, setShowDetails] = React.useState(false);
  
  const toggleDebugMode = () => {
    if (debugMode) {
      disableDebugLogs();
      setDebugMode(false);
    } else {
      enableDebugLogs();
      setDebugMode(true);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={onAddMember}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Team Member
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={refreshTeamMembers}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
        
        {process.env.NODE_ENV !== 'production' && (
          <div className="flex gap-2">
            <Button
              variant={debugMode ? "destructive" : "outline"}
              size="sm"
              onClick={toggleDebugMode}
            >
              <Code className="h-4 w-4 mr-2" />
              {debugMode ? 'Disable Debug Mode' : 'Enable Debug Mode'}
            </Button>
            
            {debugMode && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
              >
                <Bug className="h-4 w-4 mr-2" />
                {showDetails ? 'Hide Details' : 'Show Details'}
              </Button>
            )}
          </div>
        )}
      </div>

      {showDetails && debugMode && (
        <div className="p-3 bg-gray-100 rounded-md border text-xs font-mono mb-4 whitespace-pre-wrap overflow-auto max-h-40">
          <p>Project ID: {teamMembers[0]?.project_id || 'Unknown'}</p>
          <p>Team Members Count: {teamMembers.length}</p>
          <p>Team Members Data:</p>
          <pre>{JSON.stringify(teamMembers, null, 2)}</pre>
        </div>
      )}

      <TeamGrid
        teamMembers={teamMembers}
        projectManagerName={projectManagerName}
        isRemoving={isRemoving}
        isUpdating={isUpdating}
        onRemove={onRemove}
        onMakeManager={onMakeManager}
      />
    </div>
  );
};

export default TeamContent;
