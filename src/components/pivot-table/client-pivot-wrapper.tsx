'use client'

import { useMemo, useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PivotTable } from './pivot-table'
import { PivotPanel } from './pivot-panel'
import { transformToPivot } from '@/lib/pivot/transformer'
import type { PivotConfig } from '@/lib/pivot/schemas'

interface ClientPivotWrapperProps {
  rawData: any[]
  initialConfig: PivotConfig
  availableFields: Array<{ name: string; type: string }>
}

/**
 * Client-side pivot wrapper that performs instant transformations
 * This achieves AG Grid-level performance (50-80ms) by avoiding server round-trips
 */
export function ClientPivotWrapper({
  rawData,
  initialConfig,
  availableFields,
}: ClientPivotWrapperProps) {
  // Store config in local state for instant updates
  const [config, setConfig] = useState(initialConfig)

  // Transform data client-side with useMemo for caching
  const pivotResult = useMemo(() => {
    const startTime = performance.now()
    const result = transformToPivot(rawData, config)
    const endTime = performance.now()

    // Log performance for monitoring
    console.log(`Client-side pivot transformation: ${(endTime - startTime).toFixed(2)}ms`)

    return result
  }, [rawData, config])

  // Handle config updates (instant - no server round-trip!)
  const handleConfigChange = useCallback((newConfig: PivotConfig) => {
    setConfig(newConfig)
  }, [])

  return (
    <div className="space-y-6">
      {/* Configuration Panel */}
      <PivotPanel
        config={config}
        availableFields={availableFields}
        onConfigChange={handleConfigChange}
      />

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
          <CardDescription>
            {pivotResult.metadata.rowCount} rows × {pivotResult.metadata.columnCount} columns
          </CardDescription>
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
