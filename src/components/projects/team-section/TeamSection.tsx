
import React, { useState, useEffect } from 'react';
import { TeamMember } from '@/lib/types/common';
import { Card, CardContent } from '@/components/ui/card';
import TeamCardHeader from './components/TeamCardHeader';
import TeamAccessDenied from './components/TeamAccessDenied';
import TeamLoadingState from './components/TeamLoadingState';
import TeamMembersList from './components/TeamMembersList';

interface TeamSectionProps {
  projectId: string;
  members?: TeamMember[];
  onAddMember?: () => void;
  hasAccess?: boolean;
}

const TeamSection: React.FC<TeamSectionProps> = ({
  projectId,
  members = [],
  onAddMember,
  hasAccess = false
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleRefresh = () => {
    setIsRetrying(true);
    setHasError(false);
    
    // Simulate refreshing data
    setTimeout(() => {
      setIsRetrying(false);
    }, 1500);
  };
  
  const handleCheckAccessAgain = () => {
    setIsLoading(true);
    
    // Simulate checking access again
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Card>
      <TeamCardHeader 
        onAddMember={onAddMember || (() => {})}
        onRefresh={handleRefresh}
        isLoading={isLoading}
        isRetrying={isRetrying}
        hasAccess={hasAccess}
      />
      
      <CardContent>
        <TeamLoadingState 
          isLoading={isLoading}
          hasError={hasError}
          errorMessage={errorMessage}
          onRetry={handleRefresh}
        />
        
        {!isLoading && !hasError && !hasAccess && (
          <TeamAccessDenied onCheckAccessAgain={handleCheckAccessAgain} />
        )}
        
        {!isLoading && !hasError && hasAccess && (
          <TeamMembersList members={members} projectId={projectId} />
        )}
      </CardContent>
    </Card>
  );
};

export default TeamSection;
