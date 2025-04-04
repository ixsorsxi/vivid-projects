
import React from 'react';
import { motion } from 'framer-motion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoCircled } from '@/components/ui/icons';

const RestrictedRegistrationAlert = () => {
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="mt-6">
      <Alert className="bg-muted/50 border border-muted text-sm">
        <div className="flex items-start">
          <InfoCircled className="h-4 w-4 text-muted-foreground mr-2 mt-0.5" />
          <AlertDescription className="text-muted-foreground">
            Account creation is restricted to administrators only. Please contact your system administrator to request an account.
          </AlertDescription>
        </div>
      </Alert>
    </motion.div>
  );
};

export default RestrictedRegistrationAlert;
