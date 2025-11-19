import type { PivotConfig, PivotResult, ValueFieldConfig } from './schemas'
import type { PivotRow, GroupedData, UniqueValues } from './types'
import { aggregate } from './aggregations'

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
export function transformToPivot(
  rawData: any[],
  config: PivotConfig
): PivotResult {
  // Validate input
  if (!rawData || rawData.length === 0) {
    return {
      data: [],
      metadata: {
        rowCount: 0,
        columnCount: 0,
        uniqueValues: {},
      },
      config,
    }
  }

  // Step 1: Group data by row fields
  const grouped = groupByFields(rawData, config.rowFields)

  // Step 2: Extract unique values for pivot columns
  const uniqueColumnValues = extractUniqueValues(rawData, config.columnFields)

  // Step 3: Generate pivoted data
  const pivotedData = generatePivotedRows(
    grouped,
    uniqueColumnValues,
    config
  )

  // Step 4: Add hierarchical subtotals for grouped data
  const withSubtotals = config.rowFields.length > 1 && config.options.showRowTotals
    ? addHierarchicalSubtotals(pivotedData, rawData, config, uniqueColumnValues)
    : pivotedData

  // Step 5: Add row and column totals
  const withTotals = config.options.showRowTotals || config.options.showColumnTotals
    ? addTotals(withSubtotals, config, uniqueColumnValues)
    : withSubtotals

  // Step 6: Add grand total if configured
  const finalData = config.options.showGrandTotal
    ? addGrandTotal(withTotals, config)
    : withTotals

  return {
    data: finalData,
    metadata: {
      rowCount: finalData.length,
      columnCount: calculateColumnCount(uniqueColumnValues, config.valueFields),
      uniqueValues: Object.fromEntries(
        Object.entries(uniqueColumnValues).map(([k, v]) => [k, Array.from(v)])
      ),
    },
    config,
  }
}

/**
 * Generate pivot column metadata
 */
function generatePivotColumnMetadata(
  uniqueColumnValues: Record<string, Set<string>>,
  columnFields: string[],
  valueFields: ValueFieldConfig[]
): Array<{ pivotValue: string; field: string }> {
  if (columnFields.length === 0) {
    return []
  }

  const combinations = generateColumnCombinations(uniqueColumnValues, columnFields)
  const pivotColumns: Array<{ pivotValue: string; field: string }> = []

  for (const combination of combinations) {
    for (const valueField of valueFields) {
      pivotColumns.push({
        pivotValue: combination[0], // For single column field, use the value directly
        field: valueField.field,
      })
    }
  }

  return pivotColumns
}

/**
 * Group data by specified fields
 */
function groupByFields(data: any[], fields: string[]): Map<string, any[]> {
  if (fields.length === 0) {
    return new Map([['__all__', data]])
  }

  const grouped = new Map<string, any[]>()

  for (const row of data) {
    const key = fields.map(field => String(row[field] ?? '')).join('|')
    if (!grouped.has(key)) {
      grouped.set(key, [])
    }
    grouped.get(key)!.push(row)
  }

  return grouped
}

/**
 * Extract unique values for pivot columns
 */
function extractUniqueValues(
  data: any[],
  fields: string[]
): Record<string, Set<string>> {
  if (fields.length === 0) {
    return {}
  }

  const uniqueValues: Record<string, Set<string>> = {}

  for (const field of fields) {
    uniqueValues[field] = new Set()
  }

  for (const row of data) {
    for (const field of fields) {
      const value = String(row[field] ?? '')
      uniqueValues[field].add(value)
    }
  }

  return uniqueValues
}

/**
 * Generate all combinations of column values
 */
function generateColumnCombinations(
  uniqueValues: Record<string, Set<string>>,
  fields: string[]
): string[][] {
  if (fields.length === 0) {
    return [[]]
  }

  const [firstField, ...restFields] = fields
  const firstValues = Array.from(uniqueValues[firstField] || [])

  if (restFields.length === 0) {
    return firstValues.map(v => [v])
  }

  const restCombinations = generateColumnCombinations(uniqueValues, restFields)
  const combinations: string[][] = []

  for (const value of firstValues) {
    for (const rest of restCombinations) {
      combinations.push([value, ...rest])
    }
  }

  return combinations
}

/**
 * Generate pivoted rows from grouped data
 */
function generatePivotedRows(
  grouped: Map<string, any[]>,
  uniqueColumnValues: Record<string, Set<string>>,
  config: PivotConfig
): PivotRow[] {
  const rows: PivotRow[] = []
  const combinations = generateColumnCombinations(
    uniqueColumnValues,
    config.columnFields
  )

  for (const [groupKey, groupRows] of grouped.entries()) {
    const rowData: PivotRow = {
      __id: groupKey,
      __level: 0,
    }

    // Add row field values
    const rowFieldValues = groupKey.split('|')
    config.rowFields.forEach((field, index) => {
      rowData[field] = rowFieldValues[index] || ''
    })

    // Add value fields for each column combination
    if (config.columnFields.length === 0) {
      // No pivot columns - just aggregate values
      for (const valueField of config.valueFields) {
        const fieldKey = valueField.displayName || valueField.field
        rowData[fieldKey] = aggregate(groupRows, valueField.field, valueField.aggregation)
      }
    } else {
      // With pivot columns - create indexed lookup for O(1) access
      // Build index once instead of filtering for each combination
      const columnIndex = new Map<string, any[]>()
      for (const row of groupRows) {
        const key = config.columnFields
          .map(field => String(row[field] ?? ''))
          .join('|')
        if (!columnIndex.has(key)) {
          columnIndex.set(key, [])
        }
        columnIndex.get(key)!.push(row)
      }

      // Now use O(1) lookups instead of O(n) filtering
      for (const combination of combinations) {
        const lookupKey = combination.join('|')
        const matchingRows = columnIndex.get(lookupKey) || []

        // Aggregate values for matching rows
        for (const valueField of config.valueFields) {
          const displayName = valueField.displayName || valueField.field
          const columnKey = [...combination, displayName].join('__')
          rowData[columnKey] = matchingRows.length > 0
            ? aggregate(matchingRows, valueField.field, valueField.aggregation)
            : undefined
        }
      }
    }

    rows.push(rowData)
  }

  return rows
}

/**
 * Add hierarchical subtotals for grouped data
 */
function addHierarchicalSubtotals(
  data: PivotRow[],
  rawData: any[],
  config: PivotConfig,
  uniqueColumnValues: Record<string, Set<string>>
): PivotRow[] {
  if (config.rowFields.length <= 1) {
    return data
  }

  const result: PivotRow[] = []
  const parentFields = config.rowFields.slice(0, -1) // All fields except the last one
  const groupMap = new Map<string, PivotRow[]>()

  // Group rows by parent fields
  for (const row of data) {
    const key = parentFields.map(field => String(row[field] ?? '')).join('|')
    if (!groupMap.has(key)) {
      groupMap.set(key, [])
    }
    groupMap.get(key)!.push(row)
  }

  // Add rows and subtotals for each group
  for (const [groupKey, groupRows] of groupMap.entries()) {
    // Add all rows in this group
    result.push(...groupRows)

    // Create subtotal row
    const subtotalRow: PivotRow = {
      __id: `${groupKey}__subtotal`,
      __isSubtotal: true,
      __level: parentFields.length - 1,
    }

    // Set parent field values
    const parentValues = groupKey.split('|')
    parentFields.forEach((field, index) => {
      subtotalRow[field] = parentValues[index] || ''
    })

    // Mark last field as total
    subtotalRow[config.rowFields[config.rowFields.length - 1]] = '__TOTAL__'

    // Aggregate values
    if (config.columnFields.length === 0) {
      // No pivot columns - aggregate directly
      for (const valueField of config.valueFields) {
        const displayName = valueField.displayName || valueField.field
        const values = groupRows.map(row => row[displayName]).filter(v => v !== null && v !== undefined)

        if (valueField.aggregation === 'sum') {
          subtotalRow[displayName] = values.reduce((sum, val) => sum + Number(val || 0), 0)
        } else if (valueField.aggregation === 'count') {
          subtotalRow[displayName] = values.length
        } else if (valueField.aggregation === 'avg') {
          const sum = values.reduce((sum, val) => sum + Number(val || 0), 0)
          subtotalRow[displayName] = values.length > 0 ? sum / values.length : 0
        } else if (valueField.aggregation === 'min') {
          subtotalRow[displayName] = values.length > 0 ? Math.min(...values.map(Number)) : 0
        } else if (valueField.aggregation === 'max') {
          subtotalRow[displayName] = values.length > 0 ? Math.max(...values.map(Number)) : 0
        }
      }
    } else {
      // With pivot columns - aggregate for each column
      const firstRow = groupRows[0]
      for (const key of Object.keys(firstRow)) {
        if (key.startsWith('__')) continue
        if (config.rowFields.includes(key)) continue

        const values = groupRows.map(row => row[key]).filter(v => v !== null && v !== undefined && !isNaN(Number(v)))
        if (values.length > 0) {
          subtotalRow[key] = values.reduce((sum, val) => sum + Number(val), 0)
        }
      }
    }

    result.push(subtotalRow)
  }

  return result
}

/**
 * Add row and column totals
 */
function addTotals(
  data: PivotRow[],
  config: PivotConfig,
  uniqueColumnValues: Record<string, Set<string>>
): PivotRow[] {
  if (!config.options.showRowTotals && !config.options.showColumnTotals) {
    return data
  }

  const withRowTotals = config.options.showRowTotals && config.columnFields.length > 0
    ? addRowTotals(data, config, uniqueColumnValues)
    : data

  const withColumnTotals = config.options.showColumnTotals
    ? addColumnTotals(withRowTotals, config, uniqueColumnValues)
    : withRowTotals

  return withColumnTotals
}

/**
 * Add row total columns
 */
function addRowTotals(
  data: PivotRow[],
  config: PivotConfig,
  uniqueColumnValues: Record<string, Set<string>>
): PivotRow[] {
  if (config.columnFields.length === 0) {
    return data
  }

  return data.map(row => {
    const rowWithTotal = { ...row }
    const combinations = generateColumnCombinations(
      uniqueColumnValues,
      config.columnFields
    )

    for (const valueField of config.valueFields) {
      const values: any[] = []
      const displayName = valueField.displayName || valueField.field

      for (const combination of combinations) {
        const columnKey = [...combination, displayName].join('__')
        if (rowWithTotal[columnKey] !== null && rowWithTotal[columnKey] !== undefined) {
          values.push(rowWithTotal[columnKey])
        }
      }

      const aggregateFn = valueField.aggregation

      if (aggregateFn === 'count' || aggregateFn === 'sum') {
        // For count and sum, add up all the values
        rowWithTotal['__TOTAL__'] = values.reduce((sum, val) => sum + Number(val || 0), 0)
      } else if (aggregateFn === 'avg') {
        const sum = values.reduce((sum, val) => sum + Number(val || 0), 0)
        rowWithTotal['__TOTAL__'] = values.length > 0 ? sum / values.length : 0
      } else if (aggregateFn === 'min') {
        rowWithTotal['__TOTAL__'] = values.length > 0 ? Math.min(...values.map(Number)) : 0
      } else if (aggregateFn === 'max') {
        rowWithTotal['__TOTAL__'] = values.length > 0 ? Math.max(...values.map(Number)) : 0
      } else if (aggregateFn === 'first') {
        rowWithTotal['__TOTAL__'] = values.length > 0 ? values[0] : undefined
      } else if (aggregateFn === 'last') {
        rowWithTotal['__TOTAL__'] = values.length > 0 ? values[values.length - 1] : undefined
      } else if (aggregateFn === 'median') {
        if (values.length > 0) {
          const sorted = [...values].map(Number).sort((a, b) => a - b)
          const mid = Math.floor(sorted.length / 2)
          rowWithTotal['__TOTAL__'] = sorted.length % 2 === 0
            ? (sorted[mid - 1] + sorted[mid]) / 2
            : sorted[mid]
        } else {
          rowWithTotal['__TOTAL__'] = 0
        }
      }
    }

    return rowWithTotal
  })
}

/**
 * Add column total rows
 */
function addColumnTotals(
  data: PivotRow[],
  config: PivotConfig,
  uniqueColumnValues: Record<string, Set<string>>
): PivotRow[] {
  if (config.columnFields.length === 0) {
    return data
  }

  const columnTotalRow: PivotRow = {
    __id: '__column_total__',
    __isColumnTotal: true,
    __level: 0,
  }

  // Set identifier for first row field or first column field
  if (config.rowFields.length > 0) {
    columnTotalRow[config.rowFields[0]] = '__COLUMN_TOTAL__'
  } else if (config.columnFields.length > 0) {
    columnTotalRow[config.columnFields[0]] = '__COLUMN_TOTAL__'
  }

  // Calculate column totals for all value columns
  const firstRow = data[0]
  let grandTotal = 0

  for (const key of Object.keys(firstRow)) {
    if (key.startsWith('__')) continue
    if (config.rowFields.includes(key)) continue

    const values = data
      .filter(row => !row.__isGrandTotal && !row.__isColumnTotal && !row.__isSubtotal)
      .map(row => row[key])
      .filter(val => val !== null && val !== undefined && !isNaN(Number(val)))

    if (values.length > 0) {
      const total = values.reduce((sum, val) => sum + Number(val), 0)
      columnTotalRow[key] = total

      // Add to grand total if this is a regular column (not a __TOTAL__ key)
      if (key !== '__TOTAL__') {
        grandTotal += total
      }
    }
  }

  // Add grand total column if there are pivot columns with row totals enabled
  if (config.options.showRowTotals) {
    columnTotalRow['__TOTAL__'] = grandTotal
  }

  return [...data, columnTotalRow]
}

/**
 * Add grand total row
 */
function addGrandTotal(
  data: PivotRow[],
  config: PivotConfig
): PivotRow[] {
  if (data.length === 0) return data

  const grandTotal: PivotRow = {
    __id: '__grand_total__',
    __isGrandTotal: true,
    __level: 0,
  }

  // Set identifier for first row field
  if (config.rowFields.length > 0) {
    grandTotal[config.rowFields[0]] = '__GRAND_TOTAL__'
  }

  // Calculate totals for all value columns
  const firstRow = data[0]
  for (const key of Object.keys(firstRow)) {
    if (key.startsWith('__')) continue
    if (config.rowFields.includes(key)) continue

    const values = data
      .filter(row => !row.__isGrandTotal && !row.__isSubtotal)
      .map(row => row[key])
      .filter(val => val !== null && val !== undefined && !isNaN(Number(val)))

    if (values.length > 0) {
      // Use sum for now - in real implementation would check aggregation type
      grandTotal[key] = values.reduce((sum, val) => sum + Number(val), 0)
    }
  }

  return [...data, grandTotal]
}

/**
 * Calculate total number of columns
 */
function calculateColumnCount(
  uniqueColumnValues: Record<string, Set<string>>,
  valueFields: ValueFieldConfig[]
): number {
  if (Object.keys(uniqueColumnValues).length === 0) {
    return valueFields.length
  }

  let count = 1
  for (const values of Object.values(uniqueColumnValues)) {
    count *= values.size
  }
  return count * valueFields.length
}

/**
 * Generate column key from pivot column values and value field
 */
export function generateColumnKey(
  columnValues: string[],
  valueField: string
): string {
  return [...columnValues, valueField].join('__')
}

/**
 * Parse column key back into components
 */
export function parseColumnKey(
  key: string,
  columnFieldCount: number
): { columnValues: string[]; valueField: string } {
  const parts = key.split('__')
  const columnValues = parts.slice(0, columnFieldCount)
  const valueField = parts.slice(columnFieldCount).join('__')
  return { columnValues, valueField }
}
