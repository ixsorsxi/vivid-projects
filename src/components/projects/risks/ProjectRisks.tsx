
import React, { useState } from 'react';
import { AlertTriangle, Plus, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProjectRisk } from '@/lib/types/project';
import ProjectRiskDialog from '../overview/ProjectRiskDialog';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

interface ProjectRisksProps {
  projectId: string;
  risks: ProjectRisk[];
}

const ProjectRisks: React.FC<ProjectRisksProps> = ({ projectId, risks = [] }) => {
  const queryClient = useQueryClient();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<ProjectRisk | undefined>(undefined);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  const handleEditRisk = (risk: ProjectRisk) => {
    setSelectedRisk(risk);
    setEditDialogOpen(true);
  };
  
  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'high':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
      case 'medium':
        return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30';
      case 'low':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };
  
  const getProbabilityClass = (probability: string) => {
    switch (probability) {
      case 'high':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'medium':
        return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30';
      case 'low':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      case 'monitored':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      case 'mitigated':
        return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30';
      case 'closed':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Project Risks</CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          className="h-8"
          onClick={() => setAddDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Risk
        </Button>
      </CardHeader>
      <CardContent>
        {risks.length > 0 ? (
          <div className="space-y-4">
            {risks.map((risk) => (
              <div 
                key={risk.id} 
                className="p-4 border rounded-lg hover:bg-accent/20 cursor-pointer"
                onClick={() => handleEditRisk(risk)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3 items-start">
                    <div className={cn(
                      "p-2 rounded-full",
                      getSeverityClass(risk.severity)
                    )}>
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">{risk.title}</h4>
                      {risk.description && (
                        <p className="text-sm text-muted-foreground mt-1">{risk.description}</p>
                      )}
                    </div>
                  </div>
                  <div className={cn(
                    "px-2 py-1 text-xs font-medium rounded-full",
                    getStatusClass(risk.status)
                  )}>
                    {risk.status}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Severity</p>
                    <div className={cn(
                      "mt-1 px-2 py-1 text-xs font-medium rounded-full inline-block",
                      getSeverityClass(risk.severity)
                    )}>
                      {risk.severity}
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Probability</p>
                    <div className={cn(
                      "mt-1 px-2 py-1 text-xs font-medium rounded-full inline-block",
                      getProbabilityClass(risk.probability)
                    )}>
                      {risk.probability}
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Impact</p>
                    <div className={cn(
                      "mt-1 px-2 py-1 text-xs font-medium rounded-full inline-block",
                      getSeverityClass(risk.impact)
                    )}>
                      {risk.impact}
                    </div>
                  </div>
                </div>
                
                {risk.mitigation_plan && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs font-medium text-muted-foreground">Mitigation Plan</p>
                    <p className="text-sm mt-1">{risk.mitigation_plan}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/20 rounded-lg border">
            <ShieldAlert className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="mt-4 text-lg font-medium">No risks identified</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Add your first risk to begin tracking potential issues
            </p>
            <Button 
              className="mt-4" 
              onClick={() => setAddDialogOpen(true)}
            >
              Add Risk
            </Button>
          </div>
        )}
      </CardContent>
      
      {/* Add Risk Dialog */}
      <ProjectRiskDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        projectId={projectId}
      />
      
      {/* Edit Risk Dialog */}
      {selectedRisk && (
        <ProjectRiskDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          projectId={projectId}
          risk={selectedRisk}
          isEditing={true}
        />
      )}
    </Card>
  );
};

export default ProjectRisks;
