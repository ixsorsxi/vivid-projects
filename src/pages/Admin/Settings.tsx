
import React, { useState } from 'react';
import SettingsLayout from './settings/components/SettingsLayout';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('general');

  return <SettingsLayout activeTab={activeTab} setActiveTab={setActiveTab} />;
};

export default SystemSettings;
