'use client'

import { useMemo, useRef, memo, useState } from 'react'
import {
  type ColumnDef,
  type ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { ChevronRight, ChevronDown } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import type { PivotConfig, PivotMetadata } from '../../lib/pivot/schemas'
import type { PivotRow } from '../../lib/pivot/types'
import { cn } from '../../lib/utils'
import { generateColumnKey } from '../../lib/pivot/transformer'

/**
 * Props for the PivotTable component
 */
interface PivotTableProps {
  /** Transformed pivot data rows */
  data: PivotRow[]
  /** Pivot configuration used for the transformation */
  config: PivotConfig
  /** Metadata about the pivot result (row count, column count, unique values) */
  metadata: PivotMetadata
}

/**
 * PivotTable component - Renders a virtualized pivot table with TanStack Table
 *
 * Features:
 * - Virtual scrolling for large datasets (100K+ rows)
 * - Dynamic column generation based on pivot configuration
 * - Hierarchical row grouping with indentation
 * - Styled subtotals and grand totals
 *
 * @example
 * ```tsx
 * import { transformToPivot } from 'shadcn-pivot-table'
 * import { PivotTable } from 'shadcn-pivot-table'
 *
 * const result = transformToPivot(rawData, config)
 * <PivotTable data={result.data} config={result.config} metadata={result.metadata} />
 * ```
 */
const PivotTableComponent = ({ data, config, metadata }: PivotTableProps) => {
  const parentRef = useRef<HTMLDivElement>(null)

  // Initialize expanded state - all rows expanded by default
  const [expanded, setExpanded] = useState<ExpandedState>(true)

  // Generate column definitions dynamically based on configuration
  const columns = useMemo<ColumnDef<PivotRow>[]>(() => {
    const cols: ColumnDef<PivotRow>[] = []

    // Unpivoted view - show all raw data columns
    if (config.rowFields.length === 0 && config.columnFields.length === 0) {
      const firstRow = data[0]
      if (firstRow) {
        // Get unique keys and filter out internal fields
        const allKeys = [...new Set(Object.keys(firstRow))].filter(key => !key.startsWith('__'))

        return allKeys.map((key, index) => ({
          id: `unpivoted_${key}_${index}`, // Ensure unique ID
          accessorFn: (row: PivotRow) => row[key], // Use accessor function instead of accessorKey
          header: formatFieldName(key),
          cell: ({ getValue }) => {
            const value = getValue()
            // Format based on type detection
            if (typeof value === 'number') {
              return <div className="text-right font-mono">{value.toLocaleString()}</div>
            }
            return <div className="text-left">{String(value ?? '')}</div>
          },
          size: 150,
        }))
      }
      return []
    }

    // Add row field columns
    // For hierarchical grouping (multiple row fields), only show the first field
    // with expand/collapse functionality. Child rows will display nested values.
    if (config.rowFields.length > 1) {
      // Hierarchical mode - single column with tree structure
      cols.push({
        id: 'row_hierarchy',
        // Use accessorFn to dynamically select the correct field based on row depth
        accessorFn: (row) => {
          // Determine which field to display based on row depth/level
          const level = row.__level || 0
          // Cap level to available fields to prevent array out of bounds
          const fieldIndex = Math.min(level, config.rowFields.length - 1)
          const field = config.rowFields[fieldIndex]
          return row[field]
        },
        header: config.rowFields.map(formatFieldName).join(' / '),
        cell: ({ row, getValue }) => {
          const value = getValue() as string
          const level = row.depth // TanStack Table provides row.depth for nested rows
          const isTotal = row.original.__isGrandTotal || row.original.__isSubtotal
          const canExpand = row.getCanExpand()
          const isExpanded = row.getIsExpanded()

          return (
            <div
              onClick={canExpand ? row.getToggleExpandedHandler() : undefined}
              className={cn(
                'flex items-center gap-2 transition-all',
                // Font weight hierarchy based on level
                level === 0 && canExpand && 'font-semibold',
                level === 1 && canExpand && 'font-medium',
                level >= 2 && 'font-normal',
                // Totals override
                isTotal && 'font-bold',
                // Enhanced vertical guide for parent rows
                canExpand && level > 0 && 'border-l-2 border-muted/50 pl-3 hover:border-l-muted',
                // Cursor pointer for expandable rows
                canExpand && 'cursor-pointer'
              )}
              style={{ paddingLeft: `${level * 1.5}rem` }} // 1.5rem = 24px (Ant Design standard)
            >
              {canExpand ? (
                <div className="w-7 flex items-center justify-center shrink-0">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              ) : (
                <span className="w-7" />
              )}
              <span>{formatTotalLabel(value)}</span>
            </div>
          )
        },
        size: 250,
      })
    } else {
      // Flat mode - show each row field as a separate column
      for (const field of config.rowFields) {
        cols.push({
          id: `row_${field}`,
          accessorKey: field,
          header: formatFieldName(field),
          cell: ({ row, getValue }) => {
            const value = getValue() as string
            const level = row.original.__level || 0
            const isTotal = row.original.__isGrandTotal || row.original.__isSubtotal

            return (
              <div
                className={cn(
                  'font-medium',
                  isTotal && 'font-bold',
                  level > 0 && `pl-${level * 4}`
                )}
              >
                {formatTotalLabel(value)}
              </div>
            )
          },
          size: 200,
        })
      }
    }

    // Add value columns (with pivot columns if configured)
    if (config.columnFields.length === 0) {
      // No pivot columns - simple value columns
      for (const valueField of config.valueFields) {
        cols.push({
          id: `value_${valueField.field}`,
          accessorKey: valueField.displayName || valueField.field,
          header: () => (
            <div className="text-right">
              {valueField.displayName || formatFieldName(valueField.field)}
            </div>
          ),
          cell: ({ getValue, row }) => {
            const value = getValue() as number
            const isTotal = row.original.__isGrandTotal || row.original.__isSubtotal
            const canExpand = row.getCanExpand()
            return (
              <div
                className={cn(
                  'text-right font-mono',
                  isTotal && 'font-bold',
                  canExpand && !isTotal && 'font-semibold'
                )}
              >
                {formatNumber(value, valueField.aggregation)}
              </div>
            )
          },
          size: 150,
        })
      }
    } else {
      // With pivot columns - create nested column groups
      const uniqueValues = metadata.uniqueValues || {}
      const columnCombinations = generateCombinations(config.columnFields, uniqueValues)

      for (const combination of columnCombinations) {
        const groupLabel = combination.join(' - ')

        // Create column group
        const groupColumns: ColumnDef<PivotRow>[] = config.valueFields.map(valueField => ({
          id: `pivot_${generateColumnKey(combination, valueField.displayName || valueField.field)}`,
          accessorKey: generateColumnKey(combination, valueField.displayName || valueField.field),
          header: () => (
            <div className="text-right">
              {valueField.displayName || formatFieldName(valueField.field)}
            </div>
          ),
          cell: ({ getValue, row }) => {
            const value = getValue() as number
            const isTotal = row.original.__isGrandTotal || row.original.__isSubtotal
            const canExpand = row.getCanExpand()
            return (
              <div
                className={cn(
                  'text-right font-mono',
                  isTotal && 'font-bold',
                  canExpand && !isTotal && 'font-semibold'
                )}
              >
                {formatNumber(value, valueField.aggregation)}
              </div>
            )
          },
          size: 120,
        }))

        // Add as column group if multiple value fields, otherwise add directly
        if (groupColumns.length > 1) {
          cols.push({
            id: `group-${groupLabel}`,
            header: groupLabel,
            columns: groupColumns,
          })
        } else {
          cols.push({
            ...groupColumns[0],
            header: `${groupLabel} - ${groupColumns[0].header}`,
          })
        }
      }
    }

    // Add row total columns if configured
    if (config.options.showRowTotals && config.columnFields.length > 0) {
      for (const valueField of config.valueFields) {
        cols.push({
          id: `__total_${valueField.field}`,
          accessorKey: `__total_${valueField.field}`,
          header: () => (
            <div className="text-right">
              {`Total ${valueField.displayName || formatFieldName(valueField.field)}`}
            </div>
          ),
          cell: ({ getValue, row }) => {
            const value = getValue() as number
            const isTotal = row.original.__isGrandTotal || row.original.__isSubtotal
            return (
              <div
                className={cn(
                  'text-right font-mono font-semibold bg-muted/50',
                  isTotal && 'font-bold'
                )}
              >
                {formatNumber(value, valueField.aggregation)}
              </div>
            )
          },
          size: 150,
        })
      }
    }

    return cols
  }, [config, metadata, data])

  // Initialize TanStack Table with expansion support
  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getSubRows: (row) => row.subRows, // Tell TanStack Table where to find child rows
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  })

  // Initialize row virtualizer (for vertical scrolling)
  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 10,
  })

  const virtualRows = rowVirtualizer.getVirtualItems()
  const totalSize = rowVirtualizer.getTotalSize()

  // Get padding for virtual rows
  const paddingTop = virtualRows.length > 0 ? virtualRows[0]?.start || 0 : 0
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows[virtualRows.length - 1]?.end || 0)
      : 0

  return (
    <div className="space-y-4">
      {/* Table container with virtualization */}
      <div
        ref={parentRef}
        className="overflow-auto border rounded-lg"
        style={{ height: '600px' }}
      >
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{ width: header.getSize() }}
                    className="bg-muted/40 border-b-2 font-semibold"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {paddingTop > 0 && (
              <tr>
                <td style={{ height: `${paddingTop}px` }} />
              </tr>
            )}
            {virtualRows.map((virtualRow) => {
              const row = table.getRowModel().rows[virtualRow.index]
              if (!row) return null

              const isGrandTotal = row.original.__isGrandTotal
              const isSubtotal = row.original.__isSubtotal
              const level = row.depth
              const isParent = row.getCanExpand()

              return (
                <TableRow
                  key={row.id}
                  data-index={virtualRow.index}
                  className={cn(
                    // Base styling - clean white background for leaf rows
                    'transition-colors border-b',
                    !isParent && !isGrandTotal && !isSubtotal && 'bg-background',

                    // Parent row backgrounds - stronger "section" effect
                    isParent && level === 0 && !isGrandTotal && !isSubtotal && 'bg-muted/20 border-t border-t-muted/30',
                    isParent && level > 0 && !isGrandTotal && !isSubtotal && 'bg-muted/15',

                    // Totals styling (overrides backgrounds)
                    isGrandTotal && 'bg-accent font-bold border-t-2 border-t-border',
                    isSubtotal && 'bg-muted/30 font-semibold',

                    // Enhanced hover (only for non-total rows)
                    !isGrandTotal && !isSubtotal && isParent && 'hover:bg-muted/30 hover:shadow-sm',
                    !isGrandTotal && !isSubtotal && !isParent && 'hover:bg-muted/40 hover:shadow-sm'
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })}
            {paddingBottom > 0 && (
              <tr>
                <td style={{ height: `${paddingBottom}px` }} />
              </tr>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Table info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Showing {table.getRowModel().rows.length} rows
        </div>
        <div>
          {metadata.rowCount} rows × {metadata.columnCount} columns
        </div>
      </div>
    </div>
  )
}

// Memoize component to prevent unnecessary re-renders
export const PivotTable = memo(PivotTableComponent, (prevProps, nextProps) => {
  // Deep equality check for data and config
  return (
    prevProps.data === nextProps.data &&
    prevProps.metadata === nextProps.metadata &&
    JSON.stringify(prevProps.config) === JSON.stringify(nextProps.config)
  )
})

PivotTable.displayName = 'PivotTable'

/**
 * Generate all combinations of column values
 */
function generateCombinations(
  fields: string[],
  uniqueValues: Record<string, string[]>
): string[][] {
  if (fields.length === 0) return [[]]

  const [firstField, ...restFields] = fields
  const firstValues = uniqueValues[firstField] || []

  if (restFields.length === 0) {
    return firstValues.map((v) => [v])
  }

  const restCombinations = generateCombinations(restFields, uniqueValues)
  const combinations: string[][] = []

  for (const value of firstValues) {
    for (const rest of restCombinations) {
      combinations.push([value, ...rest])
    }
  }

  return combinations
}

/**
 * Format field name for display
 */
function formatFieldName(field: string): string {
  return field
    .split(/(?=[A-Z])|_/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Format total labels for display
 * Replaces internal __TOTAL__ markers with user-friendly text
 */
function formatTotalLabel(value: string): string {
  if (value === '__TOTAL__') return 'Total'
  if (value === '__COLUMN_TOTAL__') return 'Column Total'
  if (value === '__GRAND_TOTAL__') return 'Grand Total'
  return value
}

/**
 * Format number based on aggregation type
 */
function formatNumber(value: number | null | undefined, aggregation: string): string {
  if (value === null || value === undefined) return '—'

  const num = Number(value)
  if (isNaN(num)) return String(value)

  if (aggregation === 'count') {
    return num.toLocaleString('en-US')
  }

  if (aggregation === 'avg') {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}
