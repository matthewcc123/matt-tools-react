import React from 'react';

export interface ProgressBarProps {
  /** The current progress value (determinate state). Defaults to 0. */
  value?: number;
  /** The maximum progress value. Defaults to 100. */
  max?: number;
  /** When true, runs a continuous loop animation showing active progress without a fixed completion value. */
  isIndeterminate?: boolean;
  /** Sets the status style of the progress bar to match Windows system states. */
  status?: 'normal' | 'paused' | 'error';
  /** Optional class names to style the outer container (e.g., width constraints). */
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value = 0,
  max = 100,
  isIndeterminate = false,
  status = 'normal',
  className = '',
}) => {
  // Bound the percentage between 0% and 100%
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const statusColors = {
    // Fluent Accent Blue (Light/Dark Mode variants)
    normal: 'bg-brand',
    // Neutral Grey for paused streams
    paused: 'bg-[#9e9e9e]',
    // Windows 11 Critical Red
    error: 'bg-[#e81123]',
  };

  return (
    <div 
    className={`w-full ${className} select-none`} 
    role="progressbar" 
    aria-valuenow={isIndeterminate ? undefined : percentage} 
    aria-valuemin={0} 
    aria-valuemax={100}
    >

    <div className="relative w-full h-1 overflow-hidden rounded-full">

      {isIndeterminate ? (
        /*Indeterminate State*/
        <div
        className={`absolute h-full rounded-full animate-winui-indeterminate ${
        status === 'normal' ? 'bg-brand' : statusColors[status]
        }`}
        />
        ) : (
        /*Determinate State*/
        <div className='relative w-full h-full'>
          <hr className="absolute inset-0 my-auto rounded-full bg-stroke"/>
          <div
          className={`absolute h-full rounded-full transition-all duration-300 ease-out ${
          status === 'normal' ? 'bg-brand' : statusColors[status]
          }`}
          style={{ width: `${percentage}%` }}
          />
        </div>
        )}
      </div>

    </div>
  );
};