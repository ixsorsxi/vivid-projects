
import React from 'react';
import { Button } from "@/components/ui/button";

interface TabSwitcherProps {
  activeTab: 'existing' | 'email';
  onTabChange: (tab: 'existing' | 'email') => void;
}

const TabSwitcher: React.FC<TabSwitcherProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="grid grid-cols-2 gap-2 mb-4">
      <Button
        type="button"
        variant={activeTab === 'existing' ? 'default' : 'outline'}
        className="w-full"
        onClick={() => onTabChange('existing')}
      >
        Search Users
      </Button>
      <Button
        type="button"
        variant={activeTab === 'email' ? 'default' : 'outline'} 
        className="w-full"
        onClick={() => onTabChange('email')}
      >
        Invite by Email
      </Button>
    </div>
  );
};

export default TabSwitcher;
