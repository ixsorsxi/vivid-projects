
import React, { useState } from 'react';
import { AlertTriangle, Plus, X, ChevronUp, ChevronDown, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectRisk } from '@/lib/types/project';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ProjectRiskDialog from './ProjectRiskDialog';

interface ProjectRisksProps {
  projectId: string;
  risks: ProjectRisk[];
}

const getSeverityColor = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'high':
      return 'text-destructive bg-destructive/10';
    case 'medium':
      return 'text-amber-600 bg-amber-100 dark:bg-amber-800/30';
    case 'low':
      return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-800/30';
    default:
      return 'text-slate-600 bg-slate-100 dark:bg-slate-800/30';
  }
};

const getImpactColor = (impact: string) => {
  switch (impact.toLowerCase()) {
    case 'high':
      return 'text-red-600';
    case 'medium':
      return 'text-yellow-600';
    case 'low':
      return 'text-green-600';
    default:
      return 'text-slate-600';
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
    case 'mitigated':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'occurred':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    case 'closed':
      return 'bg-slate-100 text-slate-800 dark:bg-slate-800/50 dark:text-slate-400';
    default:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
  }
};

const ProjectRisks: React.FC<ProjectRisksProps> = ({ projectId, risks = [] }) => {
  const [isAddRiskOpen, setIsAddRiskOpen] = useState(false);
  const [isEditRiskOpen, setIsEditRiskOpen] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<ProjectRisk | null>(null);
  const [expandedRiskId, setExpandedRiskId] = useState<string | null>(null);
  
  const activeRisks = risks.filter(risk => risk.status.toLowerCase() === 'active');
  const mitigatedRisks = risks.filter(risk => risk.status.toLowerCase() === 'mitigated');
  const closedRisks = risks.filter(risk => ['occurred', 'closed'].includes(risk.status.toLowerCase()));
  
  const handleEditRisk = (risk: ProjectRisk) => {
    setSelectedRisk(risk);
    setIsEditRiskOpen(true);
  };
  
  const toggleExpand = (riskId: string) => {
    setExpandedRiskId(expandedRiskId === riskId ? null : riskId);
  };

  // Create a stub function to match the required type
  const handleAddRisk = async (risk: Omit<ProjectRisk, "id" | "project_id" | "created_at">): Promise<void> => {
    return Promise.resolve();
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'No date';
    }
  };

  const renderRiskItem = (risk: ProjectRisk) => {
    const isExpanded = expandedRiskId === risk.id;
    
    return (
      <div key={risk.id} className="mb-4 border rounded-md overflow-hidden">
        <div 
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/30"
          onClick={() => toggleExpand(risk.id)}
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className={cn(
              "h-5 w-5",
              risk.severity.toLowerCase() === 'high' ? "text-destructive" : 
              risk.severity.toLowerCase() === 'medium' ? "text-amber-500" : "text-emerald-500"
            )} />
            <div>
              <h4 className="font-medium">{risk.title}</h4>
              <p className="text-sm text-muted-foreground">Last updated: {formatDate(risk.updated_at || risk.created_at)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={getStatusColor(risk.status)}>{risk.status}</Badge>
            <Badge className={getSeverityColor(risk.severity)}>{risk.severity}</Badge>
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </div>
        </div>
        
        {isExpanded && (
          <div className="p-4 bg-muted/20 border-t">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Probability</p>
                <p>{risk.probability}%</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Impact</p>
                <p className={getImpactColor(risk.impact)}>{risk.impact}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Owner</p>
                <p>{risk.owner_name || 'Unassigned'}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
              <p className="text-sm">{risk.description || 'No description provided.'}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm font-medium text-muted-foreground mb-1">Mitigation Plan</p>
              <p className="text-sm">{risk.mitigation_plan || 'No mitigation plan provided.'}</p>
            </div>
            
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditRisk(risk);
                }}
              >
                Edit Risk
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <CardTitle>Project Risks</CardTitle>
        <Button 
          onClick={() => setIsAddRiskOpen(true)}
          size="sm"
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Risk
        </Button>
      </CardHeader>
      <CardContent>
        {risks.length > 0 ? (
          <>
            {activeRisks.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Active Risks</h3>
                {activeRisks.map(renderRiskItem)}
              </div>
            )}
            
            {mitigatedRisks.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Mitigated Risks</h3>
                {mitigatedRisks.map(renderRiskItem)}
              </div>
            )}
            
            {closedRisks.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-3">Closed Risks</h3>
                {closedRisks.map(renderRiskItem)}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="mt-4 text-lg font-medium">No risks identified</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Start by identifying potential risks to your project
            </p>
            <Button 
              className="mt-4" 
              onClick={() => setIsAddRiskOpen(true)}
            >
              Add New Risk
            </Button>
          </div>
        )}
      </CardContent>
      
      {/* Add Risk Dialog */}
      <ProjectRiskDialog
        open={isAddRiskOpen}
        onOpenChange={setIsAddRiskOpen}
        projectId={projectId}
        onAddRisk={handleAddRisk}
      />
      
      {/* Edit Risk Dialog */}
      {selectedRisk && (
        <ProjectRiskDialog
          open={isEditRiskOpen}
          onOpenChange={setIsEditRiskOpen}
          projectId={projectId}
          risk={selectedRisk}
          isEditing={true}
          onAddRisk={handleAddRisk}
        />
      )}
    </Card>
  );
};

export default ProjectRisks;
