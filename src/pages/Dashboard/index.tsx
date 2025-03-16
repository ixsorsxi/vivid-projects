
import React from 'react';
import PageContainer from '@/components/PageContainer';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import ProjectCard from '@/components/dashboard/ProjectCard';
import TasksList from '@/components/dashboard/TasksList';
import { useAuth } from '@/context/auth';

const Dashboard = () => {
  const { user } = useAuth();
  
  // Sample data for demonstration
  const tasks = [
    // Task items would go here
  ];

  return (
    <PageContainer title="Dashboard">
      <div className="space-y-8">
        <DashboardHeader />
        
        <section>
          <h2 className="text-2xl font-bold mb-4">Active Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProjectCard 
              project={{
                id: "1",
                name: "Marketing Campaign",
                description: "Q4 marketing campaign planning",
                progress: 75,
                status: "in-progress",
                dueDate: new Date().toISOString(),
                priority: "high",
                members: []
              }}
            />
            <ProjectCard 
              project={{
                id: "2",
                name: "Website Redesign",
                description: "Revamp of the company website",
                progress: 45,
                status: "in-progress",
                dueDate: new Date().toISOString(),
                priority: "medium",
                members: []
              }}
            />
          </div>
        </section>
        
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Recent Tasks</h2>
            <a href="/tasks" className="text-primary hover:underline">
              View all tasks
            </a>
          </div>
          <TasksList tasks={tasks} />
        </section>
      </div>
    </PageContainer>
  );
};

export default Dashboard;
