# API Reference

## Entry Points

The library provides three entry points for different use cases:

```typescript
// Main entry - Full featured with styled components
import { transformToPivot, PivotTable, PivotPanel } from 'shadcn-pivot-table'

// Headless entry - Core transformation only (framework-agnostic)
import { transformToPivot, aggregate } from 'shadcn-pivot-table/headless'

// Server entry - For Next.js Server Components
import { transformToPivot, exportPivotData } from 'shadcn-pivot-table/server'
```

---

## Core API

### `transformToPivot(rawData, config)`

Main pivot transformation function that converts raw data into pivoted format.

**Parameters:**
- `rawData: any[]` - Array of data objects to transform
- `config: PivotConfig` - Pivot configuration

**Returns:** `PivotResult`

**Example:**
```typescript
const rawData = [
  { region: 'North', product: 'A', sales: 100, units: 10 },
  { region: 'North', product: 'B', sales: 150, units: 15 },
  { region: 'South', product: 'A', sales: 200, units: 20 },
]

const config: PivotConfig = {
  rowFields: ['region'],
  columnFields: ['product'],
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

const result = transformToPivot(rawData, config)
```

---

## Type Definitions

### `PivotConfig`

Complete configuration for pivot table transformation.

```typescript
interface PivotConfig {
  /** Fields to group by (become row headers) */
  rowFields: string[]
  /** Fields to pivot (become column headers) */
  columnFields: string[]
  /** Fields to aggregate with their aggregation functions */
  valueFields: ValueFieldConfig[]
  /** Optional filter configuration */
  filters?: Record<string, any>
  /** Display and behavior options */
  options: {
    showRowTotals: boolean
    showColumnTotals: boolean
    showGrandTotal: boolean
    expandedByDefault: boolean
  }
}
```

### `ValueFieldConfig`

Configuration for a value field with its aggregation function.

```typescript
interface ValueFieldConfig {
  /** Field name from the raw data */
  field: string
  /** Aggregation function to apply */
  aggregation: AggregationFunction
  /** Optional display name for the column header */
  displayName?: string
}
```

### `AggregationFunction`

Supported aggregation functions:

```typescript
type AggregationFunction =
  | 'sum'     // Add all values
  | 'avg'     // Calculate mean
  | 'count'   // Count non-null values
  | 'min'     // Find minimum value
  | 'max'     // Find maximum value
  | 'median'  // Calculate median
  | 'first'   // Take first value
  | 'last'    // Take last value
```

### `PivotResult`

Result returned from transformation.

```typescript
interface PivotResult {
  /** Transformed pivot data */
  data: PivotRow[]
  /** Metadata about the result */
  metadata: PivotMetadata
  /** Configuration used for transformation */
  config: PivotConfig
}
```

### `PivotMetadata`

Metadata about the pivot result.

```typescript
interface PivotMetadata {
  /** Number of rows in the result */
  rowCount: number
  /** Number of columns in the result */
  columnCount: number
  /** Unique values for each pivot field */
  uniqueValues: Record<string, string[]>
  /** Optional total number of source rows */
  totalRows?: number
}
```

---

## React Components

### `<PivotTable />`

Renders a virtualized pivot table with TanStack Table.

**Props:**
```typescript
interface PivotTableProps {
  /** Transformed pivot data rows */
  data: PivotRow[]
  /** Pivot configuration used for the transformation */
  config: PivotConfig
  /** Metadata about the pivot result */
  metadata: PivotMetadata
}
```

**Features:**
- Virtual scrolling for 100K+ rows
- Dynamic column generation
- Hierarchical row grouping with indentation
- Styled subtotals and grand totals

**Example:**
```tsx
import { transformToPivot, PivotTable } from 'shadcn-pivot-table'

const result = transformToPivot(rawData, config)

<PivotTable
  data={result.data}
  config={result.config}
  metadata={result.metadata}
/>
```

### `<PivotPanel />`

Configuration panel with drag-and-drop field management.

**Props:**
```typescript
interface PivotPanelProps {
  /** Current pivot configuration (controlled component) */
  config: PivotConfig
  /** Available fields from the data source */
  availableFields: Array<{ name: string; type: string }>
  /** Callback when configuration changes */
  onConfigChange: (config: PivotConfig) => void
}
```

**Example:**
```tsx
import { PivotPanel } from 'shadcn-pivot-table'

<PivotPanel
  config={config}
  availableFields={[
    { name: 'region', type: 'string' },
    { name: 'product', type: 'string' },
    { name: 'sales', type: 'number' },
  ]}
  onConfigChange={(newConfig) => setConfig(newConfig)}
/>
```

### `<ClientPivotWrapper />`

Client-side wrapper for instant pivot transformations (AG Grid-level performance).

**Props:**
```typescript
interface ClientPivotWrapperProps {
  /** Raw data array */
  rawData: any[]
  /** Initial pivot configuration */
  initialConfig: PivotConfig
  /** Available fields from the data source */
  availableFields: Array<{ name: string; type: string }>
}
```

**Example:**
```tsx
import { ClientPivotWrapper } from 'shadcn-pivot-table'

<ClientPivotWrapper
  rawData={salesData}
  initialConfig={defaultConfig}
  availableFields={fields}
/>
```

### `<ExportDialog />`

Export dialog for downloading pivot data in CSV, Excel, or JSON format.

**Props:**
```typescript
interface ExportDialogProps {
  /** Pivot data to export */
  data: any[]
  /** Optional filename (without extension) */
  filename?: string
}
```

**Example:**
```tsx
import { ExportDialog } from 'shadcn-pivot-table'

<ExportDialog data={result.data} filename="sales-pivot" />
```

---

## Aggregation Functions

### `aggregate(values, aggregation)`

Apply an aggregation function to an array of values.

**Parameters:**
- `values: any[]` - Array of values to aggregate
- `aggregation: AggregationFunction` - Aggregation function name

**Returns:** `number | null`

**Example:**
```typescript
import { aggregate } from 'shadcn-pivot-table'

const total = aggregate([10, 20, 30], 'sum')     // 60
const avg = aggregate([10, 20, 30], 'avg')       // 20
const max = aggregate([10, 20, 30], 'max')       // 30
```

### Individual Aggregation Functions

```typescript
import { sum, avg, count, min, max, median, first, last } from 'shadcn-pivot-table'

const values = [10, 20, 30, 40, 50]

sum(values)     // 150
avg(values)     // 30
count(values)   // 5
min(values)     // 10
max(values)     // 50
median(values)  // 30
first(values)   // 10
last(values)    // 50
```

---

## Export Utilities (Server Entry Point)

### `exportPivotData(data, format)`

Export pivot data to different formats.

**Parameters:**
- `data: any[]` - Pivot data to export
- `format: ExportFormat` - Export format ('csv' | 'excel' | 'json')

**Returns:** `Promise<string | Blob>`

**Example:**
```typescript
import { exportPivotData } from 'shadcn-pivot-table/server'

const csvData = await exportPivotData(pivotData, 'csv')
const excelBlob = await exportPivotData(pivotData, 'excel')
const jsonData = await exportPivotData(pivotData, 'json')
```

### `getAvailableFields(data)`

Extract available fields from a data source.

**Parameters:**
- `data: any[]` - Raw data array

**Returns:** `Array<{ name: string; type: string }>`

**Example:**
```typescript
import { getAvailableFields } from 'shadcn-pivot-table/server'

const fields = getAvailableFields(rawData)
// [
//   { name: 'region', type: 'string' },
//   { name: 'sales', type: 'number' },
//   { name: 'date', type: 'date' },
// ]
```

### `getUniqueFieldValues(data, field)`

Get unique values for a specific field (useful for filters).

**Parameters:**
- `data: any[]` - Raw data array
- `field: string` - Field name

**Returns:** `string[]`

**Example:**
```typescript
import { getUniqueFieldValues } from 'shadcn-pivot-table/server'

const regions = getUniqueFieldValues(salesData, 'region')
// ['North', 'South', 'East', 'West']
```

---

## Utilities

### `generateColumnKey(columnFields, values, valueField)`

Generate a unique column key for a pivot column.

### `parseColumnKey(key)`

Parse a column key back into its components.

### `cn(...inputs)`

Utility for merging Tailwind CSS classes (re-exported from lib/utils).

---

## Peer Dependencies

Required peer dependencies:

```json
{
  "@tanstack/react-table": "^8.20.0",
  "@tanstack/react-virtual": "^3.10.0",
  "react": ">=18.0.0",
  "react-dom": ">=18.0.0"
}
```

Optional peer dependencies:

```json
{
  "next": ">=13.0.0"  // Only if using server entry point
}
```

Optional dependencies:

```json
{
  "exceljs": "^4.4.0"  // Only needed for Excel export
}
```

---

## TypeScript Support

All exports are fully typed with TypeScript. Type definitions are included in the package.

```typescript
import type {
  PivotConfig,
  PivotResult,
  PivotRow,
  AggregationFunction,
  ValueFieldConfig,
  PivotMetadata
} from 'shadcn-pivot-table'
```
