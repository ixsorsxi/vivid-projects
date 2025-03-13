
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { SettingsProvider } from './settings/context/SettingsContext';
import SettingsTabs from './settings/components/SettingsTabs';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <AdminLayout title="System Settings" currentTab="settings">
      <SettingsProvider>
        <SettingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </SettingsProvider>
    </AdminLayout>
  );
};

export default SystemSettings;
