'use client'

import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { cn } from '../../lib/utils'
import { ProgressIndicator } from './progress-indicator'
import type { OptimalConfigOption } from '../../lib/pivot/scenarios'

interface OptimalConfigCardProps {
  config: OptimalConfigOption
  progress: number
  isSelected: boolean
  onSelect: () => void
  onApply: () => void
  className?: string
}

/**
 * Card showing a single optimal configuration option
 * with progress toward matching and apply button
 */
export function OptimalConfigCard({
  config,
  progress,
  isSelected,
  onSelect,
  onApply,
  className,
}: OptimalConfigCardProps) {
  const isComplete = progress === 100

  return (
    <div
      className={cn(
        'relative p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer',
        isSelected
          ? 'border-primary bg-primary/5 shadow-sm'
          : 'border-muted hover:border-muted-foreground/50',
        isComplete && isSelected && 'border-green-500 bg-green-50/50',
        className
      )}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect()
        }
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-sm truncate">{config.label}</h4>
            {isComplete && (
              <Badge variant="default" className="bg-green-500 text-white text-[10px] px-1.5 py-0">
                <CheckCircle2 className="h-3 w-3 mr-0.5" />
                Complete
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {config.description}
          </p>
        </div>
        <ProgressIndicator value={progress} size={40} strokeWidth={3} />
      </div>

      {/* Field Configuration Preview */}
      <div className="mt-3 space-y-1.5">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground w-16">Rows:</span>
          <div className="flex flex-wrap gap-1">
            {config.rowFields.length > 0 ? (
              config.rowFields.map((field) => (
                <Badge key={field} variant="outline" className="text-[10px] px-1.5 py-0">
                  {field}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground italic">none</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground w-16">Columns:</span>
          <div className="flex flex-wrap gap-1">
            {config.columnFields.length > 0 ? (
              config.columnFields.map((field) => (
                <Badge key={field} variant="outline" className="text-[10px] px-1.5 py-0">
                  {field}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground italic">none</span>
            )}
          </div>
        </div>
      </div>

      {/* Achievement Message (shown when complete) */}
      {isComplete && isSelected && (
        <div
          className="mt-3 p-2.5 rounded-md bg-green-100 border border-green-200 animate-in fade-in slide-in-from-bottom-2 duration-300"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-green-800 leading-relaxed">
              {config.achievementMessage}
            </p>
          </div>
        </div>
      )}

      {/* Apply Button */}
      {isSelected && !isComplete && (
        <Button
          variant="outline"
          size="sm"
          className="mt-3 w-full text-xs"
          onClick={(e) => {
            e.stopPropagation()
            onApply()
          }}
        >
          Apply This Config
          <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      )}
    </div>
  )
}
