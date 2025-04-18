
export type ProjectStatus = 'not-started' | 'in-progress' | 'on-hold' | 'completed';

export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  role?: 'user' | 'admin' | 'manager';
}

export interface TeamMember {
  id: string;
  name: string;
  role?: string;
  email?: string;
  user_id?: string;
  avatar?: string;
}

export type DependencyType = 
  | 'finish-to-start' 
  | 'start-to-start' 
  | 'finish-to-finish' 
  | 'start-to-finish'
  | 'blocks'
  | 'is-blocked-by'
  | 'relates-to'
  | 'duplicates'
  | 'blocking'
  | 'waiting-on'
  | 'related';

export type Assignee = {
  id: string;
  name: string;
  avatar?: string;
};
