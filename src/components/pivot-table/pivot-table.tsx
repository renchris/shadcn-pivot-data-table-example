'use client'

import { useMemo, useRef, memo } from 'react'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
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

  // Generate column definitions dynamically based on configuration
  const columns = useMemo<ColumnDef<PivotRow>[]>(() => {
    const cols: ColumnDef<PivotRow>[] = []

    // Add row field columns
    for (const field of config.rowFields) {
      cols.push({
        id: field,
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

    // Add value columns (with pivot columns if configured)
    if (config.columnFields.length === 0) {
      // No pivot columns - simple value columns
      for (const valueField of config.valueFields) {
        cols.push({
          id: valueField.field,
          accessorKey: valueField.displayName || valueField.field,
          header: valueField.displayName || formatFieldName(valueField.field),
          cell: ({ getValue }) => {
            const value = getValue() as number
            return (
              <div className="text-right font-mono">
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
          id: generateColumnKey(combination, valueField.displayName || valueField.field),
          accessorKey: generateColumnKey(combination, valueField.displayName || valueField.field),
          header: valueField.displayName || formatFieldName(valueField.field),
          cell: ({ getValue, row }) => {
            const value = getValue() as number
            const isTotal = row.original.__isGrandTotal || row.original.__isSubtotal
            return (
              <div
                className={cn(
                  'text-right font-mono',
                  isTotal && 'font-bold'
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
          header: `Total ${valueField.displayName || formatFieldName(valueField.field)}`,
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
  }, [config, metadata])

  // Initialize TanStack Table
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
                    className="bg-muted font-semibold"
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

              return (
                <TableRow
                  key={row.id}
                  data-index={virtualRow.index}
                  className={cn(
                    isGrandTotal && 'bg-accent font-bold border-t-2 border-t-border',
                    isSubtotal && 'bg-muted/30 font-semibold'
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
function formatNumber(value: any, aggregation: string): string {
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
