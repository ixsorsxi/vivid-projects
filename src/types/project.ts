
import { Project } from '@/lib/types/project';
import { PriorityLevel } from '@/lib/types/common';

// Ensure ProjectType is compatible with all usages
export type ProjectType = Project & {
  // Add any additional properties needed for ProjectCard component
  members: { id: string; name: string; avatar?: string }[];
  priority: PriorityLevel;
};
