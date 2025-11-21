'use strict';

var chunkQSC4UIVT_js = require('./chunk-QSC4UIVT.js');
var chunk6M575PJF_js = require('./chunk-6M575PJF.js');
var chunk74OBHZM5_js = require('./chunk-74OBHZM5.js');
var react = require('react');
var reactTable = require('@tanstack/react-table');
var reactVirtual = require('@tanstack/react-virtual');
var jsxRuntime = require('react/jsx-runtime');
var navigation = require('next/navigation');
var reactSlot = require('@radix-ui/react-slot');
var classVarianceAuthority = require('class-variance-authority');
var SeparatorPrimitive = require('@radix-ui/react-separator');
var reactDom = require('react-dom');
var adapter = require('@atlaskit/pragmatic-drag-and-drop/element/adapter');
var setCustomNativeDragPreview = require('@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview');
var preserveOffsetOnSource = require('@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source');
var lucideReact = require('lucide-react');
var DialogPrimitive = require('@radix-ui/react-dialog');
var LabelPrimitive = require('@radix-ui/react-label');
var RadioGroupPrimitive = require('@radix-ui/react-radio-group');
var CheckboxPrimitive = require('@radix-ui/react-checkbox');
var DropdownMenuPrimitive = require('@radix-ui/react-dropdown-menu');
var ScrollAreaPrimitive = require('@radix-ui/react-scroll-area');
var SelectPrimitive = require('@radix-ui/react-select');

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var SeparatorPrimitive__namespace = /*#__PURE__*/_interopNamespace(SeparatorPrimitive);
var DialogPrimitive__namespace = /*#__PURE__*/_interopNamespace(DialogPrimitive);
var LabelPrimitive__namespace = /*#__PURE__*/_interopNamespace(LabelPrimitive);
var RadioGroupPrimitive__namespace = /*#__PURE__*/_interopNamespace(RadioGroupPrimitive);
var CheckboxPrimitive__namespace = /*#__PURE__*/_interopNamespace(CheckboxPrimitive);
var DropdownMenuPrimitive__namespace = /*#__PURE__*/_interopNamespace(DropdownMenuPrimitive);
var ScrollAreaPrimitive__namespace = /*#__PURE__*/_interopNamespace(ScrollAreaPrimitive);
var SelectPrimitive__namespace = /*#__PURE__*/_interopNamespace(SelectPrimitive);

function Table({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      "data-slot": "table-container",
      className: "relative w-full overflow-x-auto",
      children: /* @__PURE__ */ jsxRuntime.jsx(
        "table",
        {
          "data-slot": "table",
          className: chunkQSC4UIVT_js.cn("w-full caption-bottom text-sm", className),
          ...props
        }
      )
    }
  );
}
function TableHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "thead",
    {
      "data-slot": "table-header",
      className: chunkQSC4UIVT_js.cn("[&_tr]:border-b", className),
      ...props
    }
  );
}
function TableBody({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "tbody",
    {
      "data-slot": "table-body",
      className: chunkQSC4UIVT_js.cn("[&_tr:last-child]:border-0", className),
      ...props
    }
  );
}
function TableFooter({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "tfoot",
    {
      "data-slot": "table-footer",
      className: chunkQSC4UIVT_js.cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      ),
      ...props
    }
  );
}
function TableRow({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "tr",
    {
      "data-slot": "table-row",
      className: chunkQSC4UIVT_js.cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className
      ),
      ...props
    }
  );
}
function TableHead({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "th",
    {
      "data-slot": "table-head",
      className: chunkQSC4UIVT_js.cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      ),
      ...props
    }
  );
}
function TableCell({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "td",
    {
      "data-slot": "table-cell",
      className: chunkQSC4UIVT_js.cn(
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
  return /* @__PURE__ */ jsxRuntime.jsx(
    "caption",
    {
      "data-slot": "table-caption",
      className: chunkQSC4UIVT_js.cn("text-muted-foreground mt-4 text-sm", className),
      ...props
    }
  );
}
var PivotTableComponent = ({ data, config, metadata }) => {
  const parentRef = react.useRef(null);
  const columns = react.useMemo(() => {
    const cols = [];
    for (const field of config.rowFields) {
      cols.push({
        id: field,
        accessorKey: field,
        header: formatFieldName(field),
        cell: ({ row, getValue }) => {
          const value = getValue();
          const level = row.original.__level || 0;
          const isTotal = row.original.__isGrandTotal || row.original.__isSubtotal;
          return /* @__PURE__ */ jsxRuntime.jsx(
            "div",
            {
              className: chunkQSC4UIVT_js.cn(
                "font-medium",
                isTotal && "font-bold",
                level > 0 && `pl-${level * 4}`
              ),
              children: formatTotalLabel(value)
            }
          );
        },
        size: 200
      });
    }
    if (config.columnFields.length === 0) {
      for (const valueField of config.valueFields) {
        cols.push({
          id: valueField.field,
          accessorKey: valueField.displayName || valueField.field,
          header: valueField.displayName || formatFieldName(valueField.field),
          cell: ({ getValue }) => {
            const value = getValue();
            return /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-right font-mono", children: formatNumber(value, valueField.aggregation) });
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
          id: chunk74OBHZM5_js.generateColumnKey(combination, valueField.displayName || valueField.field),
          accessorKey: chunk74OBHZM5_js.generateColumnKey(combination, valueField.displayName || valueField.field),
          header: valueField.displayName || formatFieldName(valueField.field),
          cell: ({ getValue, row }) => {
            const value = getValue();
            const isTotal = row.original.__isGrandTotal || row.original.__isSubtotal;
            return /* @__PURE__ */ jsxRuntime.jsx(
              "div",
              {
                className: chunkQSC4UIVT_js.cn(
                  "text-right font-mono",
                  isTotal && "font-bold"
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
          id: `__total_${valueField.field}`,
          accessorKey: `__total_${valueField.field}`,
          header: `Total ${valueField.displayName || formatFieldName(valueField.field)}`,
          cell: ({ getValue, row }) => {
            const value = getValue();
            const isTotal = row.original.__isGrandTotal || row.original.__isSubtotal;
            return /* @__PURE__ */ jsxRuntime.jsx(
              "div",
              {
                className: chunkQSC4UIVT_js.cn(
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
  }, [config, metadata]);
  const table = reactTable.useReactTable({
    data,
    columns,
    getCoreRowModel: reactTable.getCoreRowModel()
  });
  const rowVirtualizer = reactVirtual.useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 10
  });
  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();
  const paddingTop = virtualRows.length > 0 ? virtualRows[0]?.start || 0 : 0;
  const paddingBottom = virtualRows.length > 0 ? totalSize - (virtualRows[virtualRows.length - 1]?.end || 0) : 0;
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        ref: parentRef,
        className: "overflow-auto border rounded-lg",
        style: { height: "600px" },
        children: /* @__PURE__ */ jsxRuntime.jsxs(Table, { children: [
          /* @__PURE__ */ jsxRuntime.jsx(TableHeader, { className: "sticky top-0 bg-background z-10", children: table.getHeaderGroups().map((headerGroup) => /* @__PURE__ */ jsxRuntime.jsx(TableRow, { children: headerGroup.headers.map((header) => /* @__PURE__ */ jsxRuntime.jsx(
            TableHead,
            {
              colSpan: header.colSpan,
              style: { width: header.getSize() },
              className: "bg-muted font-semibold",
              children: header.isPlaceholder ? null : reactTable.flexRender(
                header.column.columnDef.header,
                header.getContext()
              )
            },
            header.id
          )) }, headerGroup.id)) }),
          /* @__PURE__ */ jsxRuntime.jsxs(TableBody, { children: [
            paddingTop > 0 && /* @__PURE__ */ jsxRuntime.jsx("tr", { children: /* @__PURE__ */ jsxRuntime.jsx("td", { style: { height: `${paddingTop}px` } }) }),
            virtualRows.map((virtualRow) => {
              const row = table.getRowModel().rows[virtualRow.index];
              if (!row) return null;
              const isGrandTotal = row.original.__isGrandTotal;
              const isSubtotal = row.original.__isSubtotal;
              return /* @__PURE__ */ jsxRuntime.jsx(
                TableRow,
                {
                  "data-index": virtualRow.index,
                  className: chunkQSC4UIVT_js.cn(
                    isGrandTotal && "bg-accent font-bold border-t-2 border-t-border",
                    isSubtotal && "bg-muted/30 font-semibold"
                  ),
                  children: row.getVisibleCells().map((cell) => /* @__PURE__ */ jsxRuntime.jsx(
                    TableCell,
                    {
                      style: { width: cell.column.getSize() },
                      children: reactTable.flexRender(cell.column.columnDef.cell, cell.getContext())
                    },
                    cell.id
                  ))
                },
                row.id
              );
            }),
            paddingBottom > 0 && /* @__PURE__ */ jsxRuntime.jsx("tr", { children: /* @__PURE__ */ jsxRuntime.jsx("td", { style: { height: `${paddingBottom}px` } }) })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
        "Showing ",
        table.getRowModel().rows.length,
        " rows"
      ] }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
        metadata.rowCount,
        " rows \xD7 ",
        metadata.columnCount,
        " columns"
      ] })
    ] })
  ] });
};
var PivotTable = react.memo(PivotTableComponent, (prevProps, nextProps) => {
  return prevProps.data === nextProps.data && prevProps.metadata === nextProps.metadata && JSON.stringify(prevProps.config) === JSON.stringify(nextProps.config);
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
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      role: "article",
      "data-slot": "card",
      className: chunkQSC4UIVT_js.cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      ),
      ...props
    }
  );
}
function CardHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      "data-slot": "card-header",
      className: chunkQSC4UIVT_js.cn(
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
  return /* @__PURE__ */ jsxRuntime.jsx(
    Component,
    {
      "data-slot": "card-title",
      className: chunkQSC4UIVT_js.cn("leading-none font-semibold", className),
      ...props
    }
  );
}
function CardDescription({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      "data-slot": "card-description",
      className: chunkQSC4UIVT_js.cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      "data-slot": "card-content",
      className: chunkQSC4UIVT_js.cn("px-6", className),
      ...props
    }
  );
}
function CardFooter({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      "data-slot": "card-footer",
      className: chunkQSC4UIVT_js.cn("flex items-center px-6 [.border-t]:pt-6", className),
      ...props
    }
  );
}
var buttonVariants = classVarianceAuthority.cva(
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
  const Comp = asChild ? reactSlot.Slot : "button";
  return /* @__PURE__ */ jsxRuntime.jsx(
    Comp,
    {
      "data-slot": "button",
      className: chunkQSC4UIVT_js.cn(buttonVariants({ variant, size, className })),
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
  return /* @__PURE__ */ jsxRuntime.jsx(
    SeparatorPrimitive__namespace.Root,
    {
      "data-slot": "separator",
      decorative,
      orientation,
      className: chunkQSC4UIVT_js.cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      ),
      ...props
    }
  );
}
var badgeVariants = classVarianceAuthority.cva(
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
  const Comp = asChild ? reactSlot.Slot : "span";
  return /* @__PURE__ */ jsxRuntime.jsx(
    Comp,
    {
      "data-slot": "badge",
      className: chunkQSC4UIVT_js.cn(badgeVariants({ variant }), className),
      ...props
    }
  );
}
var DraggableFieldComponent = ({
  field,
  fieldType = "string",
  sourceZone = "available",
  onRemove,
  inUse = false
}) => {
  const ref = react.useRef(null);
  const [dragState, setDragState] = react.useState({ type: "idle" });
  react.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return adapter.draggable({
      element: el,
      getInitialData: () => ({ field, fieldType, sourceZone }),
      onGenerateDragPreview({ nativeSetDragImage, location, source }) {
        setCustomNativeDragPreview.setCustomNativeDragPreview({
          nativeSetDragImage,
          getOffset: preserveOffsetOnSource.preserveOffsetOnSource({
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
        return /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Hash, { className: "h-3 w-3" });
      case "date":
        return /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Calendar, { className: "h-3 w-3" });
      case "boolean":
        return /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ToggleLeft, { className: "h-3 w-3" });
      default:
        return /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Type, { className: "h-3 w-3" });
    }
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
    /* @__PURE__ */ jsxRuntime.jsx("div", { ref, className: "inline-block group", children: /* @__PURE__ */ jsxRuntime.jsxs(
      Badge,
      {
        variant: "outline",
        className: chunkQSC4UIVT_js.cn(
          "cursor-move select-none transition-all hover:bg-accent gap-1",
          dragState.type === "dragging" && "opacity-50 cursor-grabbing",
          inUse && "bg-primary/10 border-primary/30"
        ),
        children: [
          /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex items-center gap-1.5", children: [
            getFieldIcon(),
            /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-medium", children: formatFieldName2(field) }),
            inUse && /* @__PURE__ */ jsxRuntime.jsx("span", { className: "text-[10px] font-semibold text-primary", children: "IN USE" })
          ] }),
          sourceZone !== "available" && onRemove && /* @__PURE__ */ jsxRuntime.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "h-3 w-3 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-all text-muted-foreground hover:text-foreground",
              onClick: (e) => {
                e.stopPropagation();
                onRemove();
              },
              children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.X, { className: "h-2.5 w-2.5" })
            }
          )
        ]
      }
    ) }),
    dragState.type === "preview" && reactDom.createPortal(
      /* @__PURE__ */ jsxRuntime.jsx(Badge, { variant: "outline", className: "cursor-grabbing gap-1", children: /* @__PURE__ */ jsxRuntime.jsxs("span", { className: "flex items-center gap-1.5", children: [
        getFieldIcon(),
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "font-medium", children: formatFieldName2(field) })
      ] }) }),
      dragState.container
    )
  ] });
};
function formatFieldName2(field) {
  return field.split(/(?=[A-Z])|_/).map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
}
var DraggableField = react.memo(DraggableFieldComponent);
var DropZoneComponent = ({
  label,
  description,
  fields,
  onFieldAdd,
  onFieldRemove,
  zone,
  availableFields
}) => {
  const ref = react.useRef(null);
  const [isDraggedOver, setIsDraggedOver] = react.useState(false);
  react.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return adapter.dropTargetForElements({
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
  const getFieldType = react.useMemo(() => {
    return (fieldName) => {
      const fieldInfo = availableFields.find((f) => f.name === fieldName);
      return fieldInfo?.type || "string";
    };
  }, [availableFields]);
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "text-sm font-medium mb-2", children: label }),
    description && /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm text-muted-foreground mb-3", children: description }),
    /* @__PURE__ */ jsxRuntime.jsx(
      "div",
      {
        ref,
        className: chunkQSC4UIVT_js.cn(
          "min-h-[80px] p-3 border-2 border-dashed rounded-lg transition-colors",
          isDraggedOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 bg-muted/20",
          fields.length === 0 && "flex items-center justify-center"
        ),
        children: fields.length > 0 ? /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex flex-wrap gap-2", children: fields.map((field, index) => /* @__PURE__ */ jsxRuntime.jsx(
          DraggableField,
          {
            field,
            fieldType: getFieldType(field),
            sourceZone: zone,
            onRemove: () => onFieldRemove(field)
          },
          `${field}-${index}`
        )) }) : /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm text-muted-foreground text-center", children: "Drag fields here" })
      }
    )
  ] });
};
var DropZone = react.memo(DropZoneComponent);
function PivotPanel({ config, defaultConfig, availableFields, onConfigChange }) {
  const router = navigation.useRouter();
  const pathname = navigation.usePathname();
  const [isPending, startTransition] = react.useTransition();
  const debounceTimeoutRef = react.useRef(null);
  react.useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);
  const getAvailableFields = react.useCallback(() => {
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
  const updateURLImmediate = react.useCallback((newConfig) => {
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
  const updateURLDebounced = react.useCallback((newConfig) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      updateURLImmediate(newConfig);
    }, 100);
  }, [updateURLImmediate]);
  const handleAddRowField = react.useCallback(
    (fieldName, sourceZone) => {
      if (sourceZone === "rows" && config.rowFields.includes(fieldName)) {
        return;
      }
      let newConfig = { ...config };
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
  const handleAddColumnField = react.useCallback(
    (fieldName, sourceZone) => {
      if (sourceZone === "columns" && config.columnFields.includes(fieldName)) {
        return;
      }
      let newConfig = { ...config };
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
  const handleRemoveField = react.useCallback((field, zone) => {
    const newConfig = {
      ...config,
      [zone === "rows" ? "rowFields" : "columnFields"]: config[zone === "rows" ? "rowFields" : "columnFields"].filter((f) => f !== field)
    };
    onConfigChange(newConfig);
    updateURLDebounced(newConfig);
  }, [config, onConfigChange, updateURLDebounced]);
  const handleReset = react.useCallback(() => {
    onConfigChange(defaultConfig);
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    updateURLImmediate(defaultConfig);
  }, [defaultConfig, onConfigChange, updateURLImmediate]);
  return /* @__PURE__ */ jsxRuntime.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntime.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntime.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Settings2, { className: "h-5 w-5" }),
          "Pivot Configuration",
          isPending && /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Loader2, { className: "h-4 w-4 animate-spin text-muted-foreground" })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx(CardDescription, { children: isPending ? "Updating pivot table..." : "Drag fields to configure your pivot table" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsxRuntime.jsxs(Button, { variant: "outline", size: "sm", onClick: handleReset, children: [
        /* @__PURE__ */ jsxRuntime.jsx(lucideReact.RefreshCw, { className: "h-4 w-4 mr-2" }),
        "Reset"
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntime.jsxs(CardContent, { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "text-sm font-medium mb-3", children: "Available Fields" }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "flex flex-wrap gap-2 min-h-[60px] p-3 border-2 border-dashed rounded-lg bg-muted/20", children: getAvailableFields().length > 0 ? getAvailableFields().map((field) => /* @__PURE__ */ jsxRuntime.jsx(
          DraggableField,
          {
            field: field.name,
            fieldType: field.type,
            sourceZone: "available",
            inUse: field.inUse
          },
          field.name
        )) : /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm text-muted-foreground w-full text-center", children: "No fields available" }) })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx(Separator, {}),
      /* @__PURE__ */ jsxRuntime.jsx(
        DropZone,
        {
          label: "Row Groups",
          description: "Fields to group by (rows)",
          fields: config.rowFields,
          onFieldAdd: handleAddRowField,
          onFieldRemove: (field) => handleRemoveField(field, "rows"),
          zone: "rows",
          availableFields
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(Separator, {}),
      /* @__PURE__ */ jsxRuntime.jsx(
        DropZone,
        {
          label: "Pivot Columns",
          description: "Fields to pivot (columns)",
          fields: config.columnFields,
          onFieldAdd: handleAddColumnField,
          onFieldRemove: (field) => handleRemoveField(field, "columns"),
          zone: "columns",
          availableFields
        }
      ),
      /* @__PURE__ */ jsxRuntime.jsx(Separator, {}),
      /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntime.jsx("h3", { className: "text-sm font-medium mb-2", children: "Value Fields" }),
        /* @__PURE__ */ jsxRuntime.jsx("p", { className: "text-sm text-muted-foreground mb-3", children: "Metrics to aggregate" }),
        /* @__PURE__ */ jsxRuntime.jsx("div", { className: "space-y-2", children: config.valueFields.map((vf, index) => /* @__PURE__ */ jsxRuntime.jsx(
          "div",
          {
            className: "flex items-center gap-2 p-3 bg-primary/5 border rounded-lg",
            children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntime.jsx("div", { className: "font-medium text-sm", children: vf.displayName || vf.field }),
              /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "text-xs text-muted-foreground", children: [
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
  return /* @__PURE__ */ jsxRuntime.jsx(DialogPrimitive__namespace.Root, { "data-slot": "dialog", ...props });
}
function DialogTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(DialogPrimitive__namespace.Trigger, { "data-slot": "dialog-trigger", ...props });
}
function DialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(DialogPrimitive__namespace.Portal, { "data-slot": "dialog-portal", ...props });
}
function DialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    DialogPrimitive__namespace.Overlay,
    {
      "data-slot": "dialog-overlay",
      className: chunkQSC4UIVT_js.cn(
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
  return /* @__PURE__ */ jsxRuntime.jsxs(DialogPortal, { "data-slot": "dialog-portal", children: [
    /* @__PURE__ */ jsxRuntime.jsx(DialogOverlay, {}),
    /* @__PURE__ */ jsxRuntime.jsxs(
      DialogPrimitive__namespace.Content,
      {
        "data-slot": "dialog-content",
        className: chunkQSC4UIVT_js.cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props,
        children: [
          children,
          showCloseButton && /* @__PURE__ */ jsxRuntime.jsxs(
            DialogPrimitive__namespace.Close,
            {
              "data-slot": "dialog-close",
              className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              children: [
                /* @__PURE__ */ jsxRuntime.jsx(lucideReact.XIcon, {}),
                /* @__PURE__ */ jsxRuntime.jsx("span", { className: "sr-only", children: "Close" })
              ]
            }
          )
        ]
      }
    )
  ] });
}
function DialogHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      "data-slot": "dialog-header",
      className: chunkQSC4UIVT_js.cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function DialogFooter({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      "data-slot": "dialog-footer",
      className: chunkQSC4UIVT_js.cn(
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
  return /* @__PURE__ */ jsxRuntime.jsx(
    DialogPrimitive__namespace.Title,
    {
      "data-slot": "dialog-title",
      className: chunkQSC4UIVT_js.cn("text-lg leading-none font-semibold", className),
      ...props
    }
  );
}
function DialogDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    DialogPrimitive__namespace.Description,
    {
      "data-slot": "dialog-description",
      className: chunkQSC4UIVT_js.cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function Label({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    LabelPrimitive__namespace.Root,
    {
      "data-slot": "label",
      className: chunkQSC4UIVT_js.cn(
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
  return /* @__PURE__ */ jsxRuntime.jsx(
    RadioGroupPrimitive__namespace.Root,
    {
      "data-slot": "radio-group",
      className: chunkQSC4UIVT_js.cn("grid gap-3", className),
      ...props
    }
  );
}
function RadioGroupItem({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    RadioGroupPrimitive__namespace.Item,
    {
      "data-slot": "radio-group-item",
      className: chunkQSC4UIVT_js.cn(
        "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntime.jsx(
        RadioGroupPrimitive__namespace.Indicator,
        {
          "data-slot": "radio-group-indicator",
          className: "relative flex items-center justify-center",
          children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.CircleIcon, { className: "fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" })
        }
      )
    }
  );
}
function ExportDialog({ data, filename = "pivot-export" }) {
  const [open, setOpen] = react.useState(false);
  const [format, setFormat] = react.useState("csv");
  const [isExporting, setIsExporting] = react.useState(false);
  const handleExport = async () => {
    setIsExporting(true);
    try {
      const result = await chunk6M575PJF_js.exportPivotData(data, format);
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
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = downloadFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setOpen(false);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntime.jsxs(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsxRuntime.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntime.jsxs(Button, { variant: "outline", size: "sm", children: [
      /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Download, { className: "h-4 w-4 mr-2" }),
      "Export"
    ] }) }),
    /* @__PURE__ */ jsxRuntime.jsxs(DialogContent, { className: "sm:max-w-md", children: [
      /* @__PURE__ */ jsxRuntime.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntime.jsx(DialogTitle, { children: "Export Pivot Table" }),
        /* @__PURE__ */ jsxRuntime.jsx(DialogDescription, { children: "Choose a format to export your pivot table data" })
      ] }),
      /* @__PURE__ */ jsxRuntime.jsx("div", { className: "space-y-4 py-4", children: /* @__PURE__ */ jsxRuntime.jsxs(RadioGroup, { value: format, onValueChange: (value) => setFormat(value), children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsxRuntime.jsx(RadioGroupItem, { value: "csv", id: "csv" }),
          /* @__PURE__ */ jsxRuntime.jsx(Label, { htmlFor: "csv", className: "flex-1 cursor-pointer", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "font-medium", children: "CSV" }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-sm text-muted-foreground", children: "Comma-separated values, compatible with Excel and other tools" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsxRuntime.jsx(RadioGroupItem, { value: "excel", id: "excel" }),
          /* @__PURE__ */ jsxRuntime.jsx(Label, { htmlFor: "excel", className: "flex-1 cursor-pointer", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "font-medium", children: "Excel" }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-sm text-muted-foreground", children: "Microsoft Excel format with formatting" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-center space-x-2", children: [
          /* @__PURE__ */ jsxRuntime.jsx(RadioGroupItem, { value: "json", id: "json" }),
          /* @__PURE__ */ jsxRuntime.jsx(Label, { htmlFor: "json", className: "flex-1 cursor-pointer", children: /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "font-medium", children: "JSON" }),
            /* @__PURE__ */ jsxRuntime.jsx("div", { className: "text-sm text-muted-foreground", children: "Structured data format for API integration" })
          ] }) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntime.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntime.jsx(Button, { variant: "outline", onClick: () => setOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxRuntime.jsx(Button, { onClick: handleExport, disabled: isExporting, children: isExporting ? /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
          /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Loader2, { className: "h-4 w-4 mr-2 animate-spin" }),
          "Exporting..."
        ] }) : /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, { children: [
          /* @__PURE__ */ jsxRuntime.jsx(lucideReact.Download, { className: "h-4 w-4 mr-2" }),
          "Export"
        ] }) })
      ] })
    ] })
  ] });
}
function ClientPivotWrapper({
  rawData,
  initialConfig,
  defaultConfig,
  availableFields
}) {
  const [config, setConfig] = react.useState(initialConfig);
  const pivotResult = react.useMemo(() => {
    const startTime = performance.now();
    const result = chunk74OBHZM5_js.transformToPivot(rawData, config);
    const endTime = performance.now();
    console.log(`Client-side pivot transformation: ${(endTime - startTime).toFixed(2)}ms`);
    return result;
  }, [rawData, config]);
  const handleConfigChange = react.useCallback((newConfig) => {
    setConfig(newConfig);
  }, []);
  return /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntime.jsx(
      PivotPanel,
      {
        config,
        defaultConfig,
        availableFields,
        onConfigChange: handleConfigChange
      }
    ),
    /* @__PURE__ */ jsxRuntime.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntime.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntime.jsxs("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ jsxRuntime.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntime.jsx(CardTitle, { children: "Results" }),
          /* @__PURE__ */ jsxRuntime.jsxs(CardDescription, { children: [
            pivotResult.metadata.rowCount,
            " rows \xD7 ",
            pivotResult.metadata.columnCount,
            " columns"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntime.jsx(ExportDialog, { data: pivotResult.data, filename: "pivot-export" })
      ] }) }),
      /* @__PURE__ */ jsxRuntime.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntime.jsx(
        PivotTable,
        {
          data: pivotResult.data,
          config,
          metadata: pivotResult.metadata
        }
      ) })
    ] })
  ] });
}
function Checkbox({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    CheckboxPrimitive__namespace.Root,
    {
      "data-slot": "checkbox",
      className: chunkQSC4UIVT_js.cn(
        "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntime.jsx(
        CheckboxPrimitive__namespace.Indicator,
        {
          "data-slot": "checkbox-indicator",
          className: "grid place-content-center text-current transition-none",
          children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.CheckIcon, { className: "size-3.5" })
        }
      )
    }
  );
}
function DropdownMenu({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(DropdownMenuPrimitive__namespace.Root, { "data-slot": "dropdown-menu", ...props });
}
function DropdownMenuTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    DropdownMenuPrimitive__namespace.Trigger,
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
  return /* @__PURE__ */ jsxRuntime.jsx(DropdownMenuPrimitive__namespace.Portal, { children: /* @__PURE__ */ jsxRuntime.jsx(
    DropdownMenuPrimitive__namespace.Content,
    {
      "data-slot": "dropdown-menu-content",
      sideOffset,
      className: chunkQSC4UIVT_js.cn(
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
  return /* @__PURE__ */ jsxRuntime.jsx(
    DropdownMenuPrimitive__namespace.Item,
    {
      "data-slot": "dropdown-menu-item",
      "data-inset": inset,
      "data-variant": variant,
      className: chunkQSC4UIVT_js.cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function Input({ className, type, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "input",
    {
      type,
      "data-slot": "input",
      className: chunkQSC4UIVT_js.cn(
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
  return /* @__PURE__ */ jsxRuntime.jsxs(
    ScrollAreaPrimitive__namespace.Root,
    {
      "data-slot": "scroll-area",
      className: chunkQSC4UIVT_js.cn("relative", className),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(
          ScrollAreaPrimitive__namespace.Viewport,
          {
            "data-slot": "scroll-area-viewport",
            className: "focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1",
            children
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(ScrollBar, {}),
        /* @__PURE__ */ jsxRuntime.jsx(ScrollAreaPrimitive__namespace.Corner, {})
      ]
    }
  );
}
function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    ScrollAreaPrimitive__namespace.ScrollAreaScrollbar,
    {
      "data-slot": "scroll-area-scrollbar",
      orientation,
      className: chunkQSC4UIVT_js.cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntime.jsx(
        ScrollAreaPrimitive__namespace.ScrollAreaThumb,
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
  return /* @__PURE__ */ jsxRuntime.jsx(SelectPrimitive__namespace.Root, { "data-slot": "select", ...props });
}
function SelectValue({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(SelectPrimitive__namespace.Value, { "data-slot": "select-value", ...props });
}
function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsxs(
    SelectPrimitive__namespace.Trigger,
    {
      "data-slot": "select-trigger",
      "data-size": size,
      className: chunkQSC4UIVT_js.cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntime.jsx(SelectPrimitive__namespace.Icon, { asChild: true, children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronDownIcon, { className: "size-4 opacity-50" }) })
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
  return /* @__PURE__ */ jsxRuntime.jsx(SelectPrimitive__namespace.Portal, { children: /* @__PURE__ */ jsxRuntime.jsxs(
    SelectPrimitive__namespace.Content,
    {
      "data-slot": "select-content",
      className: chunkQSC4UIVT_js.cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
        position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      ),
      position,
      align,
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx(SelectScrollUpButton, {}),
        /* @__PURE__ */ jsxRuntime.jsx(
          SelectPrimitive__namespace.Viewport,
          {
            className: chunkQSC4UIVT_js.cn(
              "p-1",
              position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
            ),
            children
          }
        ),
        /* @__PURE__ */ jsxRuntime.jsx(SelectScrollDownButton, {})
      ]
    }
  ) });
}
function SelectItem({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsxs(
    SelectPrimitive__namespace.Item,
    {
      "data-slot": "select-item",
      className: chunkQSC4UIVT_js.cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntime.jsx("span", { className: "absolute right-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntime.jsx(SelectPrimitive__namespace.ItemIndicator, { children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.CheckIcon, { className: "size-4" }) }) }),
        /* @__PURE__ */ jsxRuntime.jsx(SelectPrimitive__namespace.ItemText, { children })
      ]
    }
  );
}
function SelectScrollUpButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    SelectPrimitive__namespace.ScrollUpButton,
    {
      "data-slot": "select-scroll-up-button",
      className: chunkQSC4UIVT_js.cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronUpIcon, { className: "size-4" })
    }
  );
}
function SelectScrollDownButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    SelectPrimitive__namespace.ScrollDownButton,
    {
      "data-slot": "select-scroll-down-button",
      className: chunkQSC4UIVT_js.cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntime.jsx(lucideReact.ChevronDownIcon, { className: "size-4" })
    }
  );
}
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntime.jsx(
    "div",
    {
      "data-slot": "skeleton",
      className: chunkQSC4UIVT_js.cn("bg-accent animate-pulse rounded-md", className),
      ...props
    }
  );
}

Object.defineProperty(exports, "cn", {
  enumerable: true,
  get: function () { return chunkQSC4UIVT_js.cn; }
});
Object.defineProperty(exports, "AggregationFunctionSchema", {
  enumerable: true,
  get: function () { return chunk74OBHZM5_js.AggregationFunctionSchema; }
});
Object.defineProperty(exports, "ExportConfigSchema", {
  enumerable: true,
  get: function () { return chunk74OBHZM5_js.ExportConfigSchema; }
});
Object.defineProperty(exports, "ExportFormatSchema", {
  enumerable: true,
  get: function () { return chunk74OBHZM5_js.ExportFormatSchema; }
});
Object.defineProperty(exports, "PivotConfigSchema", {
  enumerable: true,
  get: function () { return chunk74OBHZM5_js.PivotConfigSchema; }
});
Object.defineProperty(exports, "PivotMetadataSchema", {
  enumerable: true,
  get: function () { return chunk74OBHZM5_js.PivotMetadataSchema; }
});
Object.defineProperty(exports, "PivotResultSchema", {
  enumerable: true,
  get: function () { return chunk74OBHZM5_js.PivotResultSchema; }
});
Object.defineProperty(exports, "ValueFieldConfigSchema", {
  enumerable: true,
  get: function () { return chunk74OBHZM5_js.ValueFieldConfigSchema; }
});
Object.defineProperty(exports, "aggregate", {
  enumerable: true,
  get: function () { return chunk74OBHZM5_js.aggregate; }
});
Object.defineProperty(exports, "aggregationFunctions", {
  enumerable: true,
  get: function () { return chunk74OBHZM5_js.aggregationFunctions; }
});
Object.defineProperty(exports, "avg", {
  enumerable: true,
  get: function () { return chunk74OBHZM5_js.avg; }
});
Object.defineProperty(exports, "count", {
  enumerable: true,
  get: function () { return chunk74OBHZM5_js.count; }
});
Object.defineProperty(exports, "first", {
  enumerable: true,
  get: function () { return chunk74OBHZM5_js.first; }
});
Object.defineProperty(exports, "formatAggregationName", {
  enumerable: true,
  get: function () { return chunk74OBHZM5_js.formatAggregationName; }
});
Object.defineProperty(exports, "generateColumnKey", {
  enumerable: true,
  get: function () { return chunk74OBHZM5_js.generateColumnKey; }
});
Object.defineProperty(exports, "getAggregationFunction", {
  enumerable: true,
  get: function () { return chunk74OBHZM5_js.getAggregationFunction; }
});
Object.defineProperty(exports, "last", {
  enumerable: true,
  get: function () { return chunk74OBHZM5_js.last; }
});
Object.defineProperty(exports, "max", {
  enumerable: true,
  get: function () { return chunk74OBHZM5_js.max; }
});
Object.defineProperty(exports, "median", {
  enumerable: true,
  get: function () { return chunk74OBHZM5_js.median; }
});
Object.defineProperty(exports, "min", {
  enumerable: true,
  get: function () { return chunk74OBHZM5_js.min; }
});
Object.defineProperty(exports, "parseColumnKey", {
  enumerable: true,
  get: function () { return chunk74OBHZM5_js.parseColumnKey; }
});
Object.defineProperty(exports, "sum", {
  enumerable: true,
  get: function () { return chunk74OBHZM5_js.sum; }
});
Object.defineProperty(exports, "transformToPivot", {
  enumerable: true,
  get: function () { return chunk74OBHZM5_js.transformToPivot; }
});
exports.Badge = Badge;
exports.Button = Button;
exports.Card = Card;
exports.CardContent = CardContent;
exports.CardDescription = CardDescription;
exports.CardFooter = CardFooter;
exports.CardHeader = CardHeader;
exports.CardTitle = CardTitle;
exports.Checkbox = Checkbox;
exports.ClientPivotWrapper = ClientPivotWrapper;
exports.Dialog = Dialog;
exports.DialogContent = DialogContent;
exports.DialogDescription = DialogDescription;
exports.DialogFooter = DialogFooter;
exports.DialogHeader = DialogHeader;
exports.DialogTitle = DialogTitle;
exports.DialogTrigger = DialogTrigger;
exports.DraggableField = DraggableField;
exports.DropZone = DropZone;
exports.DropdownMenu = DropdownMenu;
exports.DropdownMenuContent = DropdownMenuContent;
exports.DropdownMenuItem = DropdownMenuItem;
exports.DropdownMenuTrigger = DropdownMenuTrigger;
exports.ExportDialog = ExportDialog;
exports.Input = Input;
exports.Label = Label;
exports.PivotPanel = PivotPanel;
exports.PivotTable = PivotTable;
exports.RadioGroup = RadioGroup;
exports.RadioGroupItem = RadioGroupItem;
exports.ScrollArea = ScrollArea;
exports.Select = Select;
exports.SelectContent = SelectContent;
exports.SelectItem = SelectItem;
exports.SelectTrigger = SelectTrigger;
exports.SelectValue = SelectValue;
exports.Separator = Separator;
exports.Skeleton = Skeleton;
exports.Table = Table;
exports.TableBody = TableBody;
exports.TableCaption = TableCaption;
exports.TableCell = TableCell;
exports.TableFooter = TableFooter;
exports.TableHead = TableHead;
exports.TableHeader = TableHeader;
exports.TableRow = TableRow;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map