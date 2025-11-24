import { ColumnDef } from '@tanstack/react-table';
import { z } from 'zod';

/**
 * Aggregation function types supported by the pivot table
 */
declare const AggregationFunctionSchema: z.ZodEnum<{
    sum: "sum";
    avg: "avg";
    count: "count";
    min: "min";
    max: "max";
    median: "median";
    first: "first";
    last: "last";
}>;
type AggregationFunction = z.infer<typeof AggregationFunctionSchema>;
/**
 * Configuration for a value field with its aggregation function
 */
declare const ValueFieldConfigSchema: z.ZodObject<{
    field: z.ZodString;
    aggregation: z.ZodEnum<{
        sum: "sum";
        avg: "avg";
        count: "count";
        min: "min";
        max: "max";
        median: "median";
        first: "first";
        last: "last";
    }>;
    displayName: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type ValueFieldConfig = z.infer<typeof ValueFieldConfigSchema>;
/**
 * Complete pivot table configuration
 */
declare const PivotConfigSchema: z.ZodObject<{
    rowFields: z.ZodDefault<z.ZodArray<z.ZodString>>;
    columnFields: z.ZodDefault<z.ZodArray<z.ZodString>>;
    valueFields: z.ZodArray<z.ZodObject<{
        field: z.ZodString;
        aggregation: z.ZodEnum<{
            sum: "sum";
            avg: "avg";
            count: "count";
            min: "min";
            max: "max";
            median: "median";
            first: "first";
            last: "last";
        }>;
        displayName: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    filters: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    options: z.ZodDefault<z.ZodObject<{
        showRowTotals: z.ZodDefault<z.ZodBoolean>;
        showColumnTotals: z.ZodDefault<z.ZodBoolean>;
        showGrandTotal: z.ZodDefault<z.ZodBoolean>;
        expandedByDefault: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type PivotConfig = z.infer<typeof PivotConfigSchema>;
/**
 * Metadata about the pivot result
 */
declare const PivotMetadataSchema: z.ZodObject<{
    rowCount: z.ZodNumber;
    columnCount: z.ZodNumber;
    uniqueValues: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString>>;
    totalRows: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
type PivotMetadata = z.infer<typeof PivotMetadataSchema>;
/**
 * Complete pivot result returned from the transformation
 */
declare const PivotResultSchema: z.ZodObject<{
    data: z.ZodArray<z.ZodRecord<z.ZodString, z.ZodAny>>;
    metadata: z.ZodObject<{
        rowCount: z.ZodNumber;
        columnCount: z.ZodNumber;
        uniqueValues: z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString>>;
        totalRows: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
    config: z.ZodObject<{
        rowFields: z.ZodDefault<z.ZodArray<z.ZodString>>;
        columnFields: z.ZodDefault<z.ZodArray<z.ZodString>>;
        valueFields: z.ZodArray<z.ZodObject<{
            field: z.ZodString;
            aggregation: z.ZodEnum<{
                sum: "sum";
                avg: "avg";
                count: "count";
                min: "min";
                max: "max";
                median: "median";
                first: "first";
                last: "last";
            }>;
            displayName: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        filters: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
        options: z.ZodDefault<z.ZodObject<{
            showRowTotals: z.ZodDefault<z.ZodBoolean>;
            showColumnTotals: z.ZodDefault<z.ZodBoolean>;
            showGrandTotal: z.ZodDefault<z.ZodBoolean>;
            expandedByDefault: z.ZodDefault<z.ZodBoolean>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
type PivotResult = z.infer<typeof PivotResultSchema>;
/**
 * Export format options
 */
declare const ExportFormatSchema: z.ZodEnum<{
    csv: "csv";
    excel: "excel";
    json: "json";
}>;
type ExportFormat = z.infer<typeof ExportFormatSchema>;
/**
 * Export configuration
 */
declare const ExportConfigSchema: z.ZodObject<{
    format: z.ZodEnum<{
        csv: "csv";
        excel: "excel";
        json: "json";
    }>;
    includeTotals: z.ZodDefault<z.ZodBoolean>;
    filename: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type ExportConfig = z.infer<typeof ExportConfigSchema>;

/**
 * Main pivot transformation function
 * Transforms raw data into pivoted format based on configuration
 *
 * @param rawData - Array of data objects to transform
 * @param config - Pivot configuration specifying row fields, column fields, value fields, and options
 * @returns PivotResult containing transformed data, metadata, and config
 *
 * @example
 * ```typescript
 * const rawData = [
 *   { region: 'North', product: 'A', sales: 100 },
 *   { region: 'South', product: 'A', sales: 150 },
 * ]
 *
 * const config: PivotConfig = {
 *   rowFields: ['region'],
 *   columnFields: ['product'],
 *   valueFields: [{ field: 'sales', aggregation: 'sum' }],
 *   options: { showRowTotals: true, showColumnTotals: true, showGrandTotal: true }
 * }
 *
 * const result = transformToPivot(rawData, config)
 * // result.data contains the pivoted table data
 * // result.metadata contains rowCount, columnCount, uniqueValues
 * ```
 */
declare function transformToPivot(rawData: any[], config: PivotConfig): PivotResult;
/**
 * Generate column key from pivot column values and value field
 */
declare function generateColumnKey(columnValues: string[], valueField: string): string;
/**
 * Parse column key back into components
 */
declare function parseColumnKey(key: string, columnFieldCount: number): {
    columnValues: string[];
    valueField: string;
};

/**
 * Row data with pivot markers
 * Supports hierarchical structure with parent-child relationships
 */
interface PivotRow extends Record<string, any> {
    __id?: string;
    __isSubtotal?: boolean;
    __isGrandTotal?: boolean;
    __level?: number;
    __groupKey?: string;
    __expanded?: boolean;
    __parentKey?: string;
    subRows?: PivotRow[];
}
/**
 * Field definition for available fields
 */
interface FieldDefinition {
    name: string;
    label: string;
    type: 'string' | 'number' | 'date' | 'boolean';
    format?: string;
}
/**
 * Aggregation function signature
 */
type AggregationFn<T = any> = (values: T[]) => T | number | null;
/**
 * Map of aggregation functions
 */
type AggregationFunctions = Record<AggregationFunction, AggregationFn>;
/**
 * Column group structure for hierarchical headers
 */
interface ColumnGroup {
    id: string;
    label: string;
    columns: Array<ColumnDef<PivotRow> | ColumnGroup>;
    level: number;
}
/**
 * Pivot transformation options
 */
interface TransformOptions {
    maxColumns?: number;
    maxRows?: number;
    sortBy?: {
        field: string;
        direction: 'asc' | 'desc';
    }[];
}
/**
 * Unique value extraction result
 */
interface UniqueValues {
    [field: string]: Set<string | number>;
}
/**
 * Grouped data structure
 */
interface GroupedData {
    key: string;
    values: Record<string, any>[];
    children?: GroupedData[];
    level: number;
}
/**
 * Cell value with metadata
 */
interface CellValue {
    value: any;
    rawValues: any[];
    count: number;
    aggregation: AggregationFunction;
}
/**
 * Drop zone types for drag and drop
 */
type DropZoneType = 'rows' | 'columns' | 'values' | 'filters' | 'available';
/**
 * Drag data for field configuration
 */
interface DragData {
    field: string;
    source: DropZoneType;
    valueConfig?: ValueFieldConfig;
}
/**
 * Pivot state for UI components
 */
interface PivotState {
    config: PivotConfig;
    expandedGroups: Set<string>;
    selectedCells: Set<string>;
    isLoading: boolean;
    error: Error | null;
}
/**
 * Format functions for different data types
 */
type FormatFn = (value: any) => string;
interface Formatters {
    number: FormatFn;
    currency: FormatFn;
    percentage: FormatFn;
    date: FormatFn;
}

export { type AggregationFn as A, type ColumnGroup as C, type DropZoneType as D, type ExportFormat as E, type FieldDefinition as F, type GroupedData as G, PivotConfigSchema as P, type TransformOptions as T, type UniqueValues as U, ValueFieldConfigSchema as V, PivotResultSchema as a, type PivotConfig as b, type PivotResult as c, type ExportConfig as d, type PivotRow as e, type PivotMetadata as f, generateColumnKey as g, PivotMetadataSchema as h, AggregationFunctionSchema as i, ExportFormatSchema as j, ExportConfigSchema as k, type ValueFieldConfig as l, type AggregationFunction as m, type DragData as n, type PivotState as o, parseColumnKey as p, type CellValue as q, type AggregationFunctions as r, type FormatFn as s, transformToPivot as t, type Formatters as u };
