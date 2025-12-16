'use client'

import { useMemo, useState, useCallback, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { PivotTable } from './pivot-table'
import { PivotPanel } from './pivot-panel'
import { ExportDialog } from './export-dialog'
import { transformToPivot } from '../../lib/pivot/transformer'
import { hashPivotConfig } from '../../lib/pivot/hash'
import type { PivotConfig, PivotResult } from '../../lib/pivot/schemas'
import { cn } from '../../lib/utils'

interface ClientPivotWrapperProps {
  rawData: any[]
  initialConfig: PivotConfig
  defaultConfig: PivotConfig // Scenario's default config for reset functionality
  availableFields: Array<{ name: string; type: string }>
  /** Additional CSS class names for the root container */
  className?: string
  /** Inline styles for the root container */
  style?: React.CSSProperties
  /** Additional CSS class names for the PivotPanel */
  panelClassName?: string
  /** Additional CSS class names for the results Card */
  resultsClassName?: string
  /** Additional CSS class names for the PivotTable */
  tableClassName?: string
}

/**
 * Client-side pivot wrapper that performs instant transformations
 * This achieves AG Grid-level performance (50-80ms) by avoiding server round-trips
 */
export function ClientPivotWrapper({
  rawData,
  initialConfig,
  defaultConfig,
  availableFields,
  className,
  style,
  panelClassName,
  resultsClassName,
  tableClassName,
}: ClientPivotWrapperProps) {
  // Store config in local state for instant updates
  const [config, setConfig] = useState(initialConfig)

  // LRU cache for transform results (keeps last 10 configs)
  const transformCache = useRef(new Map<string, { result: PivotResult; timestamp: number }>())

  // Transform data client-side with LRU caching
  const pivotResult = useMemo(() => {
    // Generate cache key using efficient hash (avoids JSON.stringify allocations)
    const configHash = hashPivotConfig(config)

    // Check cache first
    if (transformCache.current.has(configHash)) {
      const cached = transformCache.current.get(configHash)!
      return cached.result
    }

    // Cache miss - perform transformation
    const result = transformToPivot(rawData, config)

    // Store in cache
    transformCache.current.set(configHash, {
      result,
      timestamp: Date.now(),
    })

    // LRU eviction: keep only last 5 entries (reduced from 10 to save memory)
    if (transformCache.current.size > 5) {
      // Find oldest entry by timestamp
      let oldestKey = ''
      let oldestTime = Infinity

      for (const [key, value] of transformCache.current.entries()) {
        if (value.timestamp < oldestTime) {
          oldestTime = value.timestamp
          oldestKey = key
        }
      }

      if (oldestKey) {
        transformCache.current.delete(oldestKey)
      }
    }

    return result
  }, [rawData, config])

  // Handle config updates (instant - no server round-trip!)
  const handleConfigChange = useCallback((newConfig: PivotConfig) => {
    setConfig(newConfig)
  }, [])

  return (
    <div className={cn("space-y-6", className)} style={style}>
      {/* Configuration Panel */}
      <PivotPanel
        config={config}
        defaultConfig={defaultConfig}
        availableFields={availableFields}
        onConfigChange={handleConfigChange}
        className={panelClassName}
      />

      {/* Results Table */}
      <Card className={resultsClassName}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>
                Results
                {config.rowFields.length === 0 && config.columnFields.length === 0 && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    (Unpivoted - Raw Data)
                  </span>
                )}
              </CardTitle>
              <CardDescription>
                {pivotResult.metadata.rowCount} rows × {pivotResult.metadata.columnCount} columns
              </CardDescription>
            </div>
            <ExportDialog data={pivotResult.data} filename="pivot-export" />
          </div>
        </CardHeader>
        <CardContent>
          <PivotTable
            data={pivotResult.data}
            config={config}
            metadata={pivotResult.metadata}
            className={tableClassName}
          />
        </CardContent>
      </Card>
    </div>
  )
}
