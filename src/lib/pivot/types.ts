import type { ColumnDef } from '@tanstack/react-table'
import type { AggregationFunction, PivotConfig, ValueFieldConfig } from './schemas'

/**
 * Row data with pivot markers
 * Supports hierarchical structure with parent-child relationships
 */
export interface PivotRow extends Record<string, any> {
  __id?: string
  __isSubtotal?: boolean
  __isGrandTotal?: boolean
  __level?: number
  __groupKey?: string
  __expanded?: boolean
  __parentKey?: string // Track parent row for hierarchical relationships
  subRows?: PivotRow[] // Child rows for hierarchical grouping (TanStack Table native format)
}

/**
 * Field definition for available fields
 */
export interface FieldDefinition {
  name: string
  label: string
  type: 'string' | 'number' | 'date' | 'boolean'
  format?: string
}

/**
 * Aggregation function signature
 */
export type AggregationFn<T = any> = (values: T[]) => T | number | null

/**
 * Map of aggregation functions
 */
export type AggregationFunctions = Record<AggregationFunction, AggregationFn>

/**
 * Column group structure for hierarchical headers
 */
export interface ColumnGroup {
  id: string
  label: string
  columns: Array<ColumnDef<PivotRow> | ColumnGroup>
  level: number
}

/**
 * Pivot transformation options
 */
export interface TransformOptions {
  maxColumns?: number
  maxRows?: number
  sortBy?: {
    field: string
    direction: 'asc' | 'desc'
  }[]
}

/**
 * Unique value extraction result
 */
export interface UniqueValues {
  [field: string]: Set<string | number>
}

/**
 * Grouped data structure
 */
export interface GroupedData {
  key: string
  values: Record<string, any>[]
  children?: GroupedData[]
  level: number
}

/**
 * Cell value with metadata
 */
export interface CellValue {
  value: any
  rawValues: any[]
  count: number
  aggregation: AggregationFunction
}

/**
 * Drop zone types for drag and drop
 */
export type DropZoneType = 'rows' | 'columns' | 'values' | 'filters' | 'available'

/**
 * Drag data for field configuration
 */
export interface DragData {
  field: string
  source: DropZoneType
  valueConfig?: ValueFieldConfig
}

/**
 * Pivot state for UI components
 */
export interface PivotState {
  config: PivotConfig
  expandedGroups: Set<string>
  selectedCells: Set<string>
  isLoading: boolean
  error: Error | null
}

/**
 * Format functions for different data types
 */
export type FormatFn = (value: any) => string

export interface Formatters {
  number: FormatFn
  currency: FormatFn
  percentage: FormatFn
  date: FormatFn
}
