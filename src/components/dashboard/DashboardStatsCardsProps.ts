
import { Task } from '@/lib/types/task';
import { Project } from '@/lib/types/project';
import { TeamMember } from '@/lib/types/common';

export interface DashboardStatsCardsProps {
  activeProjects: Project[];
  completedTasks: Task[];
  teamMembers?: TeamMember[];
}
