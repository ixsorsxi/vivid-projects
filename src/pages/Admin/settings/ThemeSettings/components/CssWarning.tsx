
import React from 'react';

const CssWarning: React.FC = () => {
  return (
    <div className="p-4 bg-yellow-50 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-200 rounded-md mt-4">
      <p className="text-sm">
        <strong>Note:</strong> Custom CSS changes may override system styles and 
        should be used with caution. Incorrect CSS can break the application layout.
      </p>
    </div>
  );
};

export default CssWarning;
