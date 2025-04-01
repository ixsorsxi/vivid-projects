
// Define all types used in project form management
export interface Milestone {
  id: string;
  name: string;
  dueDate: string;
}

export interface Phase {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  milestones: Milestone[];
}

export interface ProjectTask {
  id?: string;
  title: string;
  description?: string;
  dueDate?: string;
  status?: string;
  priority?: string;
}

export interface TeamMember {
  id?: string;
  name: string;
  role?: string;
  email?: string;
}

export interface ProjectFormState {
  projectName: string;
  projectDescription: string;
  projectCategory: string;
  projectType: string;
  dueDate: string;
  isPrivate: boolean;
  projectCode: string;
  budget: string;
  currency: string;
  phases: Phase[];
  tasks: ProjectTask[];
  teamMembers: TeamMember[];
}
