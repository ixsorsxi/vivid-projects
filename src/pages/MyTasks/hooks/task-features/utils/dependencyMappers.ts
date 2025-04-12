
import { TaskDependency } from '@/lib/types/task';

/**
 * Maps API dependency data to the Task dependency format
 */
export const mapApiDependenciesToTaskDependencies = (apiDependencies: any[]): TaskDependency[] => {
  return apiDependencies.map(dep => ({
    taskId: dep.dependency_task_id,
    type: dep.dependency_type
  }));
};
