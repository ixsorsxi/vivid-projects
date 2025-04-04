
import React from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const AuthAlert = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Alert variant="destructive" className="mb-6 bg-destructive/10 border-destructive/20">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <div className="ml-3 flex-1">
            <AlertTitle className="mb-1 font-semibold">Authentication Required</AlertTitle>
            <AlertDescription className="text-sm text-destructive-foreground/80">
              You're using the application without authentication. Sign in to access all features and save your progress.
            </AlertDescription>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" className="flex items-center gap-1.5" variant="destructive">
                Sign In 
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
              <Button size="sm" variant="outline" className="text-destructive-foreground bg-background/80">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </Alert>
    </motion.div>
  );
};

export default AuthAlert;
