
// Common type definitions shared across the application

export type ProjectStatus = 'not-started' | 'in-progress' | 'on-hold' | 'completed';
export type PriorityLevel = 'high' | 'medium' | 'low';
export type DependencyType = 'blocking' | 'waiting-on' | 'related';

export interface Assignee {
  name: string;
  avatar?: string;
}
