/**
 * Export utilities for pivot data
 * Supports CSV, Excel, and JSON formats
 */

import type { ExportFormat } from './schemas'

/**
 * Export pivot data to different formats
 */
export async function exportPivotData(
  data: any[],
  format: ExportFormat
): Promise<string | Blob> {
  switch (format) {
    case 'csv':
      return generateCSV(data)

    case 'excel':
      return await generateExcel(data)

    case 'json':
      return JSON.stringify(data, null, 2)

    default:
      throw new Error(`Unsupported export format: ${format}`)
  }
}

/**
 * Generate CSV from pivot data
 */
export function generateCSV(data: any[]): string {
  if (data.length === 0) return ''

  // Get all keys (columns)
  const keys = Object.keys(data[0]).filter(key => !key.startsWith('__'))

  // Create header row
  const header = keys.join(',')

  // Create data rows
  const rows = data.map(row => {
    return keys.map(key => {
      const value = row[key]
      // Handle values with commas or quotes
      if (value === null || value === undefined) return ''
      const strValue = String(value)
      if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
        return `"${strValue.replace(/"/g, '""')}"`
      }
      return strValue
    }).join(',')
  })

  return [header, ...rows].join('\n')
}

/**
 * Generate Excel file from pivot data
 * Returns a Blob that can be downloaded
 *
 * @requires exceljs - Make sure to install exceljs as an optional dependency
 */
export async function generateExcel(data: any[]): Promise<Blob> {
  const ExcelJS = await import('exceljs')
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Pivot Data')

  if (data.length === 0) {
    return new Blob([], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  }

  // Get columns
  const keys = Object.keys(data[0]).filter(key => !key.startsWith('__'))

  // Add header row
  worksheet.addRow(keys)

  // Style header
  worksheet.getRow(1).font = { bold: true }
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' }
  }

  // Add data rows
  data.forEach(row => {
    const values = keys.map(key => row[key])
    const excelRow = worksheet.addRow(values)

    // Style total rows
    if (row.__isGrandTotal || row.__isSubtotal) {
      excelRow.font = { bold: true }
      excelRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: row.__isGrandTotal ? 'FFFFEB3B' : 'FFFFFFFF' }
      }
    }
  })

  // Auto-fit columns
  worksheet.columns.forEach(column => {
    let maxLength = 0
    column.eachCell?.({ includeEmpty: false }, cell => {
      const length = String(cell.value).length
      if (length > maxLength) {
        maxLength = length
      }
    })
    column.width = Math.min(maxLength + 2, 50)
  })

  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer()
  return new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  })
}

/**
 * Get unique values for a specific field
 * Useful for populating filter dropdowns
 */
export function getUniqueFieldValues(data: any[], field: string): string[] {
  const uniqueValues = new Set<string>()

  for (const row of data) {
    if (row[field] !== null && row[field] !== undefined) {
      uniqueValues.add(String(row[field]))
    }
  }

  return Array.from(uniqueValues).sort()
}

/**
 * Get available fields from the data source
 * Returns field names and their types
 */
export function getAvailableFields(data: any[]): Array<{ name: string; type: string }> {
  if (data.length === 0) {
    return []
  }

  const firstRow = data[0]
  const fields = Object.keys(firstRow).map(name => {
    const value = firstRow[name]
    let type = 'string'

    if (typeof value === 'number') {
      type = 'number'
    } else if (value instanceof Date) {
      type = 'date'
    } else if (typeof value === 'boolean') {
      type = 'boolean'
    }

    return { name, type }
  })

  return fields
}

/**
 * Download a blob as a file
 * Helper for client-side file downloads
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Download a string as a file
 * Helper for client-side file downloads
 */
export function downloadString(content: string, filename: string, mimeType: string = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType })
  downloadBlob(blob, filename)
}
