import { cn } from './chunk-KUMWZD66.mjs';
export { cn } from './chunk-KUMWZD66.mjs';
import { exportPivotData } from './chunk-SO753ZME.mjs';
import { generateColumnKey, transformToPivot } from './chunk-SZDQ7MDO.mjs';
export { AggregationFunctionSchema, ExportConfigSchema, ExportFormatSchema, PivotConfigSchema, PivotMetadataSchema, PivotResultSchema, ValueFieldConfigSchema, aggregate, aggregationFunctions, avg, count, first, formatAggregationName, generateColumnKey, getAggregationFunction, last, max, median, min, parseColumnKey, sum, transformToPivot } from './chunk-SZDQ7MDO.mjs';
import { memo, useRef, useState, useMemo, useCallback, useEffect, useTransition } from 'react';
import isEqual from 'fast-deep-equal';
import { useReactTable, getExpandedRowModel, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ChevronDown, ChevronRight, X, Type, ToggleLeft, Calendar, Hash, Settings2, Loader2, RefreshCw, XIcon, CircleIcon, Download, CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useRouter, usePathname } from 'next/navigation';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { createPortal } from 'react-dom';
import { draggable, dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { preserveOffsetOnSource } from '@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source';
import { extractClosestEdge, attachClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as LabelPrimitive from '@radix-ui/react-label';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import * as SelectPrimitive from '@radix-ui/react-select';

function Table({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "table",
    {
      "data-slot": "table",
      className: cn("w-full caption-bottom text-sm", className),
      ...props
    }
  );
}
function TableHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "thead",
    {
      "data-slot": "table-header",
      className: cn("[&_tr]:border-b", className),
      ...props
    }
  );
}
function TableBody({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "tbody",
    {
      "data-slot": "table-body",
      className: cn("[&_tr:last-child]:border-0", className),
      ...props
    }
  );
}
function TableFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "tfoot",
    {
      "data-slot": "table-footer",
      className: cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      ),
      ...props
    }
  );
}
function TableRow({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "tr",
    {
      "data-slot": "table-row",
      className: cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className
      ),
      ...props
    }
  );
}
function TableHead({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "th",
    {
      "data-slot": "table-head",
      className: cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      ),
      ...props
    }
  );
}
function TableCell({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "td",
    {
      "data-slot": "table-cell",
      className: cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      ),
      ...props
    }
  );
}
function TableCaption({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "caption",
    {
      "data-slot": "table-caption",
      className: cn("text-muted-foreground mt-4 text-sm", className),
      ...props
    }
  );
}
var PivotTableComponent = ({
  data,
  config,
  metadata,
  className,
  style,
  ...props
}) => {
  const parentRef = useRef(null);
  const [expanded, setExpanded] = useState(
    () => config.options.expandedByDefault ? true : {}
  );
  const columns = useMemo(() => {
    const cols = [];
    if (config.rowFields.length === 0 && config.columnFields.length === 0) {
      const firstRow = data[0];
      if (firstRow) {
        const allKeys = [...new Set(Object.keys(firstRow))].filter((key) => !key.startsWith("__"));
        return allKeys.map((key, index) => ({
          id: `unpivoted_${key}_${index}`,
          // Ensure unique ID
          accessorFn: (row) => row[key],
          // Use accessor function instead of accessorKey
          header: formatFieldName(key),
          cell: ({ getValue }) => {
            const value = getValue();
            if (typeof value === "number") {
              return /* @__PURE__ */ jsx("div", { className: "text-right font-mono", children: value.toLocaleString() });
            }
            return /* @__PURE__ */ jsx("div", { className: "text-left", children: String(value ?? "") });
          },
          size: 150,
          meta: {
            isFirstColumn: index === 0
          }
        }));
      }
      return [];
    }
    if (config.rowFields.length > 1) {
      cols.push({
        id: "row_hierarchy",
        // Use accessorFn to dynamically select the correct field based on row depth
        accessorFn: (row) => {
          const level = row.__level || 0;
          const fieldIndex = Math.min(level, config.rowFields.length - 1);
          const field = config.rowFields[fieldIndex];
          return row[field];
        },
        header: config.rowFields.map(formatFieldName).join(" / "),
        cell: ({ row, getValue }) => {
          const value = getValue();
          const level = row.depth;
          const isTotal = row.original.__isGrandTotal || row.original.__isSubtotal;
          const canExpand = row.getCanExpand();
          const isExpanded = row.getIsExpanded();
          return /* @__PURE__ */ jsxs(
            "div",
            {
              onClick: canExpand ? row.getToggleExpandedHandler() : void 0,
              className: cn(
                "flex items-center gap-2 transition-all",
                // Font weight hierarchy based on level
                level === 0 && canExpand && "font-semibold",
                level === 1 && canExpand && "font-medium",
                level >= 2 && "font-normal",
                // Totals override
                isTotal && "font-bold",
                // Enhanced vertical guide for parent rows
                canExpand && level > 0 && "border-l-2 border-muted/50 pl-3 hover:border-l-muted",
                // Cursor pointer for expandable rows
                canExpand && "cursor-pointer"
              ),
              style: { paddingLeft: `${level * 1.5}rem` },
              children: [
                canExpand ? /* @__PURE__ */ jsx("div", { className: "w-7 flex items-center justify-center shrink-0", children: isExpanded ? /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 text-muted-foreground" }) : /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground" }) }) : /* @__PURE__ */ jsx("span", { className: "w-7" }),
                /* @__PURE__ */ jsx("span", { children: formatTotalLabel(value) })
              ]
            }
          );
        },
        size: 250,
        meta: {
          isFirstColumn: true
        }
      });
    } else {
      for (const field of config.rowFields) {
        const isFirstColumn = field === config.rowFields[0];
        cols.push({
          id: `row_${field}`,
          accessorKey: field,
          header: formatFieldName(field),
          cell: ({ row, getValue }) => {
            const value = getValue();
            const level = row.original.__level || 0;
            const isTotal = row.original.__isGrandTotal || row.original.__isSubtotal;
            return /* @__PURE__ */ jsx(
              "div",
              {
                className: cn(
                  "font-medium",
                  isTotal && "font-bold",
                  level > 0 && `pl-${level * 4}`
                ),
                children: formatTotalLabel(value)
              }
            );
          },
          size: 200,
          meta: {
            isFirstColumn
          }
        });
      }
    }
    if (config.columnFields.length === 0) {
      for (const valueField of config.valueFields) {
        cols.push({
          id: `value_${valueField.field}_${valueField.aggregation}`,
          accessorKey: valueField.displayName || valueField.field,
          header: () => /* @__PURE__ */ jsx("div", { className: "text-right", children: valueField.displayName || formatFieldName(valueField.field) }),
          cell: ({ getValue, row }) => {
            const value = getValue();
            const isTotal = row.original.__isGrandTotal || row.original.__isSubtotal;
            const canExpand = row.getCanExpand();
            return /* @__PURE__ */ jsx(
              "div",
              {
                className: cn(
                  "text-right font-mono",
                  isTotal && "font-bold",
                  canExpand && !isTotal && "font-semibold"
                ),
                children: formatNumber(value, valueField.aggregation)
              }
            );
          },
          size: 150
        });
      }
    } else {
      const uniqueValues = metadata.uniqueValues || {};
      const columnCombinations = generateCombinations(config.columnFields, uniqueValues);
      for (const combination of columnCombinations) {
        const groupLabel = combination.join(" - ");
        const groupColumns = config.valueFields.map((valueField) => ({
          id: `pivot_${generateColumnKey(combination, valueField.displayName || valueField.field)}`,
          accessorKey: generateColumnKey(combination, valueField.displayName || valueField.field),
          header: () => /* @__PURE__ */ jsx("div", { className: "text-right", children: valueField.displayName || formatFieldName(valueField.field) }),
          cell: ({ getValue, row }) => {
            const value = getValue();
            const isTotal = row.original.__isGrandTotal || row.original.__isSubtotal;
            const canExpand = row.getCanExpand();
            return /* @__PURE__ */ jsx(
              "div",
              {
                className: cn(
                  "text-right font-mono",
                  isTotal && "font-bold",
                  canExpand && !isTotal && "font-semibold"
                ),
                children: formatNumber(value, valueField.aggregation)
              }
            );
          },
          size: 120
        }));
        if (groupColumns.length > 1) {
          cols.push({
            id: `group-${groupLabel}`,
            header: groupLabel,
            columns: groupColumns
          });
        } else {
          cols.push({
            ...groupColumns[0],
            header: `${groupLabel} - ${groupColumns[0].header}`
          });
        }
      }
    }
    if (config.options.showRowTotals && config.columnFields.length > 0) {
      for (const valueField of config.valueFields) {
        cols.push({
          id: `__total_${valueField.field}_${valueField.aggregation}`,
          accessorKey: `__total_${valueField.displayName || valueField.field}`,
          header: () => /* @__PURE__ */ jsx("div", { className: "text-right", children: `Total ${valueField.displayName || formatFieldName(valueField.field)}` }),
          cell: ({ getValue, row }) => {
            const value = getValue();
            const isTotal = row.original.__isGrandTotal || row.original.__isSubtotal;
            return /* @__PURE__ */ jsx(
              "div",
              {
                className: cn(
                  "text-right font-mono font-semibold bg-muted/50",
                  isTotal && "font-bold"
                ),
                children: formatNumber(value, valueField.aggregation)
              }
            );
          },
          size: 150
        });
      }
    }
    return cols;
  }, [config, metadata, data]);
  const table = useReactTable({
    data,
    columns,
    state: {
      expanded
    },
    onExpandedChange: setExpanded,
    getSubRows: (row) => row.subRows,
    // Tell TanStack Table where to find child rows
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel()
  });
  const getScrollElement = useCallback(() => parentRef.current, []);
  const estimateSize = useCallback(() => 35, []);
  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement,
    estimateSize,
    overscan: 10
  });
  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();
  const paddingTop = virtualRows.length > 0 ? virtualRows[0]?.start || 0 : 0;
  const paddingBottom = virtualRows.length > 0 ? totalSize - (virtualRows[virtualRows.length - 1]?.end || 0) : 0;
  return /* @__PURE__ */ jsxs("div", { className: cn("space-y-4", className), style, ...props, children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: parentRef,
        className: "overflow-auto border rounded-lg",
        style: { height: "600px" },
        children: /* @__PURE__ */ jsxs(Table, { children: [
          /* @__PURE__ */ jsx(TableHeader, { className: "sticky top-0 z-30", children: table.getHeaderGroups().map((headerGroup) => /* @__PURE__ */ jsx(TableRow, { children: headerGroup.headers.map((header, headerIndex) => {
            const isFirstColumn = header.column.columnDef.meta?.isFirstColumn || headerIndex === 0;
            return /* @__PURE__ */ jsx(
              TableHead,
              {
                colSpan: header.colSpan,
                style: { width: header.getSize() },
                className: cn(
                  // iOS 26 Liquid Glass - multi-layer effect with specular highlights
                  "font-semibold",
                  isFirstColumn ? "sticky left-0 z-50 liquid-glass-intersection" : "z-10 liquid-glass-header"
                ),
                children: header.isPlaceholder ? null : flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )
              },
              header.id
            );
          }) }, headerGroup.id)) }),
          /* @__PURE__ */ jsxs(TableBody, { children: [
            paddingTop > 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx(
              "td",
              {
                colSpan: table.getVisibleFlatColumns().length,
                style: { height: `${paddingTop}px` }
              }
            ) }),
            virtualRows.map((virtualRow) => {
              const row = table.getRowModel().rows[virtualRow.index];
              if (!row) return null;
              const isGrandTotal = row.original.__isGrandTotal;
              const isSubtotal = row.original.__isSubtotal;
              const level = row.depth;
              const isParent = row.getCanExpand();
              return /* @__PURE__ */ jsx(
                TableRow,
                {
                  "data-index": virtualRow.index,
                  className: cn(
                    // Base styling - clean white background for leaf rows
                    "transition-colors border-b",
                    !isParent && !isGrandTotal && !isSubtotal && "bg-background",
                    // Parent row backgrounds - stronger "section" effect
                    isParent && level === 0 && !isGrandTotal && !isSubtotal && "bg-muted/20 border-t border-t-muted/30",
                    isParent && level > 0 && !isGrandTotal && !isSubtotal && "bg-muted/15",
                    // Totals styling (overrides backgrounds)
                    isGrandTotal && "bg-accent font-bold border-t-2 border-t-border",
                    isSubtotal && "bg-muted/30 font-semibold",
                    // Enhanced hover (only for non-total rows)
                    !isGrandTotal && !isSubtotal && isParent && "hover:bg-muted/30 hover:shadow-sm",
                    !isGrandTotal && !isSubtotal && !isParent && "hover:bg-muted/40 hover:shadow-sm"
                  ),
                  children: row.getVisibleCells().map((cell, cellIndex) => {
                    const isFirstCol = cell.column.columnDef.meta?.isFirstColumn || cellIndex === 0;
                    return /* @__PURE__ */ jsx(
                      TableCell,
                      {
                        style: { width: cell.column.getSize() },
                        className: cn(
                          // iOS 26 Liquid Glass for sticky first column
                          isFirstCol && "sticky left-0 z-20",
                          // Apply appropriate liquid glass variant based on row type
                          isFirstCol && !isGrandTotal && !isSubtotal && !isParent && "liquid-glass-cell",
                          isFirstCol && (isGrandTotal || isSubtotal) && "liquid-glass-cell-accent",
                          isFirstCol && isParent && !isGrandTotal && !isSubtotal && "liquid-glass-cell-muted"
                        ),
                        children: flexRender(cell.column.columnDef.cell, cell.getContext())
                      },
                      cell.id
                    );
                  })
                },
                row.id
              );
            }),
            paddingBottom > 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx(
              "td",
              {
                colSpan: table.getVisibleFlatColumns().length,
                style: { height: `${paddingBottom}px` }
              }
            ) })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        "Showing ",
        table.getRowModel().rows.length,
        " rows"
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        metadata.rowCount,
        " rows \xD7 ",
        metadata.columnCount,
        " columns"
      ] })
    ] })
  ] });
};
var PivotTable = memo(PivotTableComponent, (prevProps, nextProps) => {
  return prevProps.data === nextProps.data && prevProps.metadata === nextProps.metadata && prevProps.className === nextProps.className && prevProps.style === nextProps.style && isEqual(prevProps.config, nextProps.config);
});
PivotTable.displayName = "PivotTable";
function generateCombinations(fields, uniqueValues) {
  if (fields.length === 0) return [[]];
  const [firstField, ...restFields] = fields;
  const firstValues = uniqueValues[firstField] || [];
  if (restFields.length === 0) {
    return firstValues.map((v) => [v]);
  }
  const restCombinations = generateCombinations(restFields, uniqueValues);
  const combinations = [];
  for (const value of firstValues) {
    for (const rest of restCombinations) {
      combinations.push([value, ...rest]);
    }
  }
  return combinations;
}
function formatFieldName(field) {
  return field.split(/(?=[A-Z])|_/).map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
}
function formatTotalLabel(value) {
  if (value === "__TOTAL__") return "Total";
  if (value === "__COLUMN_TOTAL__") return "Column Total";
  if (value === "__GRAND_TOTAL__") return "Grand Total";
  return value;
}
function formatNumber(value, aggregation) {
  if (value === null || value === void 0) return "\u2014";
  const num = Number(value);
  if (isNaN(num)) return String(value);
  if (aggregation === "count") {
    return num.toLocaleString("en-US");
  }
  if (aggregation === "avg") {
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
}
function Card({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      role: "article",
      "data-slot": "card",
      className: cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      ),
      ...props
    }
  );
}
function CardHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-header",
      className: cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      ),
      ...props
    }
  );
}
function CardTitle({
  className,
  as: Component = "h3",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Component,
    {
      "data-slot": "card-title",
      className: cn("leading-none font-semibold", className),
      ...props
    }
  );
}
function CardDescription({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-content",
      className: cn("px-6", className),
      ...props
    }
  );
}
function CardFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-footer",
      className: cn("flex items-center px-6 [.border-t]:pt-6", className),
      ...props
    }
  );
}
var buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SeparatorPrimitive.Root,
    {
      "data-slot": "separator",
      decorative,
      orientation,
      className: cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      ),
      ...props
    }
  );
}
var badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive: "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({
  className,
  variant,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "span";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "badge",
      className: cn(badgeVariants({ variant }), className),
      ...props
    }
  );
}
var DraggableFieldComponent = ({
  field,
  fieldType = "string",
  sourceZone = "available",
  onRemove,
  inUse = false,
  index,
  className,
  style
}) => {
  const ref = useRef(null);
  const [dragState, setDragState] = useState({ type: "idle" });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return draggable({
      element: el,
      getInitialData: () => ({ field, fieldType, sourceZone }),
      onGenerateDragPreview({ nativeSetDragImage, location, source }) {
        setCustomNativeDragPreview({
          nativeSetDragImage,
          getOffset: preserveOffsetOnSource({
            element: source.element,
            input: location.current.input
          }),
          render({ container }) {
            setDragState({ type: "preview", container });
            return () => setDragState({ type: "dragging" });
          }
        });
      },
      onDragStart() {
        setDragState({ type: "dragging" });
      },
      onDrop() {
        setDragState({ type: "idle" });
      }
    });
  }, [field, fieldType, sourceZone]);
  const getFieldIcon = () => {
    switch (fieldType) {
      case "number":
        return /* @__PURE__ */ jsx(Hash, { className: "h-3 w-3" });
      case "date":
        return /* @__PURE__ */ jsx(Calendar, { className: "h-3 w-3" });
      case "boolean":
        return /* @__PURE__ */ jsx(ToggleLeft, { className: "h-3 w-3" });
      default:
        return /* @__PURE__ */ jsx(Type, { className: "h-3 w-3" });
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { ref, className: "inline-block group relative", children: [
      /* @__PURE__ */ jsxs(
        Badge,
        {
          variant: "outline",
          className: cn(
            "cursor-move select-none transition-all hover:bg-accent gap-1",
            dragState.type === "dragging" && "opacity-50 cursor-grabbing",
            inUse && "bg-primary/10 border-primary/30",
            className
          ),
          style,
          children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
              getFieldIcon(),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: formatFieldName2(field) }),
              inUse && /* @__PURE__ */ jsx("span", { className: "text-[10px] font-semibold text-primary", children: "IN USE" })
            ] }),
            sourceZone !== "available" && onRemove && /* @__PURE__ */ jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                className: "h-3 w-3 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-all text-muted-foreground hover:text-foreground",
                onClick: (e) => {
                  e.stopPropagation();
                  onRemove();
                },
                children: /* @__PURE__ */ jsx(X, { className: "h-2.5 w-2.5" })
              }
            )
          ]
        }
      ),
      index !== void 0 && sourceZone !== "available" && /* @__PURE__ */ jsx("span", { className: "absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold flex items-center justify-center shadow-sm", children: index + 1 })
    ] }),
    dragState.type === "preview" && createPortal(
      /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "cursor-grabbing gap-1", children: /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
        getFieldIcon(),
        /* @__PURE__ */ jsx("span", { className: "font-medium", children: formatFieldName2(field) })
      ] }) }),
      dragState.container
    )
  ] });
};
function formatFieldName2(field) {
  return field.split(/(?=[A-Z])|_/).map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
}
var DraggableField = memo(DraggableFieldComponent);
var DropZoneComponent = ({
  label,
  description,
  fields,
  onFieldAdd,
  onFieldRemove,
  onFieldReorder,
  zone,
  availableFields,
  className,
  style,
  dropAreaClassName
}) => {
  const ref = useRef(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return dropTargetForElements({
      element: el,
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: ({ source }) => {
        setIsDraggedOver(false);
        const data = source.data;
        if (data.field) {
          onFieldAdd(data.field, data.sourceZone);
        }
      }
    });
  }, [onFieldAdd]);
  const getFieldType = useMemo(() => {
    return (fieldName) => {
      const fieldInfo = availableFields.find((f) => f.name === fieldName);
      return fieldInfo?.type || "string";
    };
  }, [availableFields]);
  return /* @__PURE__ */ jsxs("div", { className, style, children: [
    /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium mb-2", children: label }),
    description && /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-3", children: description }),
    /* @__PURE__ */ jsx(
      "div",
      {
        ref,
        className: cn(
          "min-h-[80px] p-3 border-2 border-dashed rounded-lg transition-colors",
          isDraggedOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 bg-muted/20",
          fields.length === 0 && "flex items-center justify-center",
          dropAreaClassName
        ),
        children: fields.length > 0 ? /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: fields.map((field, index) => /* @__PURE__ */ jsx(
          ReorderableField,
          {
            field,
            index,
            fieldType: getFieldType(field),
            zone,
            onRemove: () => onFieldRemove(field),
            onReorder: onFieldReorder
          },
          field
        )) }) : /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground text-center", children: "Drag fields here" })
      }
    )
  ] });
};
var ReorderableFieldComponent = ({
  field,
  index,
  fieldType,
  zone,
  onRemove,
  onReorder
}) => {
  const ref = useRef(null);
  const [closestEdge, setClosestEdge] = useState(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !onReorder) return;
    return dropTargetForElements({
      element: el,
      canDrop: ({ source }) => {
        const sourceData = source.data;
        return sourceData.sourceZone === zone;
      },
      getData: ({ input, element }) => {
        const data = { field, zone };
        return attachClosestEdge(data, {
          input,
          element,
          allowedEdges: ["left", "right"]
        });
      },
      onDragEnter: ({ self }) => {
        const edge = extractClosestEdge(self.data);
        setClosestEdge(edge);
      },
      onDrag: ({ self }) => {
        const edge = extractClosestEdge(self.data);
        setClosestEdge(edge);
      },
      onDragLeave: () => {
        setClosestEdge(null);
      },
      onDrop: ({ source, self }) => {
        const edge = extractClosestEdge(self.data);
        const sourceField = source.data.field;
        if (sourceField && sourceField !== field && edge && onReorder) {
          onReorder(sourceField, field, edge);
        }
        setClosestEdge(null);
      }
    });
  }, [field, zone, onReorder]);
  return /* @__PURE__ */ jsxs("div", { ref, className: "relative", children: [
    /* @__PURE__ */ jsx(
      DraggableField,
      {
        field,
        fieldType,
        sourceZone: zone,
        onRemove,
        index
      }
    ),
    closestEdge === "left" && /* @__PURE__ */ jsx("div", { className: "absolute left-0 top-0 bottom-0 w-0.5 bg-primary rounded-full" }),
    closestEdge === "right" && /* @__PURE__ */ jsx("div", { className: "absolute right-0 top-0 bottom-0 w-0.5 bg-primary rounded-full" })
  ] });
};
var ReorderableField = memo(ReorderableFieldComponent);
var DropZone = memo(DropZoneComponent);
function PivotPanel({
  config,
  defaultConfig,
  availableFields,
  onConfigChange,
  className,
  style
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isAvailableDraggedOver, setIsAvailableDraggedOver] = useState(false);
  const availableFieldsRef = useRef(null);
  const debounceTimeoutRef = useRef(null);
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);
  const getAvailableFields = useCallback(() => {
    const usedFields = /* @__PURE__ */ new Set([
      ...config.rowFields,
      ...config.columnFields,
      ...config.valueFields.map((v) => v.field)
    ]);
    return availableFields.map((f) => ({
      ...f,
      inUse: usedFields.has(f.name)
    }));
  }, [config, availableFields]);
  const updateURLImmediate = useCallback((newConfig) => {
    const params = new URLSearchParams();
    if (newConfig.rowFields.length > 0) {
      params.set("rows", newConfig.rowFields.join(","));
    }
    if (newConfig.columnFields.length > 0) {
      params.set("columns", newConfig.columnFields.join(","));
    }
    params.set("showRowTotals", String(newConfig.options.showRowTotals));
    params.set("showColumnTotals", String(newConfig.options.showColumnTotals));
    params.set("showGrandTotal", String(newConfig.options.showGrandTotal));
    startTransition(() => {
      router.push(pathname + "?" + params.toString());
    });
  }, [router, pathname, startTransition]);
  const updateURLDebounced = useCallback((newConfig) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      updateURLImmediate(newConfig);
    }, 100);
  }, [updateURLImmediate]);
  const handleAddRowField = useCallback(
    (fieldName, sourceZone) => {
      if (sourceZone === "rows" && config.rowFields.includes(fieldName)) {
        return;
      }
      const newConfig = { ...config };
      if (sourceZone === "columns") {
        newConfig.columnFields = newConfig.columnFields.filter((f) => f !== fieldName);
      }
      if (!newConfig.rowFields.includes(fieldName)) {
        newConfig.rowFields = [...newConfig.rowFields, fieldName];
      }
      onConfigChange(newConfig);
      updateURLDebounced(newConfig);
    },
    [config, onConfigChange, updateURLDebounced]
  );
  const handleAddColumnField = useCallback(
    (fieldName, sourceZone) => {
      if (sourceZone === "columns" && config.columnFields.includes(fieldName)) {
        return;
      }
      const newConfig = { ...config };
      if (sourceZone === "rows") {
        newConfig.rowFields = newConfig.rowFields.filter((f) => f !== fieldName);
      }
      if (!newConfig.columnFields.includes(fieldName)) {
        newConfig.columnFields = [...newConfig.columnFields, fieldName];
      }
      onConfigChange(newConfig);
      updateURLDebounced(newConfig);
    },
    [config, onConfigChange, updateURLDebounced]
  );
  const handleRemoveField = useCallback((field, zone) => {
    const newConfig = {
      ...config,
      [zone === "rows" ? "rowFields" : "columnFields"]: config[zone === "rows" ? "rowFields" : "columnFields"].filter((f) => f !== field)
    };
    onConfigChange(newConfig);
    updateURLDebounced(newConfig);
  }, [config, onConfigChange, updateURLDebounced]);
  const handleReturnToAvailable = useCallback(
    (fieldName, sourceZone) => {
      if (sourceZone === "available") {
        return;
      }
      const newConfig = { ...config };
      if (sourceZone === "rows") {
        newConfig.rowFields = newConfig.rowFields.filter((f) => f !== fieldName);
      } else if (sourceZone === "columns") {
        newConfig.columnFields = newConfig.columnFields.filter((f) => f !== fieldName);
      }
      onConfigChange(newConfig);
      updateURLDebounced(newConfig);
    },
    [config, onConfigChange, updateURLDebounced]
  );
  const handleReorderRowFields = useCallback(
    (sourceField, targetField, edge) => {
      const newFields = [...config.rowFields];
      const sourceIndex = newFields.indexOf(sourceField);
      const targetIndex = newFields.indexOf(targetField);
      if (sourceIndex === -1 || targetIndex === -1) return;
      newFields.splice(sourceIndex, 1);
      let insertIndex = targetIndex;
      if (edge === "right" || edge === "bottom") {
        insertIndex++;
      }
      if (sourceIndex < targetIndex) {
        insertIndex--;
      }
      newFields.splice(insertIndex, 0, sourceField);
      const newConfig = { ...config, rowFields: newFields };
      onConfigChange(newConfig);
      updateURLDebounced(newConfig);
    },
    [config, onConfigChange, updateURLDebounced]
  );
  const handleReorderColumnFields = useCallback(
    (sourceField, targetField, edge) => {
      const newFields = [...config.columnFields];
      const sourceIndex = newFields.indexOf(sourceField);
      const targetIndex = newFields.indexOf(targetField);
      if (sourceIndex === -1 || targetIndex === -1) return;
      newFields.splice(sourceIndex, 1);
      let insertIndex = targetIndex;
      if (edge === "right" || edge === "bottom") {
        insertIndex++;
      }
      if (sourceIndex < targetIndex) {
        insertIndex--;
      }
      newFields.splice(insertIndex, 0, sourceField);
      const newConfig = { ...config, columnFields: newFields };
      onConfigChange(newConfig);
      updateURLDebounced(newConfig);
    },
    [config, onConfigChange, updateURLDebounced]
  );
  useEffect(() => {
    const el = availableFieldsRef.current;
    if (!el) return;
    return dropTargetForElements({
      element: el,
      onDragEnter: () => setIsAvailableDraggedOver(true),
      onDragLeave: () => setIsAvailableDraggedOver(false),
      onDrop: ({ source }) => {
        setIsAvailableDraggedOver(false);
        const data = source.data;
        if (data.field) {
          handleReturnToAvailable(data.field, data.sourceZone);
        }
      }
    });
  }, [handleReturnToAvailable]);
  const handleRemoveRowField = useCallback(
    (field) => handleRemoveField(field, "rows"),
    [handleRemoveField]
  );
  const handleRemoveColumnField = useCallback(
    (field) => handleRemoveField(field, "columns"),
    [handleRemoveField]
  );
  const handleReset = useCallback(() => {
    onConfigChange(defaultConfig);
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    updateURLImmediate(defaultConfig);
  }, [defaultConfig, onConfigChange, updateURLImmediate]);
  return /* @__PURE__ */ jsxs(Card, { className, style, children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Settings2, { className: "h-5 w-5" }),
          "Pivot Configuration",
          isPending && /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsx(CardDescription, { children: isPending ? "Updating pivot table..." : "Drag fields to configure your pivot table" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", onClick: handleReset, children: [
        /* @__PURE__ */ jsx(RefreshCw, { className: "h-4 w-4 mr-2" }),
        "Reset"
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxs(CardContent, { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium mb-3", children: "Available Fields" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-3", children: "Drag fields here to remove them from the pivot" }),
        /* @__PURE__ */ jsx(
          "div",
          {
            ref: availableFieldsRef,
            className: cn(
              "flex flex-wrap gap-2 min-h-[60px] p-3 border-2 border-dashed rounded-lg transition-colors",
              isAvailableDraggedOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 bg-muted/20"
            ),
            children: getAvailableFields().length > 0 ? getAvailableFields().map((field) => /* @__PURE__ */ jsx(
              DraggableField,
              {
                field: field.name,
                fieldType: field.type,
                sourceZone: "available",
                inUse: field.inUse
              },
              field.name
            )) : /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground w-full text-center", children: "No fields available" })
          }
        )
      ] }),
      /* @__PURE__ */ jsx(Separator, {}),
      /* @__PURE__ */ jsx(
        DropZone,
        {
          label: "Row Groups",
          description: "Fields to group by (rows)",
          fields: config.rowFields,
          onFieldAdd: handleAddRowField,
          onFieldRemove: handleRemoveRowField,
          onFieldReorder: handleReorderRowFields,
          zone: "rows",
          availableFields
        }
      ),
      /* @__PURE__ */ jsx(Separator, {}),
      /* @__PURE__ */ jsx(
        DropZone,
        {
          label: "Pivot Columns",
          description: "Fields to pivot (columns)",
          fields: config.columnFields,
          onFieldAdd: handleAddColumnField,
          onFieldRemove: handleRemoveColumnField,
          onFieldReorder: handleReorderColumnFields,
          zone: "columns",
          availableFields
        }
      ),
      /* @__PURE__ */ jsx(Separator, {}),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium mb-2", children: "Value Fields" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-3", children: "Metrics to aggregate" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-2", children: config.valueFields.map((vf, index) => /* @__PURE__ */ jsx(
          "div",
          {
            className: "flex items-center gap-2 p-3 bg-primary/5 border rounded-lg",
            children: /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsx("div", { className: "font-medium text-sm", children: vf.displayName || vf.field }),
              /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
                "Aggregation: ",
                vf.aggregation.toUpperCase()
              ] })
            ] })
          },
          index
        )) })
      ] })
    ] })
  ] });
}
function Dialog({
  ...props
}) {
  return /* @__PURE__ */ jsx(DialogPrimitive.Root, { "data-slot": "dialog", ...props });
}
function DialogTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(DialogPrimitive.Trigger, { "data-slot": "dialog-trigger", ...props });
}
function DialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsx(DialogPrimitive.Portal, { "data-slot": "dialog-portal", ...props });
}
function DialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DialogPrimitive.Overlay,
    {
      "data-slot": "dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  return /* @__PURE__ */ jsxs(DialogPortal, { "data-slot": "dialog-portal", children: [
    /* @__PURE__ */ jsx(DialogOverlay, {}),
    /* @__PURE__ */ jsxs(
      DialogPrimitive.Content,
      {
        "data-slot": "dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props,
        children: [
          children,
          showCloseButton && /* @__PURE__ */ jsxs(
            DialogPrimitive.Close,
            {
              "data-slot": "dialog-close",
              className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              children: [
                /* @__PURE__ */ jsx(XIcon, {}),
                /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
              ]
            }
          )
        ]
      }
    )
  ] });
}
function DialogHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function DialogFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "dialog-footer",
      className: cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      ),
      ...props
    }
  );
}
function DialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DialogPrimitive.Title,
    {
      "data-slot": "dialog-title",
      className: cn("text-lg leading-none font-semibold", className),
      ...props
    }
  );
}
function DialogDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DialogPrimitive.Description,
    {
      "data-slot": "dialog-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function Label({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    LabelPrimitive.Root,
    {
      "data-slot": "label",
      className: cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      ),
      ...props
    }
  );
}
function RadioGroup({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    RadioGroupPrimitive.Root,
    {
      "data-slot": "radio-group",
      className: cn("grid gap-3", className),
      ...props
    }
  );
}
function RadioGroupItem({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    RadioGroupPrimitive.Item,
    {
      "data-slot": "radio-group-item",
      className: cn(
        "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(
        RadioGroupPrimitive.Indicator,
        {
          "data-slot": "radio-group-indicator",
          className: "relative flex items-center justify-center",
          children: /* @__PURE__ */ jsx(CircleIcon, { className: "fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" })
        }
      )
    }
  );
}
function ExportDialog({
  data,
  filename = "pivot-export",
  className,
  style,
  dialogClassName,
  dialogStyle
}) {
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState("csv");
  const [isExporting, setIsExporting] = useState(false);
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  const handleExport = async () => {
    setIsExporting(true);
    let url = null;
    try {
      const result = await exportPivotData(data, format);
      if (!isMountedRef.current) {
        return;
      }
      let blob;
      let downloadFilename;
      if (format === "csv") {
        blob = new Blob([result], { type: "text/csv" });
        downloadFilename = `${filename}-${Date.now()}.csv`;
      } else if (format === "excel") {
        blob = result;
        downloadFilename = `${filename}-${Date.now()}.xlsx`;
      } else {
        blob = new Blob([result], { type: "application/json" });
        downloadFilename = `${filename}-${Date.now()}.json`;
      }
      url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = downloadFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      if (isMountedRef.current) {
        setOpen(false);
      }
    } catch (error) {
      console.error("Export failed:", error);
      if (isMountedRef.current) {
        alert("Export failed. Please try again.");
      }
    } finally {
      if (url) {
        URL.revokeObjectURL(url);
      }
      if (isMountedRef.current) {
        setIsExporting(false);
      }
    }
  };
  return /* @__PURE__ */ jsxs(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", className, style, children: [
      /* @__PURE__ */ jsx(Download, { className: "h-4 w-4 mr-2" }),
      "Export"
    ] }) }),
    /* @__PURE__ */ jsxs(DialogContent, { className: cn("sm:max-w-md", dialogClassName), style: dialogStyle, children: [
      /* @__PURE__ */ jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsx(DialogTitle, { children: "Export Pivot Table" }),
        /* @__PURE__ */ jsx(DialogDescription, { children: "Choose a format to export your pivot table data" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-4 py-4", children: /* @__PURE__ */ jsxs(RadioGroup, { value: format, onValueChange: (value) => setFormat(value), children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx(RadioGroupItem, { value: "csv", id: "csv" }),
          /* @__PURE__ */ jsx(Label, { htmlFor: "csv", className: "flex-1 cursor-pointer", children: /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "font-medium", children: "CSV" }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: "Comma-separated values, compatible with Excel and other tools" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx(RadioGroupItem, { value: "excel", id: "excel" }),
          /* @__PURE__ */ jsx(Label, { htmlFor: "excel", className: "flex-1 cursor-pointer", children: /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "font-medium", children: "Excel" }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: "Microsoft Excel format with formatting" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsx(RadioGroupItem, { value: "json", id: "json" }),
          /* @__PURE__ */ jsx(Label, { htmlFor: "json", className: "flex-1 cursor-pointer", children: /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "font-medium", children: "JSON" }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: "Structured data format for API integration" })
          ] }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsx(Button, { onClick: handleExport, disabled: isExporting, children: isExporting ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 mr-2 animate-spin" }),
          "Exporting..."
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Download, { className: "h-4 w-4 mr-2" }),
          "Export"
        ] }) })
      ] })
    ] })
  ] });
}

// src/lib/pivot/hash.ts
function djb2Hash(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash ^ str.charCodeAt(i);
  }
  return hash >>> 0;
}
function hashPivotConfig(config) {
  const parts = [
    // Row fields in order
    "r:" + config.rowFields.join(","),
    // Column fields in order
    "c:" + config.columnFields.join(","),
    // Value fields - field:aggregation:displayName
    "v:" + config.valueFields.map((vf) => `${vf.field}:${vf.aggregation}:${vf.displayName || ""}`).join("|"),
    // Options that affect output
    "o:" + [
      config.options.showRowTotals ? "1" : "0",
      config.options.showColumnTotals ? "1" : "0",
      config.options.showGrandTotal ? "1" : "0",
      config.options.expandedByDefault ? "1" : "0"
    ].join("")
  ];
  if (config.filters && Object.keys(config.filters).length > 0) {
    parts.push("f:" + JSON.stringify(config.filters));
  }
  const hashInput = parts.join("|");
  return djb2Hash(hashInput).toString(36);
}
function ClientPivotWrapper({
  rawData,
  initialConfig,
  defaultConfig,
  availableFields,
  className,
  style,
  panelClassName,
  resultsClassName,
  tableClassName
}) {
  const [config, setConfig] = useState(initialConfig);
  const transformCache = useRef(/* @__PURE__ */ new Map());
  const pivotResult = useMemo(() => {
    const configHash = hashPivotConfig(config);
    if (transformCache.current.has(configHash)) {
      const cached = transformCache.current.get(configHash);
      return cached.result;
    }
    const result = transformToPivot(rawData, config);
    transformCache.current.set(configHash, {
      result,
      timestamp: Date.now()
    });
    if (transformCache.current.size > 5) {
      let oldestKey = "";
      let oldestTime = Infinity;
      for (const [key, value] of transformCache.current.entries()) {
        if (value.timestamp < oldestTime) {
          oldestTime = value.timestamp;
          oldestKey = key;
        }
      }
      if (oldestKey) {
        transformCache.current.delete(oldestKey);
      }
    }
    return result;
  }, [rawData, config]);
  const handleConfigChange = useCallback((newConfig) => {
    setConfig(newConfig);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: cn("space-y-6", className), style, children: [
    /* @__PURE__ */ jsx(
      PivotPanel,
      {
        config,
        defaultConfig,
        availableFields,
        onConfigChange: handleConfigChange,
        className: panelClassName
      }
    ),
    /* @__PURE__ */ jsxs(Card, { className: resultsClassName, children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs(CardTitle, { children: [
            "Results",
            config.rowFields.length === 0 && config.columnFields.length === 0 && /* @__PURE__ */ jsx("span", { className: "ml-2 text-sm font-normal text-muted-foreground", children: "(Unpivoted - Raw Data)" })
          ] }),
          /* @__PURE__ */ jsxs(CardDescription, { children: [
            pivotResult.metadata.rowCount,
            " rows \xD7 ",
            pivotResult.metadata.columnCount,
            " columns"
          ] })
        ] }),
        /* @__PURE__ */ jsx(ExportDialog, { data: pivotResult.data, filename: "pivot-export" })
      ] }) }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx(
        PivotTable,
        {
          data: pivotResult.data,
          config,
          metadata: pivotResult.metadata,
          className: tableClassName
        }
      ) })
    ] })
  ] });
}
function Checkbox({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    CheckboxPrimitive.Root,
    {
      "data-slot": "checkbox",
      className: cn(
        "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(
        CheckboxPrimitive.Indicator,
        {
          "data-slot": "checkbox-indicator",
          className: "grid place-content-center text-current transition-none",
          children: /* @__PURE__ */ jsx(CheckIcon, { className: "size-3.5" })
        }
      )
    }
  );
}
function DropdownMenu({
  ...props
}) {
  return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Root, { "data-slot": "dropdown-menu", ...props });
}
function DropdownMenuTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Trigger,
    {
      "data-slot": "dropdown-menu-trigger",
      ...props
    }
  );
}
function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}) {
  return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Content,
    {
      "data-slot": "dropdown-menu-content",
      sideOffset,
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
        className
      ),
      ...props
    }
  ) });
}
function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Item,
    {
      "data-slot": "dropdown-menu-item",
      "data-inset": inset,
      "data-variant": variant,
      className: cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function Input({ className, type, ...props }) {
  return /* @__PURE__ */ jsx(
    "input",
    {
      type,
      "data-slot": "input",
      className: cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      ),
      ...props
    }
  );
}
function ScrollArea({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    ScrollAreaPrimitive.Root,
    {
      "data-slot": "scroll-area",
      className: cn("relative", className),
      ...props,
      children: [
        /* @__PURE__ */ jsx(
          ScrollAreaPrimitive.Viewport,
          {
            "data-slot": "scroll-area-viewport",
            className: "focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1",
            children
          }
        ),
        /* @__PURE__ */ jsx(ScrollBar, {}),
        /* @__PURE__ */ jsx(ScrollAreaPrimitive.Corner, {})
      ]
    }
  );
}
function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    ScrollAreaPrimitive.ScrollAreaScrollbar,
    {
      "data-slot": "scroll-area-scrollbar",
      orientation,
      className: cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(
        ScrollAreaPrimitive.ScrollAreaThumb,
        {
          "data-slot": "scroll-area-thumb",
          className: "bg-border relative flex-1 rounded-full"
        }
      )
    }
  );
}
function Select({
  ...props
}) {
  return /* @__PURE__ */ jsx(SelectPrimitive.Root, { "data-slot": "select", ...props });
}
function SelectValue({
  ...props
}) {
  return /* @__PURE__ */ jsx(SelectPrimitive.Value, { "data-slot": "select-value", ...props });
}
function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    SelectPrimitive.Trigger,
    {
      "data-slot": "select-trigger",
      "data-size": size,
      className: cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx(ChevronDownIcon, { className: "size-4 opacity-50" }) })
      ]
    }
  );
}
function SelectContent({
  className,
  children,
  position = "popper",
  align = "center",
  ...props
}) {
  return /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
    SelectPrimitive.Content,
    {
      "data-slot": "select-content",
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
        position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      ),
      position,
      align,
      ...props,
      children: [
        /* @__PURE__ */ jsx(SelectScrollUpButton, {}),
        /* @__PURE__ */ jsx(
          SelectPrimitive.Viewport,
          {
            className: cn(
              "p-1",
              position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
            ),
            children
          }
        ),
        /* @__PURE__ */ jsx(SelectScrollDownButton, {})
      ]
    }
  ) });
}
function SelectItem({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    SelectPrimitive.Item,
    {
      "data-slot": "select-item",
      className: cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx("span", { className: "absolute right-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(CheckIcon, { className: "size-4" }) }) }),
        /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })
      ]
    }
  );
}
function SelectScrollUpButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SelectPrimitive.ScrollUpButton,
    {
      "data-slot": "select-scroll-up-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(ChevronUpIcon, { className: "size-4" })
    }
  );
}
function SelectScrollDownButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SelectPrimitive.ScrollDownButton,
    {
      "data-slot": "select-scroll-down-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(ChevronDownIcon, { className: "size-4" })
    }
  );
}
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "skeleton",
      className: cn("bg-accent animate-pulse rounded-md", className),
      ...props
    }
  );
}

export { Badge, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Checkbox, ClientPivotWrapper, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DraggableField, DropZone, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, ExportDialog, Input, Label, PivotPanel, PivotTable, RadioGroup, RadioGroupItem, ScrollArea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Separator, Skeleton, Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map