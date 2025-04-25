
import React from 'react';
import StatsCard from './stats/StatsCard';
import TeamMembersList from './stats/TeamMembersList';
import { extractTeamMembers, ensureProjectStatus } from './utils/teamMembersUtils';
import { Project } from '@/lib/types/project';
import { TeamMember } from '@/lib/types/common';

interface DashboardStatsCardsProps {
  activeProjects: any[];
  completedTasks: any[];
}

const DashboardStatsCards: React.FC<DashboardStatsCardsProps> = ({
  activeProjects,
  completedTasks
}) => {
  // Calculate percentages and changes
  const activeProjectsPercentage = Math.round((activeProjects.length / Math.max(activeProjects.length, 5)) * 100);
  const completedTasksPercentage = Math.round((completedTasks.length / Math.max(completedTasks.length, 10)) * 100);
  
  // Type-safe extraction of team members
  const projects = activeProjects as Project[];
  const teamMembers = extractTeamMembers(projects);
  
  // Convert TeamMember[] to string[] for the TeamMembersList component
  const teamMemberNames = teamMembers.map(member => member.name || 'Unknown');
  
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatsCard
        title="Active Projects"
        count={activeProjects.length}
        total={Math.max(activeProjects.length, 5)}
        percentage={activeProjectsPercentage}
        badgeText={`${activeProjects.length} Projects`}
        badgeColorClass="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
      />
      
      <StatsCard
        title="Completed Tasks"
        count={completedTasks.length}
        total={Math.max(completedTasks.length, 10)}
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
        <TeamMembersList teamMembers={teamMemberNames} />
      </StatsCard>
    </div>
  );
};

export default DashboardStatsCards;
