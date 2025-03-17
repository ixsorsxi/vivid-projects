
import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface UserDialogHeaderProps {
  title: string;
  description: string;
}

const UserDialogHeader: React.FC<UserDialogHeaderProps> = ({ title, description }) => {
  return (
    <DialogHeader>
      <DialogTitle className="text-foreground">{title}</DialogTitle>
      <DialogDescription>{description}</DialogDescription>
    </DialogHeader>
  );
};

export default UserDialogHeader;
