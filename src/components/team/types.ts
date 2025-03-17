
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  tasks: number;
  tasksCompleted: number;
  status: 'active' | 'inactive';
  availability: string;
  location: string;
  department: string;
  joinedDate: string;
}

export interface Department {
  name: string;
  members: number;
  lead: string;
}
