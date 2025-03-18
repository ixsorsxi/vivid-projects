
import React from 'react';

interface StatsCardProps {
  title: string;
  count: number;
  total?: number;
  percentage: number;
  badgeText: string;
  badgeColorClass: string;
  children?: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  count, 
  total, 
  percentage, 
  badgeText, 
  badgeColorClass,
  children 
}) => {
  return (
    <div className="glass-card p-5 rounded-xl hover-lift">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-base">{title}</h3>
        <span className={`rounded-full ${badgeColorClass} text-xs font-medium px-2.5 py-0.5`}>
          {badgeText}
        </span>
      </div>
      <p className="text-3xl font-bold mt-2">{percentage}%</p>
      {total ? (
        <p className="text-muted-foreground text-sm mt-1">
          {count} of {total} {title.toLowerCase()}
        </p>
      ) : (
        <p className="text-muted-foreground text-sm mt-1">
          {count} {title.toLowerCase()}
        </p>
      )}
      {children}
    </div>
  );
};

export default StatsCard;
