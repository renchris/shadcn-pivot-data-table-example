import { Suspense } from 'react'
import { executePivot, getAvailableFields } from '@/app/actions/pivot'
import { PivotConfigSchema, type PivotConfig } from '@/lib/pivot/schemas'
import { PivotTable } from '@/components/pivot-table/pivot-table'
import { PivotPanel } from '@/components/pivot-table/pivot-panel'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Main Pivot Table Page (Server Component)
 * Fetches data and configuration from URL search params
 */
export default async function PivotPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Parse configuration from URL parameters
  const config: PivotConfig = {
    rowFields: parseStringArray(searchParams.rows) || ['region'],
    columnFields: parseStringArray(searchParams.columns) || ['quarter'],
    valueFields: [
      {
        field: 'sales',
        aggregation: 'sum',
        label: 'Total Sales',
      },
      {
        field: 'units',
        aggregation: 'sum',
        label: 'Total Units',
      },
    ],
    options: {
      showRowTotals: parseBoolean(searchParams.showRowTotals, true),
      showColumnTotals: parseBoolean(searchParams.showColumnTotals, true),
      showGrandTotal: parseBoolean(searchParams.showGrandTotal, true),
      expandedByDefault: parseBoolean(searchParams.expanded, false),
    },
  }

  // Validate configuration
  const validatedConfig = PivotConfigSchema.parse(config)

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Pivot Table Analysis</h1>
        <p className="text-muted-foreground mt-2">
          Interactive data analysis with drag-and-drop configuration
        </p>
      </div>

      {/* Configuration Panel */}
      <Suspense fallback={<PivotPanelSkeleton />}>
        <PivotPanelWrapper config={validatedConfig} />
      </Suspense>

      {/* Pivot Table */}
      <Suspense fallback={<PivotTableSkeleton />}>
        <PivotDataFetcher config={validatedConfig} />
      </Suspense>
    </div>
  )
}

/**
 * Wrapper component for pivot panel to handle async data fetching
 */
async function PivotPanelWrapper({ config }: { config: PivotConfig }) {
  const availableFields = await getAvailableFields()

  return <PivotPanel initialConfig={config} availableFields={availableFields} />
}

/**
 * Async component to fetch and display pivoted data
 */
async function PivotDataFetcher({ config }: { config: PivotConfig }) {
  const result = await executePivot(config)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Results</CardTitle>
        <CardDescription>
          {result.metadata.rowCount} rows × {result.metadata.columnCount} columns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PivotTable data={result.data} config={config} metadata={result.metadata} />
      </CardContent>
    </Card>
  )
}

/**
 * Loading skeleton for pivot panel
 */
function PivotPanelSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-96 mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </CardContent>
    </Card>
  )
}

/**
 * Loading skeleton for pivot table
 */
function PivotTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-48 mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Helper: Parse comma-separated string into array
 */
function parseStringArray(value: string | string[] | undefined): string[] | undefined {
  if (!value) return undefined
  if (Array.isArray(value)) return value
  return value.split(',').filter(Boolean)
}

/**
 * Helper: Parse boolean from string
 */
function parseBoolean(value: string | string[] | undefined, defaultValue: boolean): boolean {
  if (!value) return defaultValue
  const str = Array.isArray(value) ? value[0] : value
  return str === 'true' || str === '1'
}
