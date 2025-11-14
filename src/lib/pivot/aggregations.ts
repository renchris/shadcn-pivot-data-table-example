import type { AggregationFn, AggregationFunctions } from './types'
import type { AggregationFunction } from './schemas'

/**
 * Sum aggregation - add all values
 */
export const sum: AggregationFn<number> = (values) => {
  if (!values || values.length === 0) return 0
  return values.reduce((acc, val) => {
    const num = Number(val)
    return acc + (isNaN(num) ? 0 : num)
  }, 0)
}

/**
 * Average aggregation - calculate mean
 */
export const avg: AggregationFn<number> = (values) => {
  if (!values || values.length === 0) return 0
  const total = sum(values)
  return total / values.length
}

/**
 * Count aggregation - count non-null values
 */
export const count: AggregationFn = (values) => {
  if (!values) return 0
  return values.filter(v => v !== null && v !== undefined).length
}

/**
 * Min aggregation - find minimum value
 */
export const min: AggregationFn<number> = (values) => {
  if (!values || values.length === 0) return null
  const numbers = values.map(Number).filter(n => !isNaN(n))
  if (numbers.length === 0) return null
  return Math.min(...numbers)
}

/**
 * Max aggregation - find maximum value
 */
export const max: AggregationFn<number> = (values) => {
  if (!values || values.length === 0) return null
  const numbers = values.map(Number).filter(n => !isNaN(n))
  if (numbers.length === 0) return null
  return Math.max(...numbers)
}

/**
 * Median aggregation - find middle value
 */
export const median: AggregationFn<number> = (values) => {
  if (!values || values.length === 0) return null
  const numbers = values.map(Number).filter(n => !isNaN(n)).sort((a, b) => a - b)
  if (numbers.length === 0) return null

  const mid = Math.floor(numbers.length / 2)
  if (numbers.length % 2 === 0) {
    return (numbers[mid - 1] + numbers[mid]) / 2
  }
  return numbers[mid]
}

/**
 * First aggregation - get first value
 */
export const first: AggregationFn = (values) => {
  if (!values || values.length === 0) return null
  return values[0]
}

/**
 * Last aggregation - get last value
 */
export const last: AggregationFn = (values) => {
  if (!values || values.length === 0) return null
  return values[values.length - 1]
}

/**
 * Map of all aggregation functions
 */
export const aggregationFunctions: AggregationFunctions = {
  sum,
  avg,
  count,
  min,
  max,
  median,
  first,
  last,
}

/**
 * Get aggregation function by name
 */
export function getAggregationFunction(name: AggregationFunction): AggregationFn {
  const fn = aggregationFunctions[name]
  if (!fn) {
    throw new Error(`Unknown aggregation function: ${name}`)
  }
  return fn
}

/**
 * Apply aggregation to a set of values
 */
export function aggregate(
  values: any[],
  field: string,
  aggregation: AggregationFunction
): any {
  const fieldValues = values.map(row => row[field])
  const fn = getAggregationFunction(aggregation)
  return fn(fieldValues)
}

/**
 * Format aggregation function name for display
 */
export function formatAggregationName(agg: AggregationFunction): string {
  const names: Record<AggregationFunction, string> = {
    sum: 'Sum',
    avg: 'Average',
    count: 'Count',
    min: 'Minimum',
    max: 'Maximum',
    median: 'Median',
    first: 'First',
    last: 'Last',
  }
  return names[agg] || agg
}
