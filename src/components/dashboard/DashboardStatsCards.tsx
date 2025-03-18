
import React from 'react';
import { demoProjects, demoTasks } from '@/lib/data';
import StatsCard from './stats/StatsCard';
import TeamMembersList from './stats/TeamMembersList';
import { extractTeamMembers } from './utils/teamMembersUtils';

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
  const teamMembers = extractTeamMembers(demoProjects);
  
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatsCard
        title="Active Projects"
        count={activeProjects.length}
        total={demoProjects.length}
        percentage={activeProjectsPercentage}
        badgeText={`${activeProjects.length} Projects`}
        badgeColorClass="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
      />
      
      <StatsCard
        title="Completed Tasks"
        count={completedTasks.length}
        total={demoTasks.length}
        percentage={completedTasksPercentage}
        badgeText={`${completedTasks.length} Tasks`}
        badgeColorClass="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
      />
      
      <StatsCard
        title="Team Members"
        count={teamMembers.length}
        percentage={100}
        badgeText={`${teamMembers.length} Members`}
        badgeColorClass="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
      >
        <TeamMembersList teamMembers={teamMembers} />
      </StatsCard>
    </div>
  );
};

export default DashboardStatsCards;
