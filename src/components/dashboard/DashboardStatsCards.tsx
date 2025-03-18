
import React from 'react';
import { demoProjects, demoTasks } from '@/lib/data';

interface DashboardStatsCardsProps {
  activeProjects: any[];
  completedTasks: any[];
}

const DashboardStatsCards: React.FC<DashboardStatsCardsProps> = ({
  activeProjects,
  completedTasks
}) => {
  // Calculate percentages and changes
  const activeProjectsPercentage = Math.round((activeProjects.length / demoProjects.length) * 100);
  const completedTasksPercentage = Math.round((completedTasks.length / demoTasks.length) * 100);
  
  // Get unique team members from both team and members properties
  const teamMembers = Array.from(
    new Set(
      demoProjects.flatMap(project => {
        if (project.members) {
          return project.members.map(member => member.name);
        } else if (project.team) {
          return project.team.map(member => member.name);
        }
        return [];
      })
    )
  );
  
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="glass-card p-5 rounded-xl hover-lift">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-base">Active Projects</h3>
          <span className="rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium px-2.5 py-0.5">
            {activeProjects.length} Projects
          </span>
        </div>
        <p className="text-3xl font-bold mt-2">{activeProjectsPercentage}%</p>
        <p className="text-muted-foreground text-sm mt-1">
          {activeProjects.length} of {demoProjects.length} projects active
        </p>
      </div>
      
      <div className="glass-card p-5 rounded-xl hover-lift">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-base">Completed Tasks</h3>
          <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium px-2.5 py-0.5">
            {completedTasks.length} Tasks
          </span>
        </div>
        <p className="text-3xl font-bold mt-2">{completedTasksPercentage}%</p>
        <p className="text-muted-foreground text-sm mt-1">
          {completedTasks.length} of {demoTasks.length} tasks completed
        </p>
      </div>
      
      <div className="glass-card p-5 rounded-xl hover-lift">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-base">Team Members</h3>
          <span className="rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-medium px-2.5 py-0.5">
            {teamMembers.length} Members
          </span>
        </div>
        <div className="flex -space-x-2 mt-4">
          {teamMembers.slice(0, 5).map((name, index) => (
            <div key={index} className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium ring-2 ring-background">
              {name.charAt(0).toUpperCase()}
            </div>
          ))}
          
          {teamMembers.length > 5 && (
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary text-sm font-medium ring-2 ring-background">
              +{teamMembers.length - 5}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardStatsCards;
