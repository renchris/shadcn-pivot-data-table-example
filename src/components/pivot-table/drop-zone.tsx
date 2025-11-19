'use client'

import { useEffect, useRef, useState, memo, useMemo } from 'react'
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { DraggableField } from './draggable-field'
import { cn } from '../../lib/utils'

interface DropZoneProps {
  label: string
  description?: string
  fields: string[]
  onFieldAdd: (field: string, sourceZone?: 'available' | 'rows' | 'columns') => void
  onFieldRemove: (field: string) => void
  zone: 'rows' | 'columns'
  availableFields: Array<{ name: string; type: string }>
}

const DropZoneComponent = ({
  label,
  description,
  fields,
  onFieldAdd,
  onFieldRemove,
  zone,
  availableFields,
}: DropZoneProps) => {
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
        const data = source.data as {
          field: string
          fieldType?: string
          sourceZone?: 'available' | 'rows' | 'columns'
        }
        if (data.field) {
          onFieldAdd(data.field, data.sourceZone)
        }
      },
    })
  }, [onFieldAdd])

  // Memoize field type lookup to prevent unnecessary recalculations
  const getFieldType = useMemo(() => {
    return (fieldName: string): string => {
      const fieldInfo = availableFields.find((f) => f.name === fieldName)
      return fieldInfo?.type || 'string'
    }
  }, [availableFields])

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
              <DraggableField
                key={`${field}-${index}`}
                field={field}
                fieldType={getFieldType(field)}
                sourceZone={zone}
                onRemove={() => onFieldRemove(field)}
              />
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
 * Memoized DropZone component to prevent unnecessary re-renders
 * Only re-renders when props change (label, description, fields, handlers, zone, availableFields)
 */
export const DropZone = memo(DropZoneComponent)
