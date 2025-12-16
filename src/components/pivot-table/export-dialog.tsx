'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Download, Loader2 } from 'lucide-react'
import { exportPivotData } from '../../lib/pivot/export'
import type { ExportFormat } from '../../lib/pivot/schemas'
import { cn } from '../../lib/utils'

interface ExportDialogProps {
  /** Pivot data to export */
  data: any[]
  /** Optional filename (without extension) */
  filename?: string
  /** Additional CSS class names for the trigger button */
  className?: string
  /** Inline styles for the trigger button */
  style?: React.CSSProperties
  /** Additional CSS class names for the dialog content */
  dialogClassName?: string
  /** Inline styles for the dialog content */
  dialogStyle?: React.CSSProperties
}

export function ExportDialog({
  data,
  filename = 'pivot-export',
  className,
  style,
  dialogClassName,
  dialogStyle
}: ExportDialogProps) {
  const [open, setOpen] = useState(false)
  const [format, setFormat] = useState<ExportFormat>('csv')
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const result = await exportPivotData(data, format)

      // Download the file
      let blob: Blob
      let downloadFilename: string

      if (format === 'csv') {
        blob = new Blob([result as string], { type: 'text/csv' })
        downloadFilename = `${filename}-${Date.now()}.csv`
      } else if (format === 'excel') {
        blob = result as Blob
        downloadFilename = `${filename}-${Date.now()}.xlsx`
      } else {
        blob = new Blob([result as string], { type: 'application/json' })
        downloadFilename = `${filename}-${Date.now()}.json`
      }

      // Create download link
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = downloadFilename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setOpen(false)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={className} style={style}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className={cn("sm:max-w-md", dialogClassName)} style={dialogStyle}>
        <DialogHeader>
          <DialogTitle>Export Pivot Table</DialogTitle>
          <DialogDescription>
            Choose a format to export your pivot table data
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <RadioGroup value={format} onValueChange={(value) => setFormat(value as ExportFormat)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="csv" id="csv" />
              <Label htmlFor="csv" className="flex-1 cursor-pointer">
                <div>
                  <div className="font-medium">CSV</div>
                  <div className="text-sm text-muted-foreground">
                    Comma-separated values, compatible with Excel and other tools
                  </div>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="excel" id="excel" />
              <Label htmlFor="excel" className="flex-1 cursor-pointer">
                <div>
                  <div className="font-medium">Excel</div>
                  <div className="text-sm text-muted-foreground">
                    Microsoft Excel format with formatting
                  </div>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="json" id="json" />
              <Label htmlFor="json" className="flex-1 cursor-pointer">
                <div>
                  <div className="font-medium">JSON</div>
                  <div className="text-sm text-muted-foreground">
                    Structured data format for API integration
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
