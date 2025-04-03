
import React from 'react';
import FadeIn from './animations/FadeIn';

interface PageContainerProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const PageContainer = ({ 
  children, 
  title, 
  subtitle,
  actions 
}: PageContainerProps) => {
  return (
    <div className="w-full">
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {subtitle && (
              <p className="text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          
          {actions && (
            <div className="mt-4 sm:mt-0 flex items-center justify-start sm:justify-end gap-2">
              {actions}
            </div>
          )}
        </div>
        
        {children}
      </FadeIn>
    </div>
  );
};

export default PageContainer;
