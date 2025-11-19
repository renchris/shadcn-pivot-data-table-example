'use client'

import { useEffect, useRef, useState, memo } from 'react'
import { createPortal } from 'react-dom'
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview'
import { preserveOffsetOnSource } from '@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'
import { Hash, Calendar, Type, ToggleLeft, X } from 'lucide-react'

type DragState =
  | { type: 'idle' }
  | { type: 'preview'; container: HTMLElement }
  | { type: 'dragging' }

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
  const [dragState, setDragState] = useState<DragState>({ type: 'idle' })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    return draggable({
      element: el,
      getInitialData: () => ({ field, fieldType, sourceZone }),
      onGenerateDragPreview({ nativeSetDragImage, location, source }) {
        setCustomNativeDragPreview({
          nativeSetDragImage,
          getOffset: preserveOffsetOnSource({
            element: source.element,
            input: location.current.input,
          }),
          render({ container }) {
            setDragState({ type: 'preview', container })
            return () => setDragState({ type: 'dragging' })
          },
        })
      },
      onDragStart() {
        setDragState({ type: 'dragging' })
      },
      onDrop() {
        setDragState({ type: 'idle' })
      },
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
    <>
      <div ref={ref} className="inline-block group">
        <Badge
          variant="outline"
          className={cn(
            'cursor-move select-none transition-all hover:bg-accent gap-1',
            dragState.type === 'dragging' && 'opacity-50 cursor-grabbing'
          )}
        >
          <span className="flex items-center gap-1.5">
            {getFieldIcon()}
            <span className="font-medium">{formatFieldName(field)}</span>
          </span>
          {sourceZone !== 'available' && onRemove && (
            <Button
              variant="ghost"
              size="sm"
              className="h-3 w-3 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-all text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation()
                onRemove()
              }}
            >
              <X className="h-2.5 w-2.5" />
            </Button>
          )}
        </Badge>
      </div>

      {/* Render preview via portal - clean Badge without wrapper div */}
      {dragState.type === 'preview' &&
        createPortal(
          <Badge variant="outline" className="cursor-grabbing gap-1">
            <span className="flex items-center gap-1.5">
              {getFieldIcon()}
              <span className="font-medium">{formatFieldName(field)}</span>
            </span>
          </Badge>,
          dragState.container
        )}
    </>
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
