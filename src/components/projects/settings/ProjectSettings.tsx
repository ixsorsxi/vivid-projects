
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Project } from '@/lib/types/project';

interface ProjectSettingsProps {
  projectId: string;
  project: Project;
}

const ProjectSettings: React.FC<ProjectSettingsProps> = ({ projectId, project }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input id="project-name" defaultValue={project.name} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="project-description">Description</Label>
            <Input id="project-description" defaultValue={project.description || ''} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="project-due-date">Due Date</Label>
            <Input id="project-due-date" type="date" defaultValue={
              project.dueDate ? new Date(project.dueDate).toISOString().split('T')[0] : ''
            } />
          </div>
          
          <Button type="button" className="mt-4">
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProjectSettings;
