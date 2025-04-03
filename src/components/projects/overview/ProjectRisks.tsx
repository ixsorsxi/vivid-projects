
import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle, Plus } from 'lucide-react';
import { ProjectRisk } from '@/lib/types/project';
import { Button } from '@/components/ui/button';
import ProjectRiskDialog from './ProjectRiskDialog';
import { updateProjectRisk } from '@/api/projects/modules/projectData';
import { toast } from '@/components/ui/toast-wrapper';
import { useQueryClient } from '@tanstack/react-query';

interface ProjectRisksProps {
  risks: ProjectRisk[];
  projectId?: string;
}

const ProjectRisks: React.FC<ProjectRisksProps> = ({ risks = [], projectId = '' }) => {
  const queryClient = useQueryClient();
  const [addRiskOpen, setAddRiskOpen] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<ProjectRisk | undefined>(undefined);
  const [editRiskOpen, setEditRiskOpen] = useState(false);
  
  // Group risks by severity
  const highRisks = risks.filter(risk => risk.severity === 'high' && risk.status !== 'closed');
  const mediumRisks = risks.filter(risk => risk.severity === 'medium' && risk.status !== 'closed');
  const lowRisks = risks.filter(risk => risk.severity === 'low' && risk.status !== 'closed');
  const closedRisks = risks.filter(risk => risk.status === 'closed');
  
  // Calculate risk metrics
  const totalActiveRisks = highRisks.length + mediumRisks.length + lowRisks.length;
  const totalRisks = totalActiveRisks + closedRisks.length;
  const mitigatedPercentage = totalRisks > 0 
    ? Math.round((closedRisks.length / totalRisks) * 100) 
    : 0;
  
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'text-red-500 dark:text-red-400';
      case 'medium': return 'text-amber-500 dark:text-amber-400';
      case 'low': return 'text-blue-500 dark:text-blue-400';
      default: return 'text-gray-500 dark:text-gray-400';
    }
  };
  
  const getSeverityBg = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'bg-red-100 dark:bg-red-900/30';
      case 'medium': return 'bg-amber-100 dark:bg-amber-900/30';
      case 'low': return 'bg-blue-100 dark:bg-blue-900/30';
      default: return 'bg-gray-100 dark:bg-gray-800';
    }
  };

  // Open edit dialog with selected risk
  const handleEditRisk = (risk: ProjectRisk) => {
    setSelectedRisk(risk);
    setEditRiskOpen(true);
  };
  
  // Toggle risk status between active and closed
  const toggleRiskStatus = async (risk: ProjectRisk) => {
    const newStatus = risk.status === 'closed' ? 'active' : 'closed';
    
    try {
      const success = await updateProjectRisk(risk.id, { status: newStatus });
      if (success) {
        toast.success(`Risk ${newStatus === 'closed' ? 'closed' : 'reopened'}`, {
          description: `The risk has been marked as ${newStatus}`
        });
        
        // Refresh risks data
        queryClient.invalidateQueries({ queryKey: ['project-risks', projectId] });
      }
    } catch (error) {
      console.error('Error updating risk status:', error);
      toast.error('Could not update risk', {
        description: 'Please try again later'
      });
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="font-semibold text-base">Project Risks</h3>
        {projectId && (
          <Button 
            variant="outline" 
            size="sm"
            className="h-8"
            onClick={() => setAddRiskOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Risk
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-red-800 dark:text-red-300">High</h4>
            <span className="text-lg font-bold text-red-800 dark:text-red-300">{highRisks.length}</span>
          </div>
        </div>
        
        <div className="rounded-lg p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300">Medium</h4>
            <span className="text-lg font-bold text-amber-800 dark:text-amber-300">{mediumRisks.length}</span>
          </div>
        </div>
        
        <div className="rounded-lg p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">Low</h4>
            <span className="text-lg font-bold text-blue-800 dark:text-blue-300">{lowRisks.length}</span>
          </div>
        </div>
        
        <div className="rounded-lg p-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-green-800 dark:text-green-300">Mitigated</h4>
            <span className="text-lg font-bold text-green-800 dark:text-green-300">{mitigatedPercentage}%</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-3 mt-4">
        <h4 className="font-medium text-sm">Active Risks</h4>
        
        {totalActiveRisks > 0 ? (
          <div className="space-y-2">
            {[...highRisks, ...mediumRisks, ...lowRisks].map((risk) => (
              <div key={risk.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className={`rounded-full p-1.5 ${getSeverityBg(risk.severity)}`}>
                  <AlertTriangle className={`h-4 w-4 ${getSeverityColor(risk.severity)}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-sm">{risk.title}</h5>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getSeverityBg(risk.severity)} ${getSeverityColor(risk.severity)}`}>
                        {risk.severity}
                      </span>
                      
                      {projectId && (
                        <>
                          <button
                            onClick={() => toggleRiskStatus(risk)}
                            className="text-xs px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-800/40 text-green-700 dark:text-green-300"
                          >
                            Close
                          </button>
                          <button
                            onClick={() => handleEditRisk(risk)}
                            className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                          >
                            Edit
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  {risk.description && (
                    <p className="text-xs text-muted-foreground mt-1">{risk.description}</p>
                  )}
                  
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div className="text-xs">
                      <span className="text-muted-foreground">Probability:</span>{' '}
                      <span className="font-medium">{risk.probability}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-muted-foreground">Impact:</span>{' '}
                      <span className="font-medium">{risk.impact}</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-muted-foreground">Status:</span>{' '}
                      <span className="font-medium">{risk.status}</span>
                    </div>
                  </div>
                  
                  {risk.mitigation_plan && (
                    <div className="text-xs mt-2">
                      <span className="text-muted-foreground">Mitigation:</span>{' '}
                      <span>{risk.mitigation_plan}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {totalActiveRisks > 5 && (
              <p className="text-xs text-center text-muted-foreground">
                + {totalActiveRisks - 5} more risks not shown
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-center">
              <ShieldAlert className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm">No active risks identified</p>
              {projectId && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => setAddRiskOpen(true)}
                >
                  Add Risk
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      
      {closedRisks.length > 0 && (
        <div className="space-y-3 mt-4">
          <h4 className="font-medium text-sm">Closed Risks</h4>
          <div className="space-y-2">
            {closedRisks.slice(0, 3).map((risk) => (
              <div key={risk.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="rounded-full p-1.5 bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-sm">{risk.title}</h5>
                    
                    {projectId && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleRiskStatus(risk)}
                          className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-800/40 text-blue-700 dark:text-blue-300"
                        >
                          Reopen
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {risk.description && (
                    <p className="text-xs text-muted-foreground mt-1">{risk.description}</p>
                  )}
                </div>
              </div>
            ))}
            
            {closedRisks.length > 3 && (
              <p className="text-xs text-center text-muted-foreground">
                + {closedRisks.length - 3} more closed risks not shown
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* Add Risk Dialog */}
      {projectId && (
        <ProjectRiskDialog
          open={addRiskOpen}
          onOpenChange={setAddRiskOpen}
          projectId={projectId}
        />
      )}
      
      {/* Edit Risk Dialog */}
      {projectId && selectedRisk && (
        <ProjectRiskDialog
          open={editRiskOpen}
          onOpenChange={setEditRiskOpen}
          projectId={projectId}
          risk={selectedRisk}
          isEditing={true}
        />
      )}
    </div>
  );
};

export default ProjectRisks;
