
import React from 'react';
import ProjectTeamManager from '../team/ProjectTeamManager';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useParams } from 'react-router-dom';

const TeamSection = () => {
  const { projectId } = useParams<{ projectId: string }>();
  
  if (!projectId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Project Team</CardTitle>
          <CardDescription>No project selected</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please select a project to view its team.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <ProjectTeamManager projectId={projectId} />
      </div>
    </div>
  );
};

export default TeamSection;
