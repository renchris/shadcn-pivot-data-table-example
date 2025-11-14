import { z } from 'zod'

/**
 * Aggregation function types supported by the pivot table
 */
export const AggregationFunctionSchema = z.enum([
  'sum',
  'avg',
  'count',
  'min',
  'max',
  'median',
  'first',
  'last',
])

export type AggregationFunction = z.infer<typeof AggregationFunctionSchema>

/**
 * Configuration for a value field with its aggregation function
 */
export const ValueFieldConfigSchema = z.object({
  field: z.string(),
  aggregation: AggregationFunctionSchema,
  displayName: z.string().optional(),
})

export type ValueFieldConfig = z.infer<typeof ValueFieldConfigSchema>

/**
 * Complete pivot table configuration
 */
export const PivotConfigSchema = z.object({
  // Fields to group by (become row headers)
  rowFields: z.array(z.string()).default([]),

  // Fields to pivot (become column headers)
  columnFields: z.array(z.string()).default([]),

  // Fields to aggregate with their aggregation functions
  valueFields: z.array(ValueFieldConfigSchema).min(1, 'At least one value field is required'),

  // Optional filter configuration
  filters: z.record(z.string(), z.any()).optional(),

  // Configuration options
  options: z.object({
    showRowTotals: z.boolean().default(true),
    showColumnTotals: z.boolean().default(true),
    showGrandTotal: z.boolean().default(true),
    expandedByDefault: z.boolean().default(false),
  }).default({}),
})

export type PivotConfig = z.infer<typeof PivotConfigSchema>

/**
 * Metadata about the pivot result
 */
export const PivotMetadataSchema = z.object({
  rowCount: z.number(),
  columnCount: z.number(),
  uniqueValues: z.record(z.string(), z.array(z.string())),
  totalRows: z.number().optional(),
})

export type PivotMetadata = z.infer<typeof PivotMetadataSchema>

/**
 * Complete pivot result returned from the transformation
 */
export const PivotResultSchema = z.object({
  data: z.array(z.record(z.string(), z.any())),
  metadata: PivotMetadataSchema,
  config: PivotConfigSchema,
})

export type PivotResult = z.infer<typeof PivotResultSchema>

/**
 * Export format options
 */
export const ExportFormatSchema = z.enum(['csv', 'excel', 'json'])

export type ExportFormat = z.infer<typeof ExportFormatSchema>

/**
 * Export configuration
 */
export const ExportConfigSchema = z.object({
  format: ExportFormatSchema,
  includeTotals: z.boolean().default(true),
  filename: z.string().optional(),
})

export type ExportConfig = z.infer<typeof ExportConfigSchema>
