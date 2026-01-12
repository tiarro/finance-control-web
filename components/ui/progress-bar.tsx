import React from 'react';

interface ProgressBarProps {
  value: number; // Current usage value
  max: number; // Maximum budget value
  label: string; // Category label
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, max, label, className = '' }) => {
  const percentage = max > 0 ? Math.min(100, (value / max) * 100) : 0;

  // Determine color based on percentage
  let colorClass = '';
  let textColorClass = '';

  if (percentage < 50) {
    colorClass = 'bg-green-500';
    textColorClass = 'text-green-600 dark:text-green-400';
  } else if (percentage >= 50 && percentage < 80) {
    colorClass = 'bg-yellow-500';
    textColorClass = 'text-yellow-600 dark:text-yellow-400';
  } else if (percentage >= 80) {
    colorClass = 'bg-red-500';
    textColorClass = 'text-red-600 dark:text-red-400';
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <span className={`text-sm font-medium ${textColorClass}`}>
          {percentage.toFixed(1)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
        <div
          className={`h-4 rounded-full transition-all duration-300 ease-in-out ${colorClass}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;