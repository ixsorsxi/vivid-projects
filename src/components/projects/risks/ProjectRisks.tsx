
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ProjectRisksProps {
  projectId: string;
  risks?: any[];
}

const ProjectRisks: React.FC<ProjectRisksProps> = ({ projectId, risks = [] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Risks</CardTitle>
      </CardHeader>
      <CardContent>
        {risks.length > 0 ? (
          <div className="space-y-4">
            {risks.map((risk, index) => (
              <div key={index} className="p-3 border rounded-md">
                <p className="font-medium">{risk.title || 'Unnamed Risk'}</p>
                <p className="text-sm text-muted-foreground">
                  Severity: {risk.severity || 'Medium'}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No risks have been identified for this project yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectRisks;
