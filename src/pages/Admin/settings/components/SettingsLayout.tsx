
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import { SettingsProvider } from '../context/SettingsContext';
import SettingsTabs from './SettingsTabs';

interface SettingsLayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({ 
  activeTab, 
  setActiveTab 
}) => {
  return (
    <AdminLayout title="System Settings" currentTab="settings">
      <SettingsProvider>
        <SettingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </SettingsProvider>
    </AdminLayout>
  );
};

export default SettingsLayout;
