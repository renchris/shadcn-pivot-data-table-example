import type { PivotConfig, PivotResult, ValueFieldConfig } from './schemas'
import type { PivotRow, GroupedData, UniqueValues } from './types'
import { aggregate } from './aggregations'

/**
 * Main pivot transformation function
 * Transforms raw data into pivoted format based on configuration
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

  // Step 4: Add totals if configured
  const withTotals = config.options.showRowTotals || config.options.showColumnTotals
    ? addTotals(pivotedData, config, uniqueColumnValues)
    : pivotedData

  // Step 5: Add grand total if configured
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
        const fieldKey = valueField.label || valueField.field
        rowData[fieldKey] = aggregate(groupRows, valueField.field, valueField.aggregation)
      }
    } else {
      // With pivot columns - create columns for each combination
      for (const combination of combinations) {
        // Filter rows that match this combination
        const matchingRows = groupRows.filter(row =>
          combination.every((value, index) => {
            const field = config.columnFields[index]
            return String(row[field] ?? '') === value
          })
        )

        // Aggregate values for matching rows
        for (const valueField of config.valueFields) {
          const columnKey = [...combination, valueField.field].join('_')
          rowData[columnKey] = matchingRows.length > 0
            ? aggregate(matchingRows, valueField.field, valueField.aggregation)
            : null
        }
      }
    }

    rows.push(rowData)
  }

  return rows
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

  const withRowTotals = config.options.showRowTotals
    ? addRowTotals(data, config, uniqueColumnValues)
    : data

  const withColumnTotals = config.options.showColumnTotals
    ? addColumnTotals(withRowTotals, config)
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

      for (const combination of combinations) {
        const columnKey = [...combination, valueField.field].join('_')
        if (rowWithTotal[columnKey] !== null && rowWithTotal[columnKey] !== undefined) {
          values.push(rowWithTotal[columnKey])
        }
      }

      const totalKey = `__total_${valueField.field}`
      const aggregateFn = valueField.aggregation

      if (aggregateFn === 'count') {
        rowWithTotal[totalKey] = values.length
      } else if (aggregateFn === 'sum' || aggregateFn === 'avg') {
        rowWithTotal[totalKey] = values.reduce((sum, val) => sum + Number(val || 0), 0)
        if (aggregateFn === 'avg' && values.length > 0) {
          rowWithTotal[totalKey] = rowWithTotal[totalKey] / values.length
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
  config: PivotConfig
): PivotRow[] {
  // Implementation for column totals would go here
  // This would create subtotal rows for each row group level
  return data
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

  // Set label for first row field
  if (config.rowFields.length > 0) {
    grandTotal[config.rowFields[0]] = 'Grand Total'
  }

  // Calculate totals for all numeric columns
  const firstRow = data[0]
  for (const key of Object.keys(firstRow)) {
    if (key.startsWith('__')) continue
    if (config.rowFields.includes(key)) continue

    const values = data
      .filter(row => !row.__isGrandTotal && !row.__isSubtotal)
      .map(row => row[key])
      .filter(val => val !== null && val !== undefined && !isNaN(Number(val)))

    if (values.length > 0) {
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
  return [...columnValues, valueField].join('_')
}

/**
 * Parse column key back into components
 */
export function parseColumnKey(
  key: string,
  columnFieldCount: number
): { columnValues: string[]; valueField: string } {
  const parts = key.split('_')
  const columnValues = parts.slice(0, columnFieldCount)
  const valueField = parts.slice(columnFieldCount).join('_')
  return { columnValues, valueField }
}
