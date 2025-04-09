
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './card';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState = ({
  title,
  description,
  icon,
  action,
  className = '',
}: EmptyStateProps) => {
  return (
    <Card className={`w-full border-dashed ${className}`}>
      <CardHeader className="flex items-center justify-center space-y-2 border-b border-dashed p-6">
        {icon && <div className="text-muted-foreground">{icon}</div>}
        <CardTitle className="text-xl font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      </CardContent>
      {action && (
        <CardFooter className="flex items-center justify-center border-t border-dashed p-6">
          {action}
        </CardFooter>
      )}
    </Card>
  );
};
