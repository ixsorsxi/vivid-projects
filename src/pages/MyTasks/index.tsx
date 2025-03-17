
import React from 'react';
import PageContainer from '@/components/PageContainer';
import FadeIn from '@/components/animations/FadeIn';
import TaskPageContent from './components/TaskPageContent';
import { useAuth } from '@/context/auth';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const MyTasks = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <PageContainer 
      title="My Tasks" 
      subtitle="Manage and track tasks assigned to you"
    >
      <div className="space-y-6">
        {!isAuthenticated && (
          <Alert variant="warning" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Required</AlertTitle>
            <AlertDescription>
              You're using the app in demo mode. Sign in to save your tasks and access all features.
            </AlertDescription>
          </Alert>
        )}
        
        <FadeIn duration={800} delay={100}>
          <TaskPageContent />
        </FadeIn>
      </div>
    </PageContainer>
  );
};

export default MyTasks;
