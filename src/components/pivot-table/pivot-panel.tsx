'use client'

import { useState, useCallback, useRef, useEffect, useTransition } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { PivotConfig } from '@/lib/pivot/schemas'
import { DraggableField } from './draggable-field'
import { DropZone } from './drop-zone'
import { ExportDialog } from './export-dialog'
import { Settings2, RefreshCw, Loader2 } from 'lucide-react'

interface PivotPanelProps {
  config: PivotConfig // Controlled component - no longer initialConfig
  availableFields: Array<{ name: string; type: string }>
  onConfigChange: (config: PivotConfig) => void // Required for controlled component
}

export function PivotPanel({ config, availableFields, onConfigChange }: PivotPanelProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  // Debounce timeout ref to prevent multiple rapid URL updates
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup debounce timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])

  // Filter out fields already in use
  const getAvailableFields = useCallback(() => {
    const usedFields = new Set([
      ...config.rowFields,
      ...config.columnFields,
      ...config.valueFields.map(v => v.field),
    ])

    return availableFields.filter(f => !usedFields.has(f.name))
  }, [config, availableFields])

  // Immediate URL update (non-debounced) - used for initial load and reset
  const updateURLImmediate = useCallback((newConfig: PivotConfig) => {
    const params = new URLSearchParams()
    if (newConfig.rowFields.length > 0) {
      params.set('rows', newConfig.rowFields.join(','))
    }
    if (newConfig.columnFields.length > 0) {
      params.set('columns', newConfig.columnFields.join(','))
    }
    params.set('showRowTotals', String(newConfig.options.showRowTotals))
    params.set('showColumnTotals', String(newConfig.options.showColumnTotals))
    params.set('showGrandTotal', String(newConfig.options.showGrandTotal))

    // Wrap in startTransition for loading feedback
    startTransition(() => {
      // Canonical Next.js pattern: pathname + query string
      router.push(pathname + '?' + params.toString())
    })
  }, [router, pathname, startTransition])

  // Debounced URL update - prevents freeze during rapid drag operations
  // Only updates URL after 100ms of no changes (preserves shareable URLs)
  const updateURLDebounced = useCallback((newConfig: PivotConfig) => {
    // Clear any pending timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    // Set new timeout to update URL after 100ms of inactivity
    debounceTimeoutRef.current = setTimeout(() => {
      updateURLImmediate(newConfig)
    }, 100)
  }, [updateURLImmediate])

  // Handle field drop into row fields
  const handleAddRowField = useCallback(
    (fieldName: string, sourceZone?: 'available' | 'rows' | 'columns') => {
      // If already in row fields (dragging within same zone), don't duplicate
      if (sourceZone === 'rows' && config.rowFields.includes(fieldName)) {
        return
      }

      let newConfig = { ...config }

      // Remove from source zone if moving between zones
      if (sourceZone === 'columns') {
        newConfig.columnFields = newConfig.columnFields.filter((f) => f !== fieldName)
      }

      // Add to row fields if not already there
      if (!newConfig.rowFields.includes(fieldName)) {
        newConfig.rowFields = [...newConfig.rowFields, fieldName]
      }

      // Single state update - no more duplicate setConfig
      onConfigChange(newConfig)
      // Debounced server sync for URL updates
      updateURLDebounced(newConfig)
    },
    [config, onConfigChange, updateURLDebounced]
  )

  // Handle field drop into column fields
  const handleAddColumnField = useCallback(
    (fieldName: string, sourceZone?: 'available' | 'rows' | 'columns') => {
      // If already in column fields (dragging within same zone), don't duplicate
      if (sourceZone === 'columns' && config.columnFields.includes(fieldName)) {
        return
      }

      let newConfig = { ...config }

      // Remove from source zone if moving between zones
      if (sourceZone === 'rows') {
        newConfig.rowFields = newConfig.rowFields.filter((f) => f !== fieldName)
      }

      // Add to column fields if not already there
      if (!newConfig.columnFields.includes(fieldName)) {
        newConfig.columnFields = [...newConfig.columnFields, fieldName]
      }

      // Single state update - no more duplicate setConfig
      onConfigChange(newConfig)
      updateURLDebounced(newConfig)
    },
    [config, onConfigChange, updateURLDebounced]
  )

  // Handle field removal
  const handleRemoveField = useCallback((field: string, zone: 'rows' | 'columns') => {
    const newConfig = {
      ...config,
      [zone === 'rows' ? 'rowFields' : 'columnFields']: config[
        zone === 'rows' ? 'rowFields' : 'columnFields'
      ].filter(f => f !== field),
    }
    // Single state update - no more duplicate setConfig
    onConfigChange(newConfig)
    updateURLDebounced(newConfig)
  }, [config, onConfigChange, updateURLDebounced])

  // Reset to default configuration
  const handleReset = useCallback(() => {
    const defaultConfig: PivotConfig = {
      rowFields: ['region'],
      columnFields: ['quarter'],
      valueFields: [
        { field: 'sales', aggregation: 'sum', displayName: 'Total Sales' },
        { field: 'units', aggregation: 'sum', displayName: 'Total Units' },
      ],
      options: {
        showRowTotals: true,
        showColumnTotals: true,
        showGrandTotal: true,
        expandedByDefault: false,
      },
    }
    // Single state update - no more duplicate setConfig
    onConfigChange(defaultConfig)
    // Cancel any pending debounced updates
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }
    updateURLImmediate(defaultConfig) // Immediate update for reset
  }, [onConfigChange, updateURLImmediate])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              Pivot Configuration
              {isPending && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </CardTitle>
            <CardDescription>
              {isPending ? 'Updating pivot table...' : 'Drag fields to configure your pivot table'}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <ExportDialog />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Available Fields */}
        <div>
          <h3 className="text-sm font-medium mb-3">Available Fields</h3>
          <div className="flex flex-wrap gap-2 min-h-[60px] p-3 border-2 border-dashed rounded-lg bg-muted/20">
            {getAvailableFields().length > 0 ? (
              getAvailableFields().map(field => (
                <DraggableField
                  key={field.name}
                  field={field.name}
                  fieldType={field.type}
                  sourceZone="available"
                />
              ))
            ) : (
              <p className="text-sm text-muted-foreground w-full text-center">
                All fields are currently in use
              </p>
            )}
          </div>
        </div>

        <Separator />

        {/* Row Groups */}
        <DropZone
          label="Row Groups"
          description="Fields to group by (rows)"
          fields={config.rowFields}
          onFieldAdd={handleAddRowField}
          onFieldRemove={(field) => handleRemoveField(field, 'rows')}
          zone="rows"
          availableFields={availableFields}
        />

        <Separator />

        {/* Pivot Columns */}
        <DropZone
          label="Pivot Columns"
          description="Fields to pivot (columns)"
          fields={config.columnFields}
          onFieldAdd={handleAddColumnField}
          onFieldRemove={(field) => handleRemoveField(field, 'columns')}
          zone="columns"
          availableFields={availableFields}
        />

        <Separator />

        {/* Value Fields */}
        <div>
          <h3 className="text-sm font-medium mb-2">Value Fields</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Metrics to aggregate
          </p>
          <div className="space-y-2">
            {config.valueFields.map((vf, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 bg-primary/5 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium text-sm">{vf.displayName || vf.field}</div>
                  <div className="text-xs text-muted-foreground">
                    Aggregation: {vf.aggregation.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
