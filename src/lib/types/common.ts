
export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';
export type StatusType = 'to-do' | 'in-progress' | 'review' | 'completed' | 'blocked';
export type ProjectStatus = 'not-started' | 'in-progress' | 'on-hold' | 'completed';
export type DependencyType = 'blocks' | 'is-blocked-by' | 'relates-to' | 'duplicates' | 'blocking' | 'waiting-on' | 'related';

export interface Assignee {
  id?: string;
  name: string;
  avatar?: string;
}
