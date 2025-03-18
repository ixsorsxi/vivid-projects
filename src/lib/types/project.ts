
import { PriorityLevel, ProjectStatus, TeamMember } from './common';

export interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  status: ProjectStatus;
  dueDate: string;
  priority: PriorityLevel;
  members?: { name: string; avatar?: string }[];
  team?: TeamMember[];
  category?: string;
  tasks?: { total: number; completed: number };
}
