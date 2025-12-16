'use client'

import { useMemo, useState, useCallback, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { PivotTable } from '../../components/pivot-table/pivot-table'
import { PivotPanel } from '../../components/pivot-table/pivot-panel'
import { ExportDialog } from '../../components/pivot-table/export-dialog'
import { ConfigurationGuide } from './configuration-guide'
import { transformToPivot } from '../../lib/pivot/transformer'
import type { PivotConfig, PivotResult } from '../../lib/pivot/schemas'
import type { OptimalConfigOption } from '../../lib/pivot/scenarios'

interface DemoPivotWrapperProps {
  rawData: any[]
  initialConfig: PivotConfig
  defaultConfig: PivotConfig // Scenario's default config for reset functionality
  availableFields: Array<{ name: string; type: string }>
  optimalConfigs: OptimalConfigOption[]
  businessValue?: string
  scenarioId: string
}

/**
 * Demo-specific pivot wrapper that includes ConfigurationGuide
 * This component is specific to the /pivot demo page and includes
 * the configuration guidance feature for showcasing optimal setups
 */
export function DemoPivotWrapper({
  rawData,
  initialConfig,
  defaultConfig,
  availableFields,
  optimalConfigs,
  businessValue,
  scenarioId,
}: DemoPivotWrapperProps) {
  // Store config in local state for instant updates
  const [config, setConfig] = useState(initialConfig)

  // Sync state when initialConfig changes (e.g., from "Apply Config" URL navigation)
  useEffect(() => {
    setConfig(initialConfig)
  }, [initialConfig])

  // LRU cache for transform results (keeps last 10 configs)
  const transformCache = useRef(new Map<string, { result: PivotResult; timestamp: number }>())

  // Transform data client-side with LRU caching
  const pivotResult = useMemo(() => {
    // Generate cache key from config
    const configHash = JSON.stringify(config)

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

    // LRU eviction: keep only last 10 entries
    if (transformCache.current.size > 10) {
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
    <div className="space-y-6">
      {/* Configuration Guide - Shows optimal configs + progress */}
      <ConfigurationGuide
        currentConfig={config}
        optimalConfigs={optimalConfigs}
        businessValue={businessValue}
        scenarioId={scenarioId}
      />

      {/* Configuration Panel */}
      <PivotPanel
        config={config}
        defaultConfig={defaultConfig}
        availableFields={availableFields}
        onConfigChange={handleConfigChange}
      />

      {/* Results Table */}
      <Card>
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
          />
        </CardContent>
      </Card>
    </div>
  )
}
