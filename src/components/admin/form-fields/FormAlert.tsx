
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface FormAlertProps {
  mode: 'add' | 'edit';
}

const FormAlert: React.FC<FormAlertProps> = ({ mode }) => {
  if (mode !== 'add') return null;
  
  return (
    <Alert className="bg-muted border-muted-foreground/20 text-sm mt-4">
      <Info className="h-4 w-4 mr-2 text-blue-500" />
      <AlertDescription>
        After creation, the user will receive an email to confirm their account before they can log in.
      </AlertDescription>
    </Alert>
  );
};

export default FormAlert;
