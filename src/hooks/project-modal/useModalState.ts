
import { useState } from 'react';

export const useModalState = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  return {
    isOpen,
    setIsOpen,
    isSubmitting,
    setIsSubmitting
  };
};
