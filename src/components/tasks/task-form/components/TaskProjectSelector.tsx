
import React, { useEffect, useState } from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchUserProjects } from '@/api/projects/projectFetch';
import { Project } from '@/lib/types/project';
import { useAuth } from '@/context/auth';

interface TaskProjectSelectorProps {
  project: string | undefined;
  handleChange: (field: string, value: any) => void;
}

const TaskProjectSelector: React.FC<TaskProjectSelectorProps> = ({
  project,
  handleChange
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoading(true);
        // Fetch user projects from Supabase
        const userProjects = await fetchUserProjects(user?.id || '');
        setProjects(userProjects);
      } catch (error) {
        console.error('Error loading projects:', error);
        // Fallback to demo data if needed
        setProjects([
          { id: '1', name: 'Project A', description: '', status: 'in-progress', progress: 0, dueDate: '' },
          { id: '2', name: 'Project B', description: '', status: 'in-progress', progress: 0, dueDate: '' }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, [user]);

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="project" className="text-right">
        Project
      </Label>
      <Select 
        value={project || 'personal'} 
        onValueChange={(value) => handleChange('project', value === 'personal' ? '' : value)}
        disabled={isLoading}
      >
        <SelectTrigger className="col-span-3">
          <SelectValue placeholder={isLoading ? "Loading projects..." : "Select project"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="personal">Personal Tasks</SelectItem>
          {projects.map(proj => (
            <SelectItem key={proj.id} value={proj.id}>
              {proj.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TaskProjectSelector;
