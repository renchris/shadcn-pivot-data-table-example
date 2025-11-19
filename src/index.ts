/**
 * @packageDocumentation
 * Enterprise Pivot Table Library
 *
 * A production-ready pivot table component with modern React architecture,
 * featuring server-side transformation, drag-and-drop configuration, and
 * virtual scrolling for large datasets.
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
// React Components (Styled with Shadcn UI)
// ============================================================================

export { PivotTable } from './components/pivot-table/pivot-table'
export { PivotPanel } from './components/pivot-table/pivot-panel'
export { ClientPivotWrapper } from './components/pivot-table/client-pivot-wrapper'
export { DraggableField } from './components/pivot-table/draggable-field'
export { DropZone } from './components/pivot-table/drop-zone'
export { ExportDialog } from './components/pivot-table/export-dialog'

// ============================================================================
// UI Components (Shadcn UI - Re-exported for convenience)
// ============================================================================

export { Button } from './components/ui/button'
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './components/ui/card'
export { Checkbox } from './components/ui/checkbox'
export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './components/ui/dialog'
export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from './components/ui/dropdown-menu'
export { Input } from './components/ui/input'
export { Label } from './components/ui/label'
export { RadioGroup, RadioGroupItem } from './components/ui/radio-group'
export { ScrollArea } from './components/ui/scroll-area'
export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './components/ui/select'
export { Separator } from './components/ui/separator'
export { Skeleton } from './components/ui/skeleton'
export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from './components/ui/table'
export { Badge } from './components/ui/badge'

// ============================================================================
// Utilities
// ============================================================================

export { cn } from './lib/utils'
