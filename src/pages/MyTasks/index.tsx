
import React from 'react';
import PageContainer from '@/components/PageContainer';
import FadeIn from '@/components/animations/FadeIn';
import TaskPageContent from './components/TaskPageContent';
import { useAuth } from '@/context/auth';
import { AlertCircle } from 'lucide-react';

const MyTasks = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <PageContainer title="My Tasks" subtitle="Manage and track tasks assigned to you">
      <div className="space-y-6">
        {!isAuthenticated && (
          <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-md mb-6">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800">Authentication Required</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  You're using the app in demo mode. Sign in to save your tasks and access all features.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <FadeIn duration={800} delay={100}>
          <TaskPageContent />
        </FadeIn>
      </div>
    </PageContainer>
  );
};

export default MyTasks;
