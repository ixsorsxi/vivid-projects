import React from 'react';
import { Card } from '@/components/ui/card';
import { TeamMember } from '@/lib/types/common';

interface DashboardStatsCardsProps {
  projects: any[];
  tasks: any[];
  recentActivity: any[];
}

const DashboardStatsCards: React.FC<DashboardStatsCardsProps> = ({ projects, tasks, recentActivity }) => {
  // Calculate total projects and tasks
  const totalProjects = projects.length;
  const totalTasks = tasks.length;

  // Fix the members array construction to create proper TeamMember objects
  const topMembers = projects.reduce((acc, project) => {
    const projectMembers = project.members || [];
    projectMembers.forEach(member => {
      if (typeof member === 'object' && member !== null) {
        // Ensure we're adding objects with proper TeamMember shape
        const memberObj = {
          id: member.id || `member-${Math.random().toString(36).substr(2, 9)}`,
          name: member.name || 'Unknown Member',
          role: member.role || 'member'
        };
        acc.push(memberObj);
      }
    });
    return acc;
  }, [] as TeamMember[]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <h3 className="text-lg font-medium">Total Projects</h3>
        <p className="text-2xl font-bold">{totalProjects}</p>
      </Card>
      <Card>
        <h3 className="text-lg font-medium">Total Tasks</h3>
        <p className="text-2xl font-bold">{totalTasks}</p>
      </Card>
      <Card>
        <h3 className="text-lg font-medium">Top Members</h3>
        <ul>
          {topMembers.map(member => (
            <li key={member.id} className="flex justify-between">
              <span>{member.name}</span>
              <span>{member.role}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default DashboardStatsCards;
