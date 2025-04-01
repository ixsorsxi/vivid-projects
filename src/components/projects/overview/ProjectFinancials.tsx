
import React from 'react';
import { DollarSign, CreditCard, Landmark } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface ProjectFinancialsProps {
  estimatedCost: number;
  actualCost: number;
  budgetApproved: boolean;
}

const ProjectFinancials: React.FC<ProjectFinancialsProps> = ({ 
  estimatedCost, 
  actualCost, 
  budgetApproved 
}) => {
  const budgetUsagePercentage = estimatedCost > 0 
    ? Math.min(Math.round((actualCost / estimatedCost) * 100), 100) 
    : 0;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-base border-b pb-2">Financial Summary</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-2">
          <div className="rounded-full p-2 bg-blue-100 dark:bg-blue-900/30">
            <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="text-sm font-medium">Estimated Cost</h4>
            <p className="text-lg font-semibold">{formatCurrency(estimatedCost)}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="rounded-full p-2 bg-amber-100 dark:bg-amber-900/30">
            <CreditCard className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h4 className="text-sm font-medium">Actual Cost</h4>
            <p className="text-lg font-semibold">{formatCurrency(actualCost)}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="rounded-full p-2 bg-emerald-100 dark:bg-emerald-900/30">
            <Landmark className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h4 className="text-sm font-medium">Budget Status</h4>
            <p className={`text-sm font-medium ${
              budgetApproved ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
            }`}>
              {budgetApproved ? 'Approved' : 'Pending Approval'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-2">
        <div className="flex justify-between mb-1 text-sm">
          <span>Budget Usage</span>
          <span className="font-medium">{budgetUsagePercentage}%</span>
        </div>
        <Progress value={budgetUsagePercentage} className="h-2" />
      </div>
    </div>
  );
};

export default ProjectFinancials;
