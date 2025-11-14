'use client'

import { useEffect, useRef, useState } from 'react'
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

interface DropZoneProps {
  label: string
  description?: string
  fields: string[]
  onFieldAdd: (field: string) => void
  onFieldRemove: (field: string) => void
  zone: 'rows' | 'columns'
}

export function DropZone({
  label,
  description,
  fields,
  onFieldAdd,
  onFieldRemove,
  zone,
}: DropZoneProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isDraggedOver, setIsDraggedOver] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    return dropTargetForElements({
      element: el,
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: ({ source }) => {
        setIsDraggedOver(false)
        const data = source.data as { field: string; fieldType?: string }
        if (data.field) {
          onFieldAdd(data.field)
        }
      },
    })
  }, [onFieldAdd])

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">{label}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-3">{description}</p>
      )}
      <div
        ref={ref}
        className={cn(
          'min-h-[80px] p-3 border-2 border-dashed rounded-lg transition-colors',
          isDraggedOver
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 bg-muted/20',
          fields.length === 0 && 'flex items-center justify-center'
        )}
      >
        {fields.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {fields.map((field, index) => (
              <Badge
                key={`${field}-${index}`}
                variant="secondary"
                className="pl-3 pr-1 py-1.5 text-sm font-medium"
              >
                <span>{formatFieldName(field)}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-2 hover:bg-destructive/20"
                  onClick={() => onFieldRemove(field)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {field}</span>
                </Button>
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center">
            Drag fields here
          </p>
        )}
      </div>
    </div>
  )
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
