
export type ProjectStatus = 'not-started' | 'in-progress' | 'on-hold' | 'completed';

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}
