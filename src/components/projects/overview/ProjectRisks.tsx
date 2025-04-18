import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, AlarmClock, ShieldAlert, CheckSquare, AlertTriangle } from "lucide-react";
import { ProjectRisk } from "@/lib/types/project";
import { useProjectRisks } from "@/hooks/project/useProjectRisks";
import ProjectRiskDialog from "./ProjectRiskDialog";

interface ProjectRisksProps {
  projectId: string;
}

export function ProjectRisks({ projectId }: ProjectRisksProps) {
  const { risks, addRisk, updateRisk, isLoading } = useProjectRisks(projectId);
  const [showAddRisk, setShowAddRisk] = useState(false);
  
  // Filter risks by status - keep both active and inactive
  const activeRisks = risks.filter(risk => 
    risk.status === 'identified' || risk.status === 'analyzing' || risk.status === 'mitigating'
  );
  
  const resolvedRisks = risks.filter(risk => 
    risk.status === 'resolved' || risk.status === 'accepted'
  );
  
  // Get total counts
  const totalRisks = risks.length;
  const totalActiveRisks = activeRisks.length;
  
  // Helper function to get the severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Helper function to get the status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'identified': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'analyzing': return <AlarmClock className="h-4 w-4 text-blue-500" />;
      case 'mitigating': return <ShieldAlert className="h-4 w-4 text-purple-500" />;
      case 'resolved': 
      case 'accepted': 
        return <CheckSquare className="h-4 w-4 text-green-500" />;
      default: return null;
    }
  };
  
  const handleUpdateRiskStatus = async (id: string, status: 'identified' | 'analyzing' | 'mitigating' | 'resolved' | 'accepted') => {
    await updateRisk(id, { status });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Project Risks</CardTitle>
        <Button 
          size="sm" 
          onClick={() => setShowAddRisk(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add Risk
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <p className="text-muted-foreground">Loading risks...</p>
          </div>
        ) : risks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground mb-2">No risks identified yet</p>
            <Button variant="outline" size="sm" onClick={() => setShowAddRisk(true)}>
              Identify a Risk
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col justify-center items-center p-4 bg-muted/50 rounded-lg">
                <span className="text-lg font-bold">{totalRisks}</span>
                <span className="text-xs text-muted-foreground">Total Risks</span>
              </div>
              <div className="flex flex-col justify-center items-center p-4 bg-muted/50 rounded-lg">
                <span className="text-lg font-bold">{totalActiveRisks}</span>
                <span className="text-xs text-muted-foreground">Active Risks</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <h4 className="text-sm font-medium mb-2">Active Risks</h4>
              {activeRisks.length > 0 ? (
                <div className="space-y-2">
                  {activeRisks.map((risk) => (
                    <div key={risk.id} className="p-3 border rounded-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(risk.status)}
                          <span className="font-medium">{risk.title}</span>
                        </div>
                        <Badge className={getSeverityColor(risk.severity)}>
                          {risk.severity}
                        </Badge>
                      </div>
                      {risk.description && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {risk.description}
                        </p>
                      )}
                      <div className="flex justify-end mt-2 gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleUpdateRiskStatus(risk.id, 'resolved')}
                        >
                          Mark Resolved
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No active risks</p>
              )}
            </div>
            
            {resolvedRisks.length > 0 && (
              <div className="space-y-1">
                <h4 className="text-sm font-medium mb-2">Resolved Risks</h4>
                <div className="space-y-2">
                  {resolvedRisks.map((risk) => (
                    <div key={risk.id} className="p-3 border rounded-md opacity-70">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(risk.status)}
                          <span className="font-medium">{risk.title}</span>
                        </div>
                        <Badge className={getSeverityColor(risk.severity)}>
                          {risk.severity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        <ProjectRiskDialog
          open={showAddRisk}
          onOpenChange={setShowAddRisk}
          projectId={projectId}
          onAddRisk={addRisk}
        />
      </CardContent>
    </Card>
  );
}
