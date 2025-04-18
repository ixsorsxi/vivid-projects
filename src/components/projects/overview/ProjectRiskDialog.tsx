
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProjectRisk } from '@/lib/types/project';

interface ProjectRiskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onAddRisk: (risk: Omit<ProjectRisk, 'id' | 'project_id' | 'created_at'>) => Promise<void>;
  existingRisk?: ProjectRisk;
  onUpdateRisk?: (id: string, risk: Partial<ProjectRisk>) => Promise<void>;
}

export default function ProjectRiskDialog({
  open,
  onOpenChange,
  projectId,
  onAddRisk,
  existingRisk,
  onUpdateRisk
}: ProjectRiskDialogProps) {
  const [title, setTitle] = useState(existingRisk?.title || '');
  const [description, setDescription] = useState(existingRisk?.description || '');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>(existingRisk?.severity || 'medium');
  const [probability, setProbability] = useState<'low' | 'medium' | 'high'>(existingRisk?.probability || 'medium');
  const [impact, setImpact] = useState<'low' | 'medium' | 'high'>(existingRisk?.impact || 'medium');
  const [mitigationPlan, setMitigationPlan] = useState(existingRisk?.mitigation_plan || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      if (existingRisk && onUpdateRisk) {
        // Update existing risk
        await onUpdateRisk(existingRisk.id, {
          title,
          description,
          severity,
          probability,
          impact,
          mitigation_plan: mitigationPlan,
          status: existingRisk.status
        });
      } else {
        // Add new risk
        await onAddRisk({
          title,
          description,
          severity,
          probability,
          impact,
          mitigation_plan: mitigationPlan,
          status: 'identified'
        });
      }

      // Reset form and close dialog
      setTitle('');
      setDescription('');
      setSeverity('medium');
      setProbability('medium');
      setImpact('medium');
      setMitigationPlan('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting risk:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{existingRisk ? 'Edit Risk' : 'Add New Risk'}</DialogTitle>
          <DialogDescription>
            {existingRisk 
              ? 'Update the details of this risk.' 
              : 'Identify a new risk for this project.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="severity" className="text-right">
              Severity
            </Label>
            <Select value={severity} onValueChange={(value) => setSeverity(value as 'low' | 'medium' | 'high' | 'critical')}>
              <SelectTrigger className="col-span-3">
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="probability" className="text-right">
              Probability
            </Label>
            <Select value={probability} onValueChange={(value) => setProbability(value as 'low' | 'medium' | 'high')}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select probability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="impact" className="text-right">
              Impact
            </Label>
            <Select value={impact} onValueChange={(value) => setImpact(value as 'low' | 'medium' | 'high')}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select impact" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="mitigation" className="text-right">
              Mitigation Plan
            </Label>
            <Textarea
              id="mitigation"
              value={mitigationPlan}
              onChange={(e) => setMitigationPlan(e.target.value)}
              className="col-span-3"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !title.trim()}>
            {isSubmitting ? 'Saving...' : existingRisk ? 'Update Risk' : 'Add Risk'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
