
import React from 'react';
import PageContainer from '@/components/PageContainer';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import TasksList from '@/components/dashboard/TasksList';
import { useAuth } from '@/context/auth';
import { demoProjects, demoTasks } from '@/lib/data';
import DashboardStatsCards from '@/components/dashboard/DashboardStatsCards';
import DashboardProjects from '@/components/dashboard/DashboardProjects';
import FadeIn from '@/components/animations/FadeIn';

const Dashboard = () => {
  const { user } = useAuth();
  
  // Sort projects by due date (most recent first)
  const sortedProjects = [...demoProjects].sort((a, b) => 
    new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );
  
  // Get the most recent projects (first 3)
  const recentProjects = sortedProjects.slice(0, 3);
  
  // Filter tasks by different statuses
  const activeProjects = demoProjects.filter(p => p.status === 'in-progress');
  const completedProjects = demoProjects.filter(p => p.status === 'completed');
  
  // Get tasks that are not completed for the dashboard
  const pendingTasks = demoTasks.filter(task => !task.completed);
  const completedTasks = demoTasks.filter(task => task.completed);

  return (
    <PageContainer title="Dashboard">
      <div className="space-y-8">
        <DashboardHeader />
        
        <FadeIn duration={800} delay={200}>
          <DashboardStatsCards 
            activeProjects={activeProjects}
            completedTasks={completedTasks}
          />
        </FadeIn>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <FadeIn duration={800} delay={300} className="lg:col-span-2">
            <DashboardProjects
              recentProjects={recentProjects}
              activeProjects={activeProjects}
              completedProjects={completedProjects}
            />
          </FadeIn>
          
          <FadeIn duration={800} delay={400} className="lg:col-span-1">
            <TasksList tasks={pendingTasks} />
          </FadeIn>
        </div>
      </div>
    </PageContainer>
  );
};

export default Dashboard;
