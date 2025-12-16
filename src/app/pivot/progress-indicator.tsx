'use client'

import { cn } from '../../lib/utils'

interface ProgressIndicatorProps {
  /** Progress value from 0 to 100 */
  value: number
  /** Size of the indicator in pixels */
  size?: number
  /** Stroke width of the ring */
  strokeWidth?: number
  /** Additional class names */
  className?: string
  /** Whether to show the percentage text */
  showValue?: boolean
}

/**
 * Circular progress indicator with color states
 * - Gray (0%): Not started
 * - Yellow/Amber (1-99%): In progress
 * - Green (100%): Complete
 */
export function ProgressIndicator({
  value,
  size = 48,
  strokeWidth = 4,
  className,
  showValue = true,
}: ProgressIndicatorProps) {
  // Clamp value between 0 and 100
  const progress = Math.min(100, Math.max(0, value))

  // SVG circle calculations
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  // Determine color based on progress
  const getProgressColor = () => {
    if (progress === 0) return 'stroke-muted-foreground/30'
    if (progress === 100) return 'stroke-green-500'
    return 'stroke-amber-500'
  }

  const getBackgroundColor = () => {
    if (progress === 0) return 'stroke-muted/50'
    if (progress === 100) return 'stroke-green-100'
    return 'stroke-amber-100'
  }

  const getTextColor = () => {
    if (progress === 0) return 'text-muted-foreground'
    if (progress === 100) return 'text-green-600'
    return 'text-amber-600'
  }

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Configuration progress: ${progress}%`}
    >
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className={cn('transition-colors duration-300', getBackgroundColor())}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={cn(
            'transition-all duration-500 ease-out',
            getProgressColor(),
            progress > 0 && progress < 100 && 'animate-pulse'
          )}
        />
      </svg>
      {showValue && (
        <span
          className={cn(
            'absolute text-xs font-semibold transition-colors duration-300',
            getTextColor()
          )}
        >
          {progress}%
        </span>
      )}
    </div>
  )
}
