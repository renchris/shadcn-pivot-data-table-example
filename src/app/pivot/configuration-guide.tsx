'use client'

import { useState, useMemo, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Target, Lightbulb } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card'
import { cn } from '../../lib/utils'
import { OptimalConfigCard } from './optimal-config-card'
import type { PivotConfig } from '../../lib/pivot/schemas'
import type { OptimalConfigOption } from '../../lib/pivot/scenarios'

interface ConfigurationGuideProps {
  /** Current pivot configuration */
  currentConfig: PivotConfig
  /** Available optimal configurations for this scenario */
  optimalConfigs: OptimalConfigOption[]
  /** Business value description */
  businessValue?: string
  /** Scenario ID for URL params */
  scenarioId: string
  /** Additional class names */
  className?: string
}

/**
 * Calculate progress toward an optimal configuration
 * Returns percentage (0-100) based on field matches
 */
function calculateProgress(
  currentConfig: PivotConfig,
  optimalConfig: OptimalConfigOption
): number {
  const totalFields =
    optimalConfig.rowFields.length + optimalConfig.columnFields.length

  // If no requirements, consider it complete
  if (totalFields === 0) return 100

  // Check exact match (same fields in same order)
  const rowsMatch =
    JSON.stringify(currentConfig.rowFields) ===
    JSON.stringify(optimalConfig.rowFields)
  const colsMatch =
    JSON.stringify(currentConfig.columnFields) ===
    JSON.stringify(optimalConfig.columnFields)

  if (rowsMatch && colsMatch) return 100

  // Calculate partial progress based on matching fields
  const matchedRows = currentConfig.rowFields.filter((f) =>
    optimalConfig.rowFields.includes(f)
  ).length
  const matchedCols = currentConfig.columnFields.filter((f) =>
    optimalConfig.columnFields.includes(f)
  ).length

  return Math.round(((matchedRows + matchedCols) / totalFields) * 100)
}

/**
 * Configuration Guide Component
 * Shows optimal configurations for the current scenario with progress tracking
 */
export function ConfigurationGuide({
  currentConfig,
  optimalConfigs,
  businessValue,
  scenarioId,
  className,
}: ConfigurationGuideProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [selectedConfigId, setSelectedConfigId] = useState(
    optimalConfigs[0]?.id || ''
  )

  // Calculate progress for all optimal configs
  const progressMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const config of optimalConfigs) {
      map[config.id] = calculateProgress(currentConfig, config)
    }
    return map
  }, [currentConfig, optimalConfigs])

  // Find best matching config (highest progress)
  const bestMatch = useMemo(() => {
    let bestId = optimalConfigs[0]?.id || ''
    let bestProgress = 0
    for (const [id, progress] of Object.entries(progressMap)) {
      if (progress > bestProgress) {
        bestProgress = progress
        bestId = id
      }
    }
    return { id: bestId, progress: bestProgress }
  }, [progressMap, optimalConfigs])

  // Handle applying an optimal configuration
  const handleApplyConfig = useCallback(
    (config: OptimalConfigOption) => {
      const params = new URLSearchParams()
      params.set('scenario', scenarioId)
      if (config.rowFields.length > 0) {
        params.set('rows', config.rowFields.join(','))
      }
      if (config.columnFields.length > 0) {
        params.set('columns', config.columnFields.join(','))
      }
      router.push(pathname + '?' + params.toString())
    },
    [router, pathname, scenarioId]
  )

  if (optimalConfigs.length === 0) {
    return null
  }

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Recommended Configurations</CardTitle>
        </div>
        <CardDescription>
          Try these high-signal configurations to unlock business insights
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Business Value Hint */}
        {businessValue && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-muted">
            <Lightbulb className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">Business Objective:</span>{' '}
              {businessValue}
            </p>
          </div>
        )}

        {/* Optimal Config Cards */}
        <div className="grid gap-3 sm:grid-cols-2">
          {optimalConfigs.map((config) => (
            <OptimalConfigCard
              key={config.id}
              config={config}
              progress={progressMap[config.id] || 0}
              isSelected={selectedConfigId === config.id}
              onSelect={() => setSelectedConfigId(config.id)}
              onApply={() => handleApplyConfig(config)}
            />
          ))}
        </div>

        {/* Overall Progress Summary */}
        {bestMatch.progress > 0 && bestMatch.progress < 100 && (
          <div
            className="text-xs text-center text-muted-foreground animate-in fade-in duration-500"
            aria-live="polite"
          >
            Closest match:{' '}
            <span className="font-medium text-amber-600">
              {bestMatch.progress}% toward{' '}
              {optimalConfigs.find((c) => c.id === bestMatch.id)?.label}
            </span>
          </div>
        )}

        {/* Achievement unlocked message */}
        {bestMatch.progress === 100 && (
          <div
            className="text-xs text-center text-green-600 font-medium animate-in fade-in slide-in-from-bottom-2 duration-500"
            aria-live="polite"
          >
            Configuration matched! View the insights above.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
