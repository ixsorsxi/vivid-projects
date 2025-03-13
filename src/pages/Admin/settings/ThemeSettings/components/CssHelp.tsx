
import React from 'react';

const CssHelp: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="bg-muted p-4 rounded-md">
        <h3 className="font-semibold mb-2">CSS Variables Available</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Default Variables:</p>
            <ul className="text-sm pl-5 list-disc">
              <li><code>--primary-color</code></li>
              <li><code>--background-color</code></li>
              <li><code>--sidebar-color</code></li>
              <li><code>--card-color</code></li>
              <li><code>--border-radius</code></li>
              <li><code>--font-family</code></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium">Example CSS:</p>
            <pre className="text-xs bg-slate-800 text-slate-200 p-2 rounded-md">
              {`.custom-header {\n  background: var(--primary-color);\n  color: white;\n}\n\n.card {\n  border-radius: var(--border-radius);\n}`}
            </pre>
          </div>
        </div>
      </div>
      
      <div className="bg-yellow-50 dark:bg-yellow-950/30 p-4 rounded-md">
        <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Important Notes</h3>
        <ul className="text-sm text-yellow-800 dark:text-yellow-200 pl-5 list-disc">
          <li>Custom CSS changes override system styles and should be used with caution</li>
          <li>Test your changes in both light and dark mode</li>
          <li>Keep selector specificity in mind to avoid unexpected results</li>
          <li>Use browser developer tools to debug CSS issues</li>
        </ul>
      </div>
    </div>
  );
};

export default CssHelp;
