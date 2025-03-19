
import { useState } from 'react';

export const useBasicDetails = () => {
  // Basic project details
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectCategory, setProjectCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [projectCode, setProjectCode] = useState('');
  
  // Advanced project details
  const [budget, setBudget] = useState('');
  const [currency, setCurrency] = useState('USD');

  const generateProjectCode = () => {
    const random = Math.floor(1000 + Math.random() * 9000);
    setProjectCode(`PRJ-${random}`);
  };

  return {
    projectName,
    setProjectName,
    projectDescription,
    setProjectDescription,
    projectCategory,
    setProjectCategory,
    dueDate,
    setDueDate,
    isPrivate,
    setIsPrivate,
    projectCode,
    setProjectCode,
    budget,
    setBudget,
    currency,
    setCurrency,
    generateProjectCode
  };
};
