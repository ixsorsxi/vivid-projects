
import { Phase, Milestone, ProjectTask, TeamMember } from '../project-form/types';

export interface ProjectModalState {
  isOpen: boolean;
  isSubmitting: boolean;
  projectName: string;
  projectDescription: string;
  projectCategory: string;
  dueDate: string;
  isPrivate: boolean;
  projectCode: string;
  budget: string;
  currency: string;
  phases: Phase[];
  tasks: ProjectTask[];
  teamMembers: TeamMember[];
}
