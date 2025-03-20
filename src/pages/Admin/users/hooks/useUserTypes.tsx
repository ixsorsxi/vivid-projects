
export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  customRoleId?: string;
  customRoleName?: string;
}
