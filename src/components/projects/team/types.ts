
export interface TeamMember {
  id: string | number;
  name: string;
  role: string;
  user_id?: string;
}

export interface SystemUser {
  id: string | number;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
}
