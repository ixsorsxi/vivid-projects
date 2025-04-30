
export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  role?: string;
  profile?: {
    full_name?: string;
    avatar_url?: string;
    role?: string;
  };
}
