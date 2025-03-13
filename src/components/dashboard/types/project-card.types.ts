
export interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string;
    progress: number;
    status: 'not-started' | 'in-progress' | 'on-hold' | 'completed';
    dueDate: string;
    priority: 'low' | 'medium' | 'high';
    members: { name: string; avatar?: string }[];
  };
  className?: string;
  onClick?: () => void;
}
