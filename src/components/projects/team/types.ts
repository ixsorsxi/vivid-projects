
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email?: string;
  user_id?: string;
  avatar?: string;
}

export interface SystemUser {
  id: string | number;
  name: string;
  email?: string;
  role?: string;
  avatar?: string;
}
