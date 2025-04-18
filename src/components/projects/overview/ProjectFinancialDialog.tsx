
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ProjectFinancial } from '@/lib/types/project';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface ProjectFinancialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onAddFinancial: (financial: Omit<ProjectFinancial, 'id' | 'project_id' | 'created_at'>) => Promise<void>;
}

const ProjectFinancialDialog: React.FC<ProjectFinancialDialogProps> = ({
  open,
  onOpenChange,
  projectId,
  onAddFinancial
}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'pending' | 'overdue'>('pending');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setDescription('');
    setAmount(0);
    setTransactionDate(new Date().toISOString().split('T')[0]);
    setTransactionType('expense');
    setCategory('');
    setPaymentStatus('pending');
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onAddFinancial({
        amount,
        type: transactionType,
        date: transactionDate,
        description,
        category,
        transaction_date: transactionDate,
        transaction_type: transactionType,
        payment_status: paymentStatus
      });
      
      handleClose();
    } catch (error) {
      console.error('Error adding financial record:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Financial Record</DialogTitle>
            <DialogDescription>
              Add a new financial transaction for this project.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value))}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={transactionDate}
                  onChange={(e) => setTransactionDate(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Type</Label>
              <RadioGroup 
                value={transactionType} 
                onValueChange={(value) => setTransactionType(value as 'income' | 'expense')}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="income" id="income" />
                  <Label htmlFor="income" className="cursor-pointer">Income</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="expense" id="expense" />
                  <Label htmlFor="expense" className="cursor-pointer">Expense</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="salary">Salary</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="software">Software</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                  <SelectItem value="consulting">Consulting</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Payment Status</Label>
              <Select value={paymentStatus} onValueChange={(value) => setPaymentStatus(value as 'paid' | 'pending' | 'overdue')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                required
              />
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button variant="outline" type="button" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Record'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectFinancialDialog;
