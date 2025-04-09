
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ProjectTimelineProps {
  projectId: string;
  milestones?: any[];
}

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ projectId, milestones = [] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        {milestones.length > 0 ? (
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={index} className="p-3 border rounded-md">
                <p className="font-medium">{milestone.title || 'Unnamed Milestone'}</p>
                <p className="text-sm text-muted-foreground">
                  {milestone.due_date ? new Date(milestone.due_date).toLocaleDateString() : 'No date set'}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No milestones have been created for this project yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectTimeline;
