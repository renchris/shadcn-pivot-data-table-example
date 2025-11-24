import { E as ExportFormat } from './types-B66R_aDx.mjs';
export { A as AggregationFn, d as ExportConfig, F as FieldDefinition, b as PivotConfig, P as PivotConfigSchema, c as PivotResult, a as PivotResultSchema, e as PivotRow, g as generateColumnKey, p as parseColumnKey, t as transformToPivot } from './types-B66R_aDx.mjs';
import '@tanstack/react-table';
import 'zod';

/**
 * Export utilities for pivot data
 * Supports CSV, Excel, and JSON formats
 */

/**
 * Export pivot data to different formats
 */
declare function exportPivotData(data: any[], format: ExportFormat): Promise<string | Blob>;
/**
 * Generate CSV from pivot data
 */
declare function generateCSV(data: any[]): string;
/**
 * Generate Excel file from pivot data
 * Returns a Blob that can be downloaded
 *
 * @requires exceljs - Make sure to install exceljs as an optional dependency
 */
declare function generateExcel(data: any[]): Promise<Blob>;
/**
 * Get unique values for a specific field
 * Useful for populating filter dropdowns
 */
declare function getUniqueFieldValues(data: any[], field: string): string[];
/**
 * Get available fields from the data source
 * Returns field names and their types
 */
declare function getAvailableFields(data: any[]): Array<{
    name: string;
    type: string;
}>;

export { ExportFormat, exportPivotData, generateCSV, generateExcel, getAvailableFields, getUniqueFieldValues };
