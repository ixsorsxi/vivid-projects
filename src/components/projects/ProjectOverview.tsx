
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PriorityLevel, ProjectStatus } from '@/lib/types/common';
import ProjectDueDate from './overview/ProjectDueDate';
import ProjectTeamInfo from './overview/ProjectTeamInfo';
import ProjectStatusDisplay from './overview/ProjectStatusDisplay';
import ProjectProgressSection from './overview/ProjectProgressSection';
import ProjectTypeManager from './overview/ProjectTypeManager';
import ProjectFinancials from './overview/ProjectFinancials';
import ProjectPerformanceGauge from './overview/ProjectPerformanceGauge';
import ProjectTimeline from './overview/ProjectTimeline';
import ProjectRisks from './overview/ProjectRisks';
import NoActivityDisplay from './overview/NoActivityDisplay';
import { ensureProjectStatus } from '@/components/dashboard/utils/teamMembersUtils';
import { Project, ProjectMilestone, ProjectRisk, ProjectFinancial } from '@/lib/types/project';
import { ProjectTask } from '@/hooks/project-form/types';
import { fetchProjectMilestones, fetchProjectRisks, fetchProjectFinancials } from '@/api/projects/projectFetch';
import { Loader2 } from 'lucide-react';

interface ProjectOverviewProps {
  project: Project;
  tasks: ProjectTask[];
  milestones?: ProjectMilestone[];
  risks?: ProjectRisk[];
  financials?: ProjectFinancial[];
  projectId?: string;
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({ 
  project, 
  tasks,
  milestones: initialMilestones,
  risks: initialRisks,
  financials: initialFinancials,
  projectId
}) => {
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
    : (project.team?.map(member => ({ name: member.name, role: member.role })) || []);
  
  // Get member count safely, ensuring there's an array with a length property
  const memberCount = Array.isArray(projectMembers) ? projectMembers.length : 0;
  
  // Ensure status is of correct type
  const projectStatus: ProjectStatus = ensureProjectStatus(project.status);
  
  // Set default priority if not available
  const projectPriority = ('priority' in project && project.priority) 
    ? project.priority as PriorityLevel 
    : 'medium' as PriorityLevel;
    
  // Get manager name
  const managerName = project.project_manager_name || 'Not Assigned';
  
  // Fetch project milestones if not provided
  const { data: fetchedMilestones = [], isLoading: milestonesLoading } = useQuery({
    queryKey: ['project-milestones', project.id],
    queryFn: () => fetchProjectMilestones(project.id),
    enabled: !!project.id && !initialMilestones
  });
  
  // Fetch project risks if not provided
  const { data: fetchedRisks = [], isLoading: risksLoading } = useQuery({
    queryKey: ['project-risks', project.id],
    queryFn: () => fetchProjectRisks(project.id),
    enabled: !!project.id && !initialRisks
  });
  
  // Fetch project financials if not provided
  const { data: fetchedFinancials = [], isLoading: financialsLoading } = useQuery({
    queryKey: ['project-financials', project.id],
    queryFn: () => fetchProjectFinancials(project.id),
    enabled: !!project.id && !initialFinancials
  });
  
  // Use provided data or fetched data
  const milestones = initialMilestones || fetchedMilestones;
  const risks = initialRisks || fetchedRisks;
  const financials = initialFinancials || fetchedFinancials;
  
  const isLoading = milestonesLoading || risksLoading || financialsLoading;
  
  if (isLoading) {
    return (
      <div className="glass-card p-6 rounded-xl flex items-center justify-center">
        <div className="text-center p-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading project data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="glass-card p-6 rounded-xl">
      <h2 className="text-xl font-semibold mb-6">Project Overview</h2>
      
      <div className="grid grid-cols-1 gap-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <ProjectTypeManager 
              projectType={project.project_type || 'Development'} 
              managerName={managerName} 
            />
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProjectFinancials 
            estimatedCost={project.estimated_cost || 0} 
            actualCost={project.actual_cost || 0}
            budgetApproved={project.budget_approved || false}
            financials={financials}
            projectId={project.id}
          />
          
          <ProjectPerformanceGauge 
            performanceIndex={project.performance_index || 1.0} 
          />
        </div>
        
        <ProjectTimeline 
          startDate={project.start_date}
          dueDate={project.dueDate}
          milestones={milestones}
          projectId={project.id}
        />
        
        <ProjectRisks 
          risks={risks}
          projectId={project.id}
        />
      </div>
      
      {!hasActivity && <NoActivityDisplay />}
    </div>
  );
};

export default ProjectOverview;
