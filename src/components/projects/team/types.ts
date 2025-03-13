
export interface TeamMember {
  id: number;
  name: string;
  role: string;
}

export interface SystemUser {
  id: number;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
}
