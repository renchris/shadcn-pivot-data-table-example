'use server'

import { cache } from 'react'
import { transformToPivot } from '@/lib/pivot/transformer'
import {
  PivotConfigSchema,
  type PivotConfig,
  type PivotResult,
  type ExportFormat,
} from '@/lib/pivot/schemas'

/**
 * Execute pivot transformation
 * Cached for 1 hour to improve performance
 */
export const executePivot = cache(async (config: unknown): Promise<PivotResult> => {
  // Validate configuration
  const validatedConfig = PivotConfigSchema.parse(config)

  // Fetch data (in production, this would come from your database/API)
  const rawData = await fetchDataSource()

  // Transform to pivot
  const result = transformToPivot(rawData, validatedConfig)

  return result
})

/**
 * Fetch data from source
 * This is a placeholder - replace with your actual data fetching logic
 */
async function fetchDataSource(): Promise<any[]> {
  // OPTION A: Fetch from external API
  // const response = await fetch('https://your-api.com/data', {
  //   headers: { 'Authorization': `Bearer ${process.env.API_KEY}` }
  // })
  // return response.json()

  // OPTION B: Fetch from database
  // const { db } = await import('@/lib/db')
  // return db.sales.findMany()

  // OPTION C: Use sample data (for development)
  return generateSampleData()
}

/**
 * Generate sample sales data for demonstration
 */
export async function generateSampleData(): Promise<any[]> {
  const regions = ['North', 'South', 'East', 'West']
  const products = ['Product A', 'Product B', 'Product C', 'Product D']
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4']
  const years = ['2023', '2024']
  const salesPeople = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve']

  const data: any[] = []
  let id = 1

  for (const year of years) {
    for (const quarter of quarters) {
      for (const region of regions) {
        for (const product of products) {
          for (const salesPerson of salesPeople) {
            // Generate random metrics
            const sales = Math.floor(Math.random() * 100000) + 10000
            const units = Math.floor(Math.random() * 500) + 50
            const cost = sales * (0.6 + Math.random() * 0.2)
            const profit = sales - cost

            data.push({
              id: id++,
              year,
              quarter,
              region,
              product,
              salesPerson,
              sales,
              units,
              cost: Math.floor(cost),
              profit: Math.floor(profit),
              date: `${year}-${quarters.indexOf(quarter) * 3 + 1}-01`,
            })
          }
        }
      }
    }
  }

  return data
}

/**
 * Export pivot data to different formats
 */
export async function exportPivot(
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
function generateCSV(data: any[]): string {
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
 */
async function generateExcel(data: any[]): Promise<Blob> {
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
export async function getUniqueFieldValues(field: string): Promise<string[]> {
  const data = await fetchDataSource()
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
export async function getAvailableFields(): Promise<Array<{ name: string; type: string }>> {
  const data = await fetchDataSource()

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
