/**
 * @packageDocumentation
 * Enterprise Pivot Table - Headless Core
 *
 * Framework-agnostic pivot transformation engine.
 * Use this export if you want to build your own UI or use a different framework.
 */

// ============================================================================
// Core Pivot Transformation
// ============================================================================

export {
  transformToPivot,
  generateColumnKey,
  parseColumnKey,
} from './lib/pivot/transformer'

// ============================================================================
// Schemas & Validation
// ============================================================================

export {
  PivotConfigSchema,
  PivotResultSchema,
  PivotMetadataSchema,
  ValueFieldConfigSchema,
  AggregationFunctionSchema,
  ExportFormatSchema,
  ExportConfigSchema,
  type PivotConfig,
  type PivotResult,
  type PivotMetadata,
  type ValueFieldConfig,
  type AggregationFunction,
  type ExportFormat,
  type ExportConfig,
} from './lib/pivot/schemas'

// ============================================================================
// Types
// ============================================================================

export type {
  PivotRow,
  FieldDefinition,
  DropZoneType,
  DragData,
  PivotState,
  ColumnGroup,
  TransformOptions,
  CellValue,
  AggregationFn,
  AggregationFunctions,
  FormatFn,
  Formatters,
  UniqueValues,
  GroupedData,
} from './lib/pivot/types'

// ============================================================================
// Aggregation Functions
// ============================================================================

export {
  sum,
  avg,
  count,
  min,
  max,
  median,
  first,
  last,
  aggregationFunctions,
  getAggregationFunction,
  aggregate,
  formatAggregationName,
} from './lib/pivot/aggregations'

// ============================================================================
// Utilities
// ============================================================================

export { cn } from './lib/utils'
