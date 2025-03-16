
import React from 'react';
import PageContainer from '@/components/PageContainer';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ProjectCard from '@/components/dashboard/ProjectCard';
import TasksList from '@/components/dashboard/TasksList';
import { useAuth } from '@/context/auth';
import { demoTasks } from '@/lib/data';

const Dashboard = () => {
  const { user } = useAuth();
  
  return (
    <PageContainer title="Dashboard">
      <div className="space-y-8">
        <DashboardHeader userName={user?.name || 'User'} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Active Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProjectCard 
                  project={{
                    id: "project-1",
                    name: "Website Redesign", 
                    progress: 65,
                    members: [],
                    description: "Redesign the company website",
                    dueDate: "2023-12-31",
                    status: "in-progress",
                    priority: "high"
                  }}
                />
                <ProjectCard 
                  project={{
                    id: "project-2",
                    name: "Mobile App Development", 
                    progress: 42,
                    members: [],
                    description: "Build a new mobile app",
                    dueDate: "2024-02-28",
                    status: "in-progress",
                    priority: "medium"
                  }}
                />
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
              <div className="bg-card rounded-lg border shadow-sm p-4">
                <p className="text-muted-foreground">Activity data will be integrated with Supabase.</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">My Tasks</h2>
              <TasksList tasks={demoTasks.slice(0, 5)} />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Team Members</h2>
              <div className="bg-card rounded-lg border shadow-sm p-4">
                <p className="text-muted-foreground">Team member data will be integrated with Supabase.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Dashboard;
