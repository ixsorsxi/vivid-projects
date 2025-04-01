
import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

interface ProjectPerformanceGaugeProps {
  performanceIndex: number;
}

const ProjectPerformanceGauge: React.FC<ProjectPerformanceGaugeProps> = ({ 
  performanceIndex = 1.0
}) => {
  // Calculate performance categories
  const behindSchedule = Math.max(0, Math.min(1, 1 - performanceIndex));
  const onTrack = Math.max(0, Math.min(1, performanceIndex));
  
  const data = [
    { name: performanceIndex < 1 ? 'Behind Schedule' : 'On Track', value: 1 }
  ];
  
  // Determine color based on performance index
  const getColor = () => {
    if (performanceIndex >= 1.1) return '#10b981'; // Green for ahead of schedule
    if (performanceIndex >= 0.9) return '#0ea5e9'; // Blue for on track
    if (performanceIndex >= 0.7) return '#f59e0b'; // Amber for slightly behind
    return '#ef4444'; // Red for significantly behind
  };
  
  const performanceStatus = () => {
    if (performanceIndex >= 1.1) return 'Ahead of Schedule';
    if (performanceIndex >= 0.9) return 'On Track';
    if (performanceIndex >= 0.7) return 'Slightly Behind';
    return 'Behind Schedule';
  };
  
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-base border-b pb-2">Performance Index</h3>
      
      <div className="flex flex-col items-center justify-center p-4">
        <div className="w-40 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                startAngle={180}
                endAngle={0}
                innerRadius={40}
                outerRadius={80}
                paddingAngle={0}
                dataKey="value"
              >
                <Cell fill={getColor()} />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="text-center mt-2">
          <div className="text-3xl font-bold" style={{ color: getColor() }}>
            {performanceIndex.toFixed(2)}
          </div>
          <div className="text-sm font-medium mt-1" style={{ color: getColor() }}>
            {performanceStatus()}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Performance Index (PI)
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPerformanceGauge;
