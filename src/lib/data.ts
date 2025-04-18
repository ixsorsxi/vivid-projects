
// Re-export types from type definitions for components to use
import { Task, TaskStatus, TaskPriority, Subtask } from './types/task';
import { Assignee, TeamMember, PriorityLevel, DependencyType } from './types/common';
import { Project, ProjectMilestone, ProjectRisk, ProjectFinancial } from './types/project';

// Export all types
export type {
  Task,
  TaskStatus,
  TaskPriority,
  Assignee,
  TeamMember,
  PriorityLevel,
  DependencyType,
  Subtask,
  Project,
  ProjectMilestone,
  ProjectRisk,
  ProjectFinancial
};

// Export sample data or utility functions if needed
export const PRIORITY_OPTIONS = ['low', 'medium', 'high', 'urgent'];
export const STATUS_OPTIONS = ['to-do', 'in-progress', 'in-review', 'done'];
