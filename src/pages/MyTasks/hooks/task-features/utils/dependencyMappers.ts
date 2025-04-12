
import { Task, TaskDependency } from '@/lib/types/task';
import { DependencyType } from '@/lib/types/common';

/**
 * Maps task dependency data from the API to the application's TaskDependency type
 */
export const mapApiDependenciesToTaskDependencies = (
  dependencies: Array<{
    id: string;
    task_id: string;
    dependency_task_id: string;
    dependency_type: string;
  }>
): TaskDependency[] => {
  return dependencies.map(dep => ({
    taskId: dep.dependency_task_id,
    type: dep.dependency_type as DependencyType
  }));
};
