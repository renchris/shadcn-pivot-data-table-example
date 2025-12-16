import { Suspense } from 'react'
import { fetchRawData, getAvailableFields } from '@/app/actions/pivot'
import { PivotConfigSchema, type PivotConfig } from '@/lib/pivot/schemas'
import { ScenarioSelector } from '@/components/pivot-table/scenario-selector'
import { DemoPivotWrapper } from './demo-pivot-wrapper'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { getScenario } from '@/lib/pivot/scenarios'

/**
 * Main Pivot Table Page (Server Component)
 * Fetches data and configuration from URL search params
 */
export default async function PivotPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // Await searchParams as it's now a Promise in Next.js 15+
  const params = await searchParams

  // Get selected scenario from URL or use default
  // Note: No server-side redirect here to avoid competing with client-side router.push()
  // The ScenarioSelector component handles initial navigation on mount
  const scenarioId = typeof params.scenario === 'string' ? params.scenario : null
  const scenario = getScenario(scenarioId)

  // Use scenario's default config as base, allow URL params to override
  const config: PivotConfig = {
    rowFields: parseStringArray(params.rows) || scenario.defaultConfig.rowFields,
    columnFields: parseStringArray(params.columns) || scenario.defaultConfig.columnFields,
    valueFields: scenario.defaultConfig.valueFields, // Use scenario's value fields
    options: {
      showRowTotals: parseBoolean(params.showRowTotals, scenario.defaultConfig.options.showRowTotals),
      showColumnTotals: parseBoolean(params.showColumnTotals, scenario.defaultConfig.options.showColumnTotals),
      showGrandTotal: parseBoolean(params.showGrandTotal, scenario.defaultConfig.options.showGrandTotal),
      expandedByDefault: parseBoolean(params.expanded, false),
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

      {/* Scenario Selector */}
      <ScenarioSelector />

      {/* Client-Side Pivot Table with Instant Transformations */}
      <Suspense fallback={<PivotLoadingSkeleton />}>
        <ClientPivotDataFetcher config={validatedConfig} scenario={scenario.id} />
      </Suspense>
    </div>
  )
}

/**
 * Async component to fetch raw data and available fields for client-side pivoting
 * This enables AG Grid-level instant performance (50-80ms)
 */
async function ClientPivotDataFetcher({ config, scenario }: { config: PivotConfig; scenario: string }) {
  // Fetch raw data and fields in parallel for faster load
  const [rawData, availableFields] = await Promise.all([
    fetchRawData(scenario),
    getAvailableFields(scenario),
  ])

  // Get scenario's full config including optimalConfigs for guided setup
  const scenarioConfig = getScenario(scenario)

  return (
    <DemoPivotWrapper
      rawData={rawData}
      initialConfig={config}
      defaultConfig={scenarioConfig.defaultConfig}
      availableFields={availableFields}
      optimalConfigs={scenarioConfig.optimalConfigs}
      businessValue={scenarioConfig.businessValue}
      scenarioId={scenarioConfig.id}
    />
  )
}

/**
 * Loading skeleton for entire pivot page
 */
function PivotLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <PivotPanelSkeleton />
      <PivotTableSkeleton />
    </div>
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
