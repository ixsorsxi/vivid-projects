
import React from 'react';
import PageContainer from '@/components/PageContainer';
import FadeIn from '@/components/animations/FadeIn';
import TaskPageContent from './components/TaskPageContent';
import AuthAlert from './components/AuthAlert';
import { useAuth } from '@/context/auth';

const MyTasks = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <PageContainer 
      title="My Tasks" 
      subtitle="Manage and track tasks assigned to you"
    >
      <div className="space-y-6">
        {!isAuthenticated && <AuthAlert />}
        
        <FadeIn duration={800} delay={100}>
          <TaskPageContent />
        </FadeIn>
      </div>
    </PageContainer>
  );
};

export default MyTasks;
