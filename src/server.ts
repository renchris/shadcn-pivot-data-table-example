/**
 * @packageDocumentation
 * Enterprise Pivot Table - Server-Side Utilities
 *
 * Server-specific exports for Next.js Server Components and Server Actions.
 * Requires Next.js 13+ with App Router.
 */

// ============================================================================
// Core Transformation (Re-exported for convenience)
// ============================================================================

export {
  transformToPivot,
  generateColumnKey,
  parseColumnKey,
} from './lib/pivot/transformer'

// ============================================================================
// Export Utilities
// ============================================================================

export {
  exportPivotData,
  generateCSV,
  generateExcel,
  getUniqueFieldValues,
  getAvailableFields,
} from './lib/pivot/export'

// ============================================================================
// Schemas (Re-exported for validation in Server Actions)
// ============================================================================

export {
  PivotConfigSchema,
  PivotResultSchema,
  type PivotConfig,
  type PivotResult,
  type ExportFormat,
  type ExportConfig,
} from './lib/pivot/schemas'

// ============================================================================
// Types (Re-exported for server-side usage)
// ============================================================================

export type {
  PivotRow,
  FieldDefinition,
  AggregationFn,
} from './lib/pivot/types'

/**
 * Example Server Action for Next.js
 *
 * Create a file in your app/actions/pivot.ts:
 *
 * ```typescript
 * 'use server'
 *
 * import { cache } from 'react'
 * import { transformToPivot, PivotConfigSchema, type PivotConfig, type PivotResult } from '@/pivot-table/server'
 *
 * export const executePivot = cache(async (config: unknown): Promise<PivotResult> => {
 *   // Validate configuration
 *   const validatedConfig = PivotConfigSchema.parse(config)
 *
 *   // Fetch data from your database/API
 *   const rawData = await db.query('SELECT * FROM sales_data')
 *
 *   // Transform to pivot
 *   return transformToPivot(rawData, validatedConfig)
 * })
 * ```
 */
