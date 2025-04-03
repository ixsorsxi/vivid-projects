
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProjectFinancial } from '@/lib/types/project';
import { addProjectFinancial, updateProjectFinancial } from '@/api/projects/modules/projectData';
import { toast } from '@/components/ui/toast-wrapper';
import { useQueryClient } from '@tanstack/react-query';

interface ProjectFinancialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  financial?: ProjectFinancial;
  isEditing?: boolean;
}

const ProjectFinancialDialog: React.FC<ProjectFinancialDialogProps> = ({
  open,
  onOpenChange,
  projectId,
  financial,
  isEditing = false
}) => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    transaction_date: financial?.transaction_date 
      ? new Date(financial.transaction_date).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0],
    amount: financial?.amount?.toString() || '0',
    transaction_type: financial?.transaction_type || 'expense',
    category: financial?.category || 'general',
    description: financial?.description || '',
    payment_status: financial?.payment_status || 'pending'
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.transaction_date || !formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Missing or invalid fields', {
        description: 'Please provide a valid date and amount'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        amount: parseFloat(formData.amount),
        transaction_date: new Date(formData.transaction_date).toISOString()
      };
      
      if (isEditing && financial) {
        const success = await updateProjectFinancial(financial.id, payload);
        if (success) {
          toast.success('Financial record updated', {
            description: 'The financial record has been updated successfully'
          });
        } else {
          throw new Error('Failed to update financial record');
        }
      } else {
        const result = await addProjectFinancial(projectId, payload);
        if (result) {
          toast.success('Financial record created', {
            description: 'The financial record has been added to the project'
          });
        } else {
          throw new Error('Failed to create financial record');
        }
      }
      
      // Invalidate queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ['project-financials', projectId] });
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving financial record:', error);
      toast.error('Error saving financial record', {
        description: 'Please try again later'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Financial Record' : 'Add New Financial Record'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="transaction_date">Date*</Label>
              <Input 
                id="transaction_date"
                type="date"
                value={formData.transaction_date}
                onChange={(e) => handleChange('transaction_date', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount*</Label>
              <Input 
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="transaction_type">Type</Label>
              <Select 
                value={formData.transaction_type} 
                onValueChange={(value) => handleChange('transaction_type', value)}
              >
                <SelectTrigger id="transaction_type">
                  <SelectValue placeholder="Transaction type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleChange('category', value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="labor">Labor</SelectItem>
                  <SelectItem value="materials">Materials</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                  <SelectItem value="software">Software</SelectItem>
                  <SelectItem value="hardware">Hardware</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Description of the transaction"
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="payment_status">Payment Status</Label>
            <Select 
              value={formData.payment_status} 
              onValueChange={(value) => handleChange('payment_status', value)}
            >
              <SelectTrigger id="payment_status">
                <SelectValue placeholder="Payment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Record' : 'Add Record'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectFinancialDialog;
