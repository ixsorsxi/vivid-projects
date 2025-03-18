
import { PriorityLevel, ProjectStatus, TeamMember } from './common';

export interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  status: ProjectStatus;
  dueDate: string;
  priority: PriorityLevel;
  members?: { id?: string; name: string; avatar?: string }[];
  team?: TeamMember[];
  category?: string;
  tasks?: { total: number; completed: number };
  project?: string; // Added for task compatibility
}
