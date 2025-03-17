
import React from 'react';
import { Card } from '@/components/ui/card';
import { ProjectHours } from './types';

interface ProjectHoursCardProps {
  projects: ProjectHours[];
}

const ProjectHoursCard: React.FC<ProjectHoursCardProps> = ({ projects }) => {
  const totalHours = projects.reduce((acc, project) => acc + project.hours, 0);
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-6">Hours by Project</h3>
      
      <div className="space-y-4">
        {projects.map((project, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm">{project.project}</div>
              <div className="text-sm font-medium">{project.hours}h</div>
            </div>
            <div className="w-full h-2 bg-muted rounded-full">
              <div className={`h-2 ${project.color} rounded-full`} style={{ width: `${(project.hours / 30) * 100}%` }}></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t">
        <div className="text-sm text-muted-foreground mb-1">This month</div>
        <div className="text-2xl font-bold">
          {totalHours.toFixed(1)} hours
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          across {projects.length} projects
        </div>
      </div>
    </Card>
  );
};

export default ProjectHoursCard;
