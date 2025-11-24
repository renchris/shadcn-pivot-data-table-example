import { A as AggregationFn, r as AggregationFunctions, m as AggregationFunction } from './types-B66R_aDx.mjs';
export { i as AggregationFunctionSchema, q as CellValue, C as ColumnGroup, n as DragData, D as DropZoneType, d as ExportConfig, k as ExportConfigSchema, E as ExportFormat, j as ExportFormatSchema, F as FieldDefinition, s as FormatFn, u as Formatters, G as GroupedData, b as PivotConfig, P as PivotConfigSchema, f as PivotMetadata, h as PivotMetadataSchema, c as PivotResult, a as PivotResultSchema, e as PivotRow, o as PivotState, T as TransformOptions, U as UniqueValues, l as ValueFieldConfig, V as ValueFieldConfigSchema, g as generateColumnKey, p as parseColumnKey, t as transformToPivot } from './types-B66R_aDx.mjs';
import { ClassValue } from 'clsx';
import '@tanstack/react-table';
import 'zod';

/**
 * Sum aggregation - add all values
 */
declare const sum: AggregationFn<number>;
/**
 * Average aggregation - calculate mean
 */
declare const avg: AggregationFn<number>;
/**
 * Count aggregation - count non-null values
 */
declare const count: AggregationFn;
/**
 * Min aggregation - find minimum value
 */
declare const min: AggregationFn<number>;
/**
 * Max aggregation - find maximum value
 */
declare const max: AggregationFn<number>;
/**
 * Median aggregation - find middle value
 */
declare const median: AggregationFn<number>;
/**
 * First aggregation - get first value
 */
declare const first: AggregationFn;
/**
 * Last aggregation - get last value
 */
declare const last: AggregationFn;
/**
 * Map of all aggregation functions
 */
declare const aggregationFunctions: AggregationFunctions;
/**
 * Get aggregation function by name
 */
declare function getAggregationFunction(name: AggregationFunction): AggregationFn;
/**
 * Apply aggregation to a set of values
 */
declare function aggregate(values: any[], field: string, aggregation: AggregationFunction): any;
/**
 * Format aggregation function name for display
 */
declare function formatAggregationName(agg: AggregationFunction): string;

declare function cn(...inputs: ClassValue[]): string;

export { AggregationFn, AggregationFunction, AggregationFunctions, aggregate, aggregationFunctions, avg, cn, count, first, formatAggregationName, getAggregationFunction, last, max, median, min, sum };
