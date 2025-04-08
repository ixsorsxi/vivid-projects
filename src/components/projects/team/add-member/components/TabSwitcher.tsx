
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { debugLog } from '@/utils/debugLogger';

interface TabSwitcherProps {
  activeTab: 'existing' | 'email';
  onTabChange: (tab: 'existing' | 'email') => void;
  disabled?: boolean;
}

const TabSwitcher: React.FC<TabSwitcherProps> = ({ 
  activeTab, 
  onTabChange,
  disabled = false
}) => {
  const handleTabChange = (value: string) => {
    debugLog('TabSwitcher', 'Tab changed to:', value);
    onTabChange(value as 'existing' | 'email');
  };
  
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={disabled ? undefined : handleTabChange} 
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger 
          value="existing" 
          disabled={disabled}
          className={disabled ? 'opacity-50 cursor-not-allowed' : ''}
        >
          System Users
        </TabsTrigger>
        <TabsTrigger 
          value="email" 
          disabled={disabled}
          className={disabled ? 'opacity-50 cursor-not-allowed' : ''}
        >
          Email Invite
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default TabSwitcher;
