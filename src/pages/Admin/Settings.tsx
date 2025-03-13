
import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import SettingsLayout from './settings/components/SettingsLayout';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <AdminLayout title="System Settings" currentTab="settings">
      <SettingsLayout activeTab={activeTab} setActiveTab={setActiveTab} />
    </AdminLayout>
  );
};

export default SystemSettings;
