
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ProjectFinancialsProps {
  projectId: string;
  financials?: any[];
}

const ProjectFinancials: React.FC<ProjectFinancialsProps> = ({ projectId, financials = [] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Financials</CardTitle>
      </CardHeader>
      <CardContent>
        {financials.length > 0 ? (
          <div className="space-y-4">
            {financials.map((item, index) => (
              <div key={index} className="p-3 border rounded-md">
                <p className="font-medium">{item.title || 'Financial Item'}</p>
                <p className="text-sm text-muted-foreground">
                  Amount: ${item.amount?.toFixed(2) || '0.00'}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No financial data has been added to this project yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectFinancials;
