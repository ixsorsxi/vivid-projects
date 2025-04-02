
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface RoleBadgeProps {
  role: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * A component for displaying user roles with consistent styling
 */
export const RoleBadge: React.FC<RoleBadgeProps> = ({ role, size = 'md' }) => {
  const getRoleColor = (role: string = '') => {
    const normalizedRole = role.toLowerCase();
    
    if (normalizedRole.includes('manager') || normalizedRole.includes('project manager')) {
      return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
    }
    if (normalizedRole.includes('develop') || normalizedRole.includes('engineer') || normalizedRole.includes('programmer')) {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    }
    if (normalizedRole.includes('design')) {
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
    }
    if (normalizedRole.includes('qa') || normalizedRole.includes('test')) {
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    }
    if (normalizedRole.includes('analyst') || normalizedRole.includes('business')) {
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
    }
    // Default style
    return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
  };

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2 py-0.5',
    lg: 'text-sm px-2.5 py-1'
  };

  const colorClasses = getRoleColor(role);
  
  return (
    <span className={`inline-flex rounded-full ${colorClasses} ${sizeClasses[size]}`}>
      {role}
    </span>
  );
};

export default RoleBadge;
