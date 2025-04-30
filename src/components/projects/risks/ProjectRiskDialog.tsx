
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ProjectRisk } from '@/lib/types/project';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from '@/components/ui/toast-wrapper';

interface ProjectRiskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onAddRisk: (risk: Omit<ProjectRisk, 'id' | 'project_id' | 'created_at'>) => Promise<void>;
  risk?: ProjectRisk | null;
  isEditing?: boolean;
}

const ProjectRiskDialog: React.FC<ProjectRiskDialogProps> = ({
  open,
  onOpenChange,
  projectId,
  onAddRisk,
  risk = null,
  isEditing = false
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('low');
  const [probability, setProbability] = useState<'low' | 'medium' | 'high'>('low');
  const [impact, setImpact] = useState<'low' | 'medium' | 'high'>('low');
  const [mitigationPlan, setMitigationPlan] = useState('');
  const [status, setStatus] = useState<'identified' | 'analyzing' | 'mitigating' | 'resolved'>('identified');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (risk) {
      setTitle(risk.title);
      setDescription(risk.description || '');
      setSeverity(risk.severity as 'low' | 'medium' | 'high' | 'critical');
      setProbability(risk.probability as 'low' | 'medium' | 'high');
      setImpact(risk.impact);
      setMitigationPlan(risk.mitigation_plan || '');
      setStatus(risk.status as 'identified' | 'analyzing' | 'mitigating' | 'resolved');
    } else {
      // Reset form when opening for new risk
      setTitle('');
      setDescription('');
      setSeverity('low');
      setProbability('low');
      setImpact('low');
      setMitigationPlan('');
      setStatus('identified');
    }
  }, [risk, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) {
      toast.error("Missing required information", {
        description: "Please provide a title for the risk"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onAddRisk({
        title,
        description,
        severity,
        probability,
        impact,
        mitigation_plan: mitigationPlan,
        status,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding risk:', error);
      toast.error("Failed to save risk", {
        description: "There was an error saving the risk"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Risk' : 'Add New Risk'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Risk Title *</Label>
              <Input
                id="title"
                placeholder="Enter risk title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the risk"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="severity">Severity</Label>
                <Select 
                  value={severity} 
                  onValueChange={(value: 'low' | 'medium' | 'high' | 'critical') => setSeverity(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="probability">Probability</Label>
                <Select 
                  value={probability} 
                  onValueChange={(value: 'low' | 'medium' | 'high') => setProbability(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select probability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="impact">Impact</Label>
                <Select 
                  value={impact} 
                  onValueChange={(value: 'low' | 'medium' | 'high') => setImpact(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select impact" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={status} 
                  onValueChange={(value: 'identified' | 'analyzing' | 'mitigating' | 'resolved') => setStatus(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="identified">Identified</SelectItem>
                    <SelectItem value="analyzing">Analyzing</SelectItem>
                    <SelectItem value="mitigating">Mitigating</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mitigationPlan">Mitigation Plan</Label>
              <Textarea
                id="mitigationPlan"
                placeholder="Describe how to mitigate this risk"
                value={mitigationPlan}
                onChange={(e) => setMitigationPlan(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEditing ? "Update Risk" : "Add Risk"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectRiskDialog;
