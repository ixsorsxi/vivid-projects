
import React from 'react';
import { useParams } from 'react-router-dom';
import { demoProjects, demoTasks } from '@/lib/data';
import { PriorityLevel, ProjectStatus } from '@/lib/types/common';
import ProjectDueDate from './overview/ProjectDueDate';
import ProjectTeamInfo from './overview/ProjectTeamInfo';
import ProjectStatusDisplay from './overview/ProjectStatusDisplay';
import ProjectProgressSection from './overview/ProjectProgressSection';
import NoActivityDisplay from './overview/NoActivityDisplay';
import { ensureProjectStatus } from '@/components/dashboard/utils/teamMembersUtils';
import { Project } from '@/lib/types/project';
import { ProjectTask } from '@/hooks/project-form/types';

interface ProjectOverviewProps {
  project: Project;
  tasks: ProjectTask[];
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({ project, tasks }) => {
  // Calculate stats
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const completionRate = tasks.length > 0 
    ? Math.round((completedTasks / tasks.length) * 100) 
    : 0;
  
  // Calculate days remaining
  const dueDate = new Date(project.dueDate);
  const today = new Date();
  const daysRemaining = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  // Check if project has recent activity
  const hasActivity = tasks.length > 0;
  
  // Get team members from either members or team property with type safety
  const projectMembers = ('members' in project && project.members) 
    ? project.members 
    : (project.team?.map(member => ({ name: member.name })) || []);
  
  // Get member count safely, ensuring there's an array with a length property
  const memberCount = Array.isArray(projectMembers) ? projectMembers.length : 0;
  
  // Ensure status is of correct type
  const projectStatus: ProjectStatus = ensureProjectStatus(project.status);
  
  // Set default priority if not available
  const projectPriority = ('priority' in project && project.priority) 
    ? project.priority as PriorityLevel 
    : 'medium' as PriorityLevel;
  
  return (
    <div className="glass-card p-6 rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Project Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <ProjectDueDate dueDate={project.dueDate} daysRemaining={daysRemaining} />
          <ProjectTeamInfo membersCount={memberCount} />
          <ProjectStatusDisplay status={projectStatus} />
        </div>
        
        <ProjectProgressSection 
          progress={project.progress}
          completionRate={completionRate}
          completedTasks={completedTasks}
          totalTasks={tasks.length}
          priority={projectPriority}
        />
      </div>
      
      {!hasActivity && <NoActivityDisplay />}
    </div>
  );
};

export default ProjectOverview;
