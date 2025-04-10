
import { useState } from 'react';
import { ProjectStatus } from '@/lib/types/common';
import { toast } from '@/components/ui/toast-wrapper';

export interface ProjectDataState {
  name: string | undefined;
  description: string;
  status: ProjectStatus;
  dueDate: string;
  category: string;
  progress: number;
  priority: 'low' | 'medium' | 'high';
  tasks: {
    total: number;
    completed: number;
    inProgress: number;
    notStarted: number;
  };
  team: {
    id: number;
    name: string;
    role: string;
  }[];
  // Add members property to fix type errors in components
  members?: {
    id: string;
    name: string;
  }[];
}

export const useProjectState = (projectId: string | undefined) => {
  // Format the project name
  const formattedProjectName = projectId?.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  
  // Initialize project data with defaults
  const [projectData, setProjectData] = useState<ProjectDataState>({
    name: formattedProjectName,
    description: "This is a sample project description that explains the goals and objectives of this project.",
    status: "in-progress",
    dueDate: "2025-05-15",
    category: "Development",
    progress: 35,
    priority: "medium",
    tasks: {
      total: 24,
      completed: 8,
      inProgress: 12,
      notStarted: 4
    },
    team: [
      { id: 1, name: "John Doe", role: "Project Manager" },
      { id: 2, name: "Jane Smith", role: "Lead Developer" },
      { id: 3, name: "Mike Johnson", role: "Designer" },
      { id: 4, name: "Sarah Williams", role: "QA Engineer" }
    ],
    // Add equivalent members array for compatibility
    members: [
      { id: "1", name: "John Doe" },
      { id: "2", name: "Jane Smith" },
      { id: "3", name: "Mike Johnson" },
      { id: "4", name: "Sarah Williams" }
    ]
  });

  // Handler to update project status
  const handleStatusChange = (newStatus: string) => {
    setProjectData(prev => ({
      ...prev,
      status: newStatus as ProjectStatus
    }));

    toast(`Project status updated`, {
      description: `Project has been marked as ${newStatus === 'completed' ? 'complete' : newStatus.replace('-', ' ')}`,
    });
  };

  return {
    projectData,
    setProjectData,
    handleStatusChange
  };
};
