
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
import { CalendarIcon } from 'lucide-react';
import { ProjectFinancial } from '@/lib/types/project';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from '@/components/ui/toast-wrapper';
import { format } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ProjectFinancialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  onAddFinancial: (financial: Omit<ProjectFinancial, 'id' | 'project_id' | 'created_at'>) => Promise<void>;
  financial?: ProjectFinancial | null;
  isEditing?: boolean;
}

const ProjectFinancialDialog: React.FC<ProjectFinancialDialogProps> = ({
  open,
  onOpenChange,
  projectId,
  onAddFinancial,
  financial = null,
  isEditing = false
}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [category, setCategory] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'pending' | 'overdue'>('pending');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const financialCategories = [
    'Equipment', 'Licenses', 'Consulting', 'Training', 
    'Travel', 'Office', 'Marketing', 'Employee', 'Services', 
    'Subscription', 'Other'
  ];

  useEffect(() => {
    if (financial) {
      setDescription(financial.description);
      setAmount(financial.amount);
      setType(financial.type);
      setDate(financial.date ? new Date(financial.date) : new Date());
      setCategory(financial.category || '');
      setPaymentStatus(financial.payment_status || 'pending');
    } else {
      // Reset form when opening for new financial
      setDescription('');
      setAmount(0);
      setType('expense');
      setDate(new Date());
      setCategory('');
      setPaymentStatus('pending');
    }
  }, [financial, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || amount === 0 || !date) {
      toast.error("Missing required information", {
        description: "Please provide a description, amount, and date for the financial entry"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onAddFinancial({
        description,
        amount,
        type,
        date: date.toISOString(),
        category,
        payment_status: paymentStatus,
        transaction_date: date.toISOString(),
        transaction_type: type
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding financial entry:', error);
      toast.error("Failed to save financial entry", {
        description: "There was an error saving the financial entry"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Financial Entry' : 'Add Financial Entry'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="pl-8"
                    required
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select 
                  value={type} 
                  onValueChange={(value: 'income' | 'expense') => setType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${!date ? 'text-muted-foreground' : ''}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={category} 
                  onValueChange={setCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {financialCategories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paymentStatus">Payment Status</Label>
              <Select 
                value={paymentStatus} 
                onValueChange={(value: 'paid' | 'pending' | 'overdue') => setPaymentStatus(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !description || amount === 0 || !date}>
              {isSubmitting ? "Saving..." : isEditing ? "Update Entry" : "Add Entry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectFinancialDialog;
