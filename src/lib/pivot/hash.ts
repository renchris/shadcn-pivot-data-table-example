import type { PivotConfig } from './schemas'

/**
 * djb2 hash function - fast and collision-resistant for pivot config hashing
 * Original algorithm by Daniel J. Bernstein
 */
function djb2Hash(str: string): number {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i)
  }
  return hash >>> 0 // Convert to unsigned 32-bit integer
}

/**
 * Generate a stable hash key for PivotConfig
 * Only includes fields that affect transformation output
 * Much faster than JSON.stringify and avoids large string allocations
 *
 * @param config - PivotConfig to hash
 * @returns Compact base36 hash string (8-10 chars)
 */
export function hashPivotConfig(config: PivotConfig): string {
  // Build a deterministic string representation
  // Using arrays joined with delimiters instead of JSON.stringify
  const parts: string[] = [
    // Row fields in order
    'r:' + config.rowFields.join(','),
    // Column fields in order
    'c:' + config.columnFields.join(','),
    // Value fields - field:aggregation:displayName
    'v:' + config.valueFields
      .map(vf => `${vf.field}:${vf.aggregation}:${vf.displayName || ''}`)
      .join('|'),
    // Options that affect output
    'o:' + [
      config.options.showRowTotals ? '1' : '0',
      config.options.showColumnTotals ? '1' : '0',
      config.options.showGrandTotal ? '1' : '0',
      config.options.expandedByDefault ? '1' : '0',
    ].join(''),
  ]

  // Filters if present (still need stringify but rarely changes)
  if (config.filters && Object.keys(config.filters).length > 0) {
    parts.push('f:' + JSON.stringify(config.filters))
  }

  const hashInput = parts.join('|')
  return djb2Hash(hashInput).toString(36) // Base36 for compact representation
}
