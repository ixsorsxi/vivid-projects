
import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectFinancial } from '@/lib/types/project';
import ProjectFinancialDialog from './ProjectFinancialDialog';
import { format } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

interface ProjectFinancialsProps {
  projectId: string;
  financials: ProjectFinancial[];
}

const ProjectFinancials: React.FC<ProjectFinancialsProps> = ({ projectId, financials = [] }) => {
  const queryClient = useQueryClient();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedFinancial, setSelectedFinancial] = useState<ProjectFinancial | undefined>(undefined);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  const totalIncome = financials
    .filter(f => f.transaction_type === 'income')
    .reduce((sum, f) => sum + Number(f.amount), 0);
    
  const totalExpense = financials
    .filter(f => f.transaction_type === 'expense')
    .reduce((sum, f) => sum + Number(f.amount), 0);
    
  const balance = totalIncome - totalExpense;
  
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  const handleEditFinancial = (financial: ProjectFinancial) => {
    setSelectedFinancial(financial);
    setEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Project Financials</h3>
        <Button 
          variant="outline" 
          size="sm"
          className="h-8"
          onClick={() => setAddDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Transaction
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-900/30">
          <div className="flex items-center space-x-2 text-green-700 dark:text-green-400">
            <TrendingUp className="h-5 w-5" />
            <h4 className="font-medium">Total Income</h4>
          </div>
          <p className="text-2xl font-bold mt-2 text-green-700 dark:text-green-400">{formatAmount(totalIncome)}</p>
        </div>
        
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-900/30">
          <div className="flex items-center space-x-2 text-red-700 dark:text-red-400">
            <TrendingDown className="h-5 w-5" />
            <h4 className="font-medium">Total Expenses</h4>
          </div>
          <p className="text-2xl font-bold mt-2 text-red-700 dark:text-red-400">{formatAmount(totalExpense)}</p>
        </div>
        
        <div className={cn(
          "p-4 rounded-lg border",
          balance >= 0 
            ? "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30" 
            : "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30"
        )}>
          <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-400">
            <DollarSign className="h-5 w-5" />
            <h4 className="font-medium">Balance</h4>
          </div>
          <p className={cn(
            "text-2xl font-bold mt-2",
            balance >= 0 
              ? "text-blue-700 dark:text-blue-400" 
              : "text-amber-700 dark:text-amber-400"
          )}>{formatAmount(balance)}</p>
        </div>
      </div>
      
      {financials.length > 0 ? (
        <div className="mt-6">
          <div className="bg-card rounded-lg border overflow-hidden">
            <div className="grid grid-cols-7 gap-2 p-3 bg-muted/50 text-sm font-medium">
              <div className="col-span-2">Description</div>
              <div className="col-span-1">Date</div>
              <div className="col-span-1">Category</div>
              <div className="col-span-1">Type</div>
              <div className="col-span-1">Amount</div>
              <div className="col-span-1">Status</div>
            </div>
            
            <div className="divide-y">
              {financials.map((item) => (
                <div 
                  key={item.id} 
                  className="grid grid-cols-7 gap-2 p-3 text-sm hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleEditFinancial(item)}
                >
                  <div className="col-span-2 font-medium truncate">{item.description || 'No description'}</div>
                  <div className="col-span-1">{formatDate(item.transaction_date)}</div>
                  <div className="col-span-1 capitalize">{item.category}</div>
                  <div className="col-span-1 capitalize">{item.transaction_type}</div>
                  <div className={cn(
                    "col-span-1 font-medium",
                    item.transaction_type === 'income' ? 'text-green-600' : 'text-red-600'
                  )}>
                    {item.transaction_type === 'income' ? '+' : '-'}{formatAmount(Number(item.amount))}
                  </div>
                  <div className="col-span-1">
                    <span className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                      item.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                      item.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      item.payment_status === 'overdue' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    )}>
                      {item.payment_status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/20 rounded-lg border">
          <DollarSign className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-lg font-medium">No financial records</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Add your first transaction to start tracking project finances
          </p>
          <Button 
            className="mt-4" 
            onClick={() => setAddDialogOpen(true)}
          >
            Add Transaction
          </Button>
        </div>
      )}
      
      {/* Add Financial Dialog */}
      <ProjectFinancialDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        projectId={projectId}
      />
      
      {/* Edit Financial Dialog */}
      {selectedFinancial && (
        <ProjectFinancialDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          projectId={projectId}
          financial={selectedFinancial}
          isEditing={true}
        />
      )}
    </div>
  );
};

export default ProjectFinancials;
