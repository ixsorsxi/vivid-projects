
export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';
export type StatusType = 'to-do' | 'in-progress' | 'review' | 'completed' | 'blocked';
export type DependencyType = 'blocks' | 'is-blocked-by' | 'relates-to' | 'duplicates';

export interface Assignee {
  id?: string;
  name: string;
  avatar?: string;
}
