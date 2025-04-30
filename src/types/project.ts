
import { Project } from '@/lib/types/project';
import { PriorityLevel } from '@/lib/types/common';

// Make ProjectType compatible with Project
export type ProjectType = Project & {
  description: string; // Make description non-optional
  members: { id: string; name: string; avatar?: string }[];
  priority: PriorityLevel;
};
