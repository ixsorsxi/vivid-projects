
export interface ProjectType {
  id: string;
  name: string;
  description: string;
  progress: number;
  status: 'not-started' | 'in-progress' | 'on-hold' | 'completed';
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  members?: { name: string; avatar?: string }[];
  team?: { id: number; name: string; role: string }[];
  category?: string;
  tasks?: { total: number; completed: number };
}
