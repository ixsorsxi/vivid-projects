
export interface TeamMember {
  id: number | string;
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
