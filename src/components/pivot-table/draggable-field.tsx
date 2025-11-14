'use client'

import { useEffect, useRef, useState } from 'react'
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Hash, Calendar, Type, ToggleLeft } from 'lucide-react'

interface DraggableFieldProps {
  field: string
  fieldType?: string
  onRemove?: () => void
}

export function DraggableField({ field, fieldType = 'string', onRemove }: DraggableFieldProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    return draggable({
      element: el,
      getInitialData: () => ({ field, fieldType }),
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    })
  }, [field, fieldType])

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
    <div ref={ref} className="inline-block">
      <Badge
        variant="outline"
        className={cn(
          'cursor-move select-none transition-all hover:bg-accent',
          isDragging && 'opacity-50 cursor-grabbing'
        )}
      >
        <span className="flex items-center gap-1.5">
          {getFieldIcon()}
          <span className="font-medium">{formatFieldName(field)}</span>
        </span>
      </Badge>
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
