'use client'

import { useEffect, useRef, useState, memo } from 'react'
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Hash, Calendar, Type, ToggleLeft, X } from 'lucide-react'

interface DraggableFieldProps {
  field: string
  fieldType?: string
  sourceZone?: 'available' | 'rows' | 'columns'
  onRemove?: () => void
}

const DraggableFieldComponent = ({
  field,
  fieldType = 'string',
  sourceZone = 'available',
  onRemove
}: DraggableFieldProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    return draggable({
      element: el,
      getInitialData: () => ({ field, fieldType, sourceZone }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    })
  }, [field, fieldType, sourceZone])

  const getFieldIcon = () => {
    switch (fieldType) {
      case 'number':
        return <Hash className="h-3 w-3" />
      case 'date':
        return <Calendar className="h-3 w-3" />
      case 'boolean':
        return <ToggleLeft className="h-3 w-3" />
      default:
        return <Type className="h-3 w-3" />
    }
  }

  return (
    <div ref={ref} className="inline-block relative group">
      <Badge
        variant="outline"
        className={cn(
          'cursor-move select-none transition-all hover:bg-accent',
          isDragging && 'opacity-50 cursor-grabbing',
          sourceZone !== 'available' && 'pr-6'
        )}
      >
        <span className="flex items-center gap-1.5">
          {getFieldIcon()}
          <span className="font-medium">{formatFieldName(field)}</span>
        </span>
      </Badge>
      {sourceZone !== 'available' && onRemove && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute -top-1 -right-1 h-4 w-4 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-background hover:bg-destructive hover:text-destructive-foreground"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
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

/**
 * Memoized DraggableField component to prevent unnecessary re-renders
 * Only re-renders when field, fieldType, sourceZone, or onRemove changes
 */
export const DraggableField = memo(DraggableFieldComponent)
