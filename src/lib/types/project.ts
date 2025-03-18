
import { PriorityLevel, ProjectStatus } from './common';

export interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  status: ProjectStatus;
  dueDate: string;
  priority: PriorityLevel;
  members?: { name: string }[];
  team?: { id: number; name: string; role: string }[];
}
