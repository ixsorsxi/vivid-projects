
export interface TeamMember {
  id: string | number;
  name: string;
  role: string;
  user_id?: string;
}

export interface SystemUser {
  id: number | string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
}
