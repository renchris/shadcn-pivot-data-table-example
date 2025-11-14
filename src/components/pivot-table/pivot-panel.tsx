'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { Settings2, RefreshCw } from 'lucide-react'

interface PivotPanelProps {
  initialConfig: PivotConfig
  availableFields: Array<{ name: string; type: string }>
}

export function PivotPanel({ initialConfig, availableFields }: PivotPanelProps) {
  const router = useRouter()
  const [config, setConfig] = useState(initialConfig)

  // Filter out fields already in use
  const getAvailableFields = () => {
    const usedFields = new Set([
      ...config.rowFields,
      ...config.columnFields,
      ...config.valueFields.map(v => v.field),
    ])

    return availableFields.filter(f => !usedFields.has(f.name))
  }

  // Handle field drop into row fields
  const handleAddRowField = (fieldName: string) => {
    const newConfig = {
      ...config,
      rowFields: [...config.rowFields, fieldName],
    }
    setConfig(newConfig)
    updateURL(newConfig)
  }

  // Handle field drop into column fields
  const handleAddColumnField = (fieldName: string) => {
    const newConfig = {
      ...config,
      columnFields: [...config.columnFields, fieldName],
    }
    setConfig(newConfig)
    updateURL(newConfig)
  }

  // Handle field removal
  const handleRemoveField = (field: string, zone: 'rows' | 'columns') => {
    const newConfig = {
      ...config,
      [zone === 'rows' ? 'rowFields' : 'columnFields']: config[
        zone === 'rows' ? 'rowFields' : 'columnFields'
      ].filter(f => f !== field),
    }
    setConfig(newConfig)
    updateURL(newConfig)
  }

  // Update URL to trigger server component re-render
  const updateURL = (newConfig: PivotConfig) => {
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

    router.push(`/pivot?${params.toString()}`)
  }

  // Reset to default configuration
  const handleReset = () => {
    const defaultConfig: PivotConfig = {
      rowFields: ['region'],
      columnFields: ['quarter'],
      valueFields: [
        { field: 'sales', aggregation: 'sum', label: 'Total Sales' },
        { field: 'units', aggregation: 'sum', label: 'Total Units' },
      ],
      options: {
        showRowTotals: true,
        showColumnTotals: true,
        showGrandTotal: true,
        expandedByDefault: false,
      },
    }
    setConfig(defaultConfig)
    updateURL(defaultConfig)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              Pivot Configuration
            </CardTitle>
            <CardDescription>
              Drag fields to configure your pivot table
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
                  <div className="font-medium text-sm">{vf.label || vf.field}</div>
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
