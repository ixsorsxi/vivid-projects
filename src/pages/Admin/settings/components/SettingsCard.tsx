
import React, { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SettingsCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  onSave: () => void;
  saveButtonText?: string;
  footer?: ReactNode;
}

const SettingsCard: React.FC<SettingsCardProps> = ({
  title,
  description,
  children,
  onSave,
  saveButtonText = "Save Changes",
  footer
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      <CardFooter className="flex justify-between">
        {footer || (
          <Button onClick={onSave}>{saveButtonText}</Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SettingsCard;
