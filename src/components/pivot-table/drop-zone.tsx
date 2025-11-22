'use client'

import { useEffect, useRef, useState, memo, useMemo } from 'react'
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { attachClosestEdge, extractClosestEdge, type Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge'
import { DraggableField } from './draggable-field'
import { cn } from '../../lib/utils'

interface DropZoneProps {
  label: string
  description?: string
  fields: string[]
  onFieldAdd: (field: string, sourceZone?: 'available' | 'rows' | 'columns') => void
  onFieldRemove: (field: string) => void
  onFieldReorder?: (sourceField: string, targetField: string, edge: Edge) => void
  zone: 'rows' | 'columns' | 'available'
  availableFields: Array<{ name: string; type: string }>
}

const DropZoneComponent = ({
  label,
  description,
  fields,
  onFieldAdd,
  onFieldRemove,
  onFieldReorder,
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
              <ReorderableField
                key={`${field}-${index}`}
                field={field}
                index={index}
                fieldType={getFieldType(field)}
                zone={zone}
                onRemove={() => onFieldRemove(field)}
                onReorder={onFieldReorder}
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
 * Wrapper component that makes a field droppable for reordering
 */
interface ReorderableFieldProps {
  field: string
  index: number
  fieldType: string
  zone: 'rows' | 'columns' | 'available'
  onRemove: () => void
  onReorder?: (sourceField: string, targetField: string, edge: Edge) => void
}

const ReorderableField = ({
  field,
  index,
  fieldType,
  zone,
  onRemove,
  onReorder,
}: ReorderableFieldProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !onReorder) return

    return dropTargetForElements({
      element: el,
      canDrop: ({ source }) => {
        // Only allow reordering from same zone
        const sourceData = source.data as { sourceZone?: string }
        return sourceData.sourceZone === zone
      },
      getData: ({ input, element }) => {
        const data = { field, zone }
        return attachClosestEdge(data, {
          input,
          element,
          allowedEdges: ['left', 'right'],
        })
      },
      onDragEnter: ({ self }) => {
        const edge = extractClosestEdge(self.data)
        setClosestEdge(edge)
      },
      onDrag: ({ self }) => {
        const edge = extractClosestEdge(self.data)
        setClosestEdge(edge)
      },
      onDragLeave: () => {
        setClosestEdge(null)
      },
      onDrop: ({ source, self }) => {
        const edge = extractClosestEdge(self.data)
        const sourceField = (source.data as { field: string }).field

        if (sourceField && sourceField !== field && edge && onReorder) {
          onReorder(sourceField, field, edge)
        }

        setClosestEdge(null)
      },
    })
  }, [field, zone, onReorder])

  return (
    <div ref={ref} className="relative">
      <DraggableField
        field={field}
        fieldType={fieldType}
        sourceZone={zone}
        onRemove={onRemove}
        index={index}
      />
      {/* Drop indicator line */}
      {closestEdge === 'left' && (
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary rounded-full" />
      )}
      {closestEdge === 'right' && (
        <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-primary rounded-full" />
      )}
    </div>
  )
}

/**
 * Memoized DropZone component to prevent unnecessary re-renders
 * Only re-renders when props change (label, description, fields, handlers, zone, availableFields)
 */
export const DropZone = memo(DropZoneComponent)
