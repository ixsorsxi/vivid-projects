
import React, { useState, useEffect } from 'react';
import SettingsLayout from './settings/components/SettingsLayout';

const SystemSettings = () => {
  // Get active tab from URL hash or default to 'general'
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'general';
  });

  // Update URL hash when tab changes
  useEffect(() => {
    window.location.hash = activeTab;
  }, [activeTab]);

  return (
    <SettingsLayout activeTab={activeTab} setActiveTab={setActiveTab} />
  );
};

export default SystemSettings;
