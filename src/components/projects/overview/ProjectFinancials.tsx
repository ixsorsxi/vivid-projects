
import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ProjectFinancial } from '@/lib/types/project';
import ProjectFinancialDialog from './ProjectFinancialDialog';
import { format } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';

interface ProjectFinancialsProps {
  estimatedCost: number;
  actualCost: number;
  budgetApproved: boolean;
  financials?: ProjectFinancial[];
  projectId?: string;
}

const ProjectFinancials: React.FC<ProjectFinancialsProps> = ({ 
  estimatedCost = 0, 
  actualCost = 0, 
  budgetApproved = false,
  financials = [],
  projectId = ''
}) => {
  const queryClient = useQueryClient();
  const [addFinancialOpen, setAddFinancialOpen] = useState(false);
  const [selectedFinancial, setSelectedFinancial] = useState<ProjectFinancial | undefined>(undefined);
  const [editFinancialOpen, setEditFinancialOpen] = useState(false);
  
  // Calculate budget metrics
  const budgetUtilization = estimatedCost > 0 ? (actualCost / estimatedCost) * 100 : 0;
  const isOverBudget = actualCost > estimatedCost;
  const budgetStatus = isOverBudget 
    ? 'Over Budget' 
    : budgetUtilization >= 80 
      ? 'Near Limit' 
      : 'On Track';
  
  // Group financials by type
  const incomeTransactions = financials.filter(f => f.transaction_type === 'income');
  const expenseTransactions = financials.filter(f => f.transaction_type === 'expense');
  
  // Calculate total income and expenses
  const totalIncome = incomeTransactions.reduce((sum, item) => sum + Number(item.amount), 0);
  const totalExpenses = expenseTransactions.reduce((sum, item) => sum + Number(item.amount), 0);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  // Open edit dialog with selected financial
  const handleEditFinancial = (financial: ProjectFinancial) => {
    setSelectedFinancial(financial);
    setEditFinancialOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="font-semibold text-base">Project Financials</h3>
        {projectId && (
          <Button 
            variant="outline" 
            size="sm"
            className="h-8"
            onClick={() => setAddFinancialOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Transaction
          </Button>
        )}
      </div>
      
      {/* Budget Status */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Budget Status</span>
          <span className={`font-medium ${
            isOverBudget ? 'text-red-500' : budgetUtilization >= 80 ? 'text-amber-500' : 'text-green-500'
          }`}>
            {budgetStatus}
          </span>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Budget Utilization</span>
            <span>{Math.round(budgetUtilization)}%</span>
          </div>
          <Progress 
            value={Math.min(budgetUtilization, 100)} 
            className="h-2"
            indicatorClassName={
              isOverBudget 
                ? 'bg-red-500' 
                : budgetUtilization >= 80 
                  ? 'bg-amber-500' 
                  : 'bg-green-500'
            }
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-blue-500" />
              <span className="text-xs text-muted-foreground">Estimated</span>
            </div>
            <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
              {formatCurrency(estimatedCost)}
            </div>
            <div className="text-xs mt-1">
              {budgetApproved 
                ? <span className="text-green-500">Budget Approved</span> 
                : <span className="text-amber-500">Approval Pending</span>
              }
            </div>
          </div>
          
          <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-900/30">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-4 w-4 text-purple-500" />
              <span className="text-xs text-muted-foreground">Actual</span>
            </div>
            <div className="text-lg font-bold text-purple-700 dark:text-purple-300">
              {formatCurrency(actualCost)}
            </div>
            <div className="text-xs mt-1">
              {isOverBudget 
                ? <span className="text-red-500">{formatCurrency(actualCost - estimatedCost)} Over</span>
                : <span className="text-green-500">{formatCurrency(estimatedCost - actualCost)} Remaining</span>
              }
            </div>
          </div>
        </div>
      </div>
      
      {/* Financial Summary */}
      {financials.length > 0 && (
        <div className="space-y-3 mt-4">
          <h4 className="font-medium text-sm">Financial Summary</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-xs text-muted-foreground">Income</span>
              </div>
              <div className="text-lg font-bold text-green-700 dark:text-green-300">
                {formatCurrency(totalIncome)}
              </div>
              <div className="text-xs mt-1">
                {incomeTransactions.length} transactions
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30">
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown className="h-4 w-4 text-red-500" />
                <span className="text-xs text-muted-foreground">Expenses</span>
              </div>
              <div className="text-lg font-bold text-red-700 dark:text-red-300">
                {formatCurrency(totalExpenses)}
              </div>
              <div className="text-xs mt-1">
                {expenseTransactions.length} transactions
              </div>
            </div>
          </div>
        
          {/* Recent Transactions */}
          <div className="mt-4">
            <h4 className="font-medium text-sm mb-2">Recent Transactions</h4>
            
            <div className="space-y-2">
              {financials.slice(0, 5).map((transaction) => (
                <div 
                  key={transaction.id} 
                  className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                  onClick={projectId ? () => handleEditFinancial(transaction) : undefined}
                  style={projectId ? { cursor: 'pointer' } : undefined}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {transaction.transaction_type === 'income' ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <span className="font-medium text-sm">{transaction.category}</span>
                    </div>
                    <span 
                      className={`font-bold ${
                        transaction.transaction_type === 'income' 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {transaction.transaction_type === 'income' ? '+' : '-'}
                      {formatCurrency(Number(transaction.amount))}
                    </span>
                  </div>
                  
                  <div className="mt-1 text-xs text-muted-foreground">
                    <span>{formatDate(transaction.transaction_date)}</span>
                    
                    {transaction.description && (
                      <p className="mt-1">{transaction.description}</p>
                    )}
                  </div>
                  
                  <div className="flex justify-between mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      transaction.payment_status === 'paid' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                        : transaction.payment_status === 'pending'
                          ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                    }`}>
                      {transaction.payment_status}
                    </span>
                    
                    {projectId && (
                      <button 
                        className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditFinancial(transaction);
                        }}
                      >
                        View
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {financials.length > 5 && (
                <p className="text-xs text-center text-muted-foreground">
                  + {financials.length - 5} more transactions not shown
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Add Financial Dialog */}
      {projectId && (
        <ProjectFinancialDialog
          open={addFinancialOpen}
          onOpenChange={setAddFinancialOpen}
          projectId={projectId}
        />
      )}
      
      {/* Edit Financial Dialog */}
      {projectId && selectedFinancial && (
        <ProjectFinancialDialog
          open={editFinancialOpen}
          onOpenChange={setEditFinancialOpen}
          projectId={projectId}
          financial={selectedFinancial}
          isEditing={true}
        />
      )}
    </div>
  );
};

export default ProjectFinancials;
