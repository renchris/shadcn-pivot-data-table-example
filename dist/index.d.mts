import { e as PivotRow, b as PivotConfig, f as PivotMetadata } from './types-B66R_aDx.mjs';
export { A as AggregationFn, m as AggregationFunction, i as AggregationFunctionSchema, r as AggregationFunctions, q as CellValue, C as ColumnGroup, n as DragData, D as DropZoneType, d as ExportConfig, k as ExportConfigSchema, E as ExportFormat, j as ExportFormatSchema, F as FieldDefinition, s as FormatFn, u as Formatters, P as PivotConfigSchema, h as PivotMetadataSchema, c as PivotResult, a as PivotResultSchema, o as PivotState, T as TransformOptions, l as ValueFieldConfig, V as ValueFieldConfigSchema, g as generateColumnKey, p as parseColumnKey, t as transformToPivot } from './types-B66R_aDx.mjs';
export { aggregate, aggregationFunctions, avg, cn, count, first, formatAggregationName, getAggregationFunction, last, max, median, min, sum } from './headless.mjs';
import * as React$1 from 'react';
import * as react_jsx_runtime from 'react/jsx-runtime';
import { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import * as class_variance_authority_types from 'class-variance-authority/types';
import { VariantProps } from 'class-variance-authority';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as LabelPrimitive from '@radix-ui/react-label';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import * as SelectPrimitive from '@radix-ui/react-select';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import '@tanstack/react-table';
import 'zod';
import 'clsx';

/**
 * Props for the PivotTable component
 */
interface PivotTableProps extends React.ComponentProps<"div"> {
    /** Transformed pivot data rows */
    data: PivotRow[];
    /** Pivot configuration used for the transformation */
    config: PivotConfig;
    /** Metadata about the pivot result (row count, column count, unique values) */
    metadata: PivotMetadata;
}
declare const PivotTable: React$1.MemoExoticComponent<({ data, config, metadata, className, style, ...props }: PivotTableProps) => react_jsx_runtime.JSX.Element>;

interface PivotPanelProps {
    config: PivotConfig;
    defaultConfig: PivotConfig;
    availableFields: Array<{
        name: string;
        type: string;
    }>;
    onConfigChange: (config: PivotConfig) => void;
    /** Additional CSS class names for the root Card element */
    className?: string;
    /** Inline styles for the root Card element */
    style?: React.CSSProperties;
}
declare function PivotPanel({ config, defaultConfig, availableFields, onConfigChange, className, style }: PivotPanelProps): react_jsx_runtime.JSX.Element;

interface ClientPivotWrapperProps {
    rawData: any[];
    initialConfig: PivotConfig;
    defaultConfig: PivotConfig;
    availableFields: Array<{
        name: string;
        type: string;
    }>;
    /** Additional CSS class names for the root container */
    className?: string;
    /** Inline styles for the root container */
    style?: React.CSSProperties;
    /** Additional CSS class names for the PivotPanel */
    panelClassName?: string;
    /** Additional CSS class names for the results Card */
    resultsClassName?: string;
    /** Additional CSS class names for the PivotTable */
    tableClassName?: string;
}
/**
 * Client-side pivot wrapper that performs instant transformations
 * This achieves AG Grid-level performance (50-80ms) by avoiding server round-trips
 */
declare function ClientPivotWrapper({ rawData, initialConfig, defaultConfig, availableFields, className, style, panelClassName, resultsClassName, tableClassName, }: ClientPivotWrapperProps): react_jsx_runtime.JSX.Element;

interface DraggableFieldProps {
    field: string;
    fieldType?: string;
    sourceZone?: 'available' | 'rows' | 'columns';
    onRemove?: () => void;
    inUse?: boolean;
    index?: number;
    /** Additional CSS class names for the Badge element */
    className?: string;
    /** Inline styles for the Badge element */
    style?: React.CSSProperties;
}
/**
 * Memoized DraggableField component to prevent unnecessary re-renders
 * Only re-renders when field, fieldType, sourceZone, or onRemove changes
 */
declare const DraggableField: React$1.MemoExoticComponent<({ field, fieldType, sourceZone, onRemove, inUse, index, className, style }: DraggableFieldProps) => react_jsx_runtime.JSX.Element>;

interface DropZoneProps {
    label: string;
    description?: string;
    fields: string[];
    onFieldAdd: (field: string, sourceZone?: 'available' | 'rows' | 'columns') => void;
    onFieldRemove: (field: string) => void;
    onFieldReorder?: (sourceField: string, targetField: string, edge: Edge) => void;
    zone: 'rows' | 'columns' | 'available';
    availableFields: Array<{
        name: string;
        type: string;
    }>;
    /** Additional CSS class names for the root container */
    className?: string;
    /** Inline styles for the root container */
    style?: React.CSSProperties;
    /** Additional CSS class names for the drop target area */
    dropAreaClassName?: string;
}
/**
 * Memoized DropZone component to prevent unnecessary re-renders
 * Only re-renders when props change (label, description, fields, handlers, zone, availableFields)
 */
declare const DropZone: React$1.MemoExoticComponent<({ label, description, fields, onFieldAdd, onFieldRemove, onFieldReorder, zone, availableFields, className, style, dropAreaClassName, }: DropZoneProps) => react_jsx_runtime.JSX.Element>;

interface ExportDialogProps {
    /** Pivot data to export */
    data: any[];
    /** Optional filename (without extension) */
    filename?: string;
    /** Additional CSS class names for the trigger button */
    className?: string;
    /** Inline styles for the trigger button */
    style?: React.CSSProperties;
    /** Additional CSS class names for the dialog content */
    dialogClassName?: string;
    /** Inline styles for the dialog content */
    dialogStyle?: React.CSSProperties;
}
declare function ExportDialog({ data, filename, className, style, dialogClassName, dialogStyle }: ExportDialogProps): react_jsx_runtime.JSX.Element;

declare const buttonVariants: (props?: ({
    variant?: "default" | "link" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined;
    size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
declare function Button({ className, variant, size, asChild, ...props }: React$1.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
}): react_jsx_runtime.JSX.Element;

declare function Card({ className, ...props }: React$1.ComponentProps<"div">): react_jsx_runtime.JSX.Element;
declare function CardHeader({ className, ...props }: React$1.ComponentProps<"div">): react_jsx_runtime.JSX.Element;
declare function CardTitle({ className, as: Component, ...props }: React$1.ComponentProps<"h3"> & {
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}): react_jsx_runtime.JSX.Element;
declare function CardDescription({ className, ...props }: React$1.ComponentProps<"div">): react_jsx_runtime.JSX.Element;
declare function CardContent({ className, ...props }: React$1.ComponentProps<"div">): react_jsx_runtime.JSX.Element;
declare function CardFooter({ className, ...props }: React$1.ComponentProps<"div">): react_jsx_runtime.JSX.Element;

declare function Checkbox({ className, ...props }: React$1.ComponentProps<typeof CheckboxPrimitive.Root>): react_jsx_runtime.JSX.Element;

declare function Dialog({ ...props }: React$1.ComponentProps<typeof DialogPrimitive.Root>): react_jsx_runtime.JSX.Element;
declare function DialogTrigger({ ...props }: React$1.ComponentProps<typeof DialogPrimitive.Trigger>): react_jsx_runtime.JSX.Element;
declare function DialogContent({ className, children, showCloseButton, ...props }: React$1.ComponentProps<typeof DialogPrimitive.Content> & {
    showCloseButton?: boolean;
}): react_jsx_runtime.JSX.Element;
declare function DialogHeader({ className, ...props }: React$1.ComponentProps<"div">): react_jsx_runtime.JSX.Element;
declare function DialogFooter({ className, ...props }: React$1.ComponentProps<"div">): react_jsx_runtime.JSX.Element;
declare function DialogTitle({ className, ...props }: React$1.ComponentProps<typeof DialogPrimitive.Title>): react_jsx_runtime.JSX.Element;
declare function DialogDescription({ className, ...props }: React$1.ComponentProps<typeof DialogPrimitive.Description>): react_jsx_runtime.JSX.Element;

declare function DropdownMenu({ ...props }: React$1.ComponentProps<typeof DropdownMenuPrimitive.Root>): react_jsx_runtime.JSX.Element;
declare function DropdownMenuTrigger({ ...props }: React$1.ComponentProps<typeof DropdownMenuPrimitive.Trigger>): react_jsx_runtime.JSX.Element;
declare function DropdownMenuContent({ className, sideOffset, ...props }: React$1.ComponentProps<typeof DropdownMenuPrimitive.Content>): react_jsx_runtime.JSX.Element;
declare function DropdownMenuItem({ className, inset, variant, ...props }: React$1.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
    variant?: "default" | "destructive";
}): react_jsx_runtime.JSX.Element;

declare function Input({ className, type, ...props }: React$1.ComponentProps<"input">): react_jsx_runtime.JSX.Element;

declare function Label({ className, ...props }: React$1.ComponentProps<typeof LabelPrimitive.Root>): react_jsx_runtime.JSX.Element;

declare function RadioGroup({ className, ...props }: React$1.ComponentProps<typeof RadioGroupPrimitive.Root>): react_jsx_runtime.JSX.Element;
declare function RadioGroupItem({ className, ...props }: React$1.ComponentProps<typeof RadioGroupPrimitive.Item>): react_jsx_runtime.JSX.Element;

declare function ScrollArea({ className, children, ...props }: React$1.ComponentProps<typeof ScrollAreaPrimitive.Root>): react_jsx_runtime.JSX.Element;

declare function Select({ ...props }: React$1.ComponentProps<typeof SelectPrimitive.Root>): react_jsx_runtime.JSX.Element;
declare function SelectValue({ ...props }: React$1.ComponentProps<typeof SelectPrimitive.Value>): react_jsx_runtime.JSX.Element;
declare function SelectTrigger({ className, size, children, ...props }: React$1.ComponentProps<typeof SelectPrimitive.Trigger> & {
    size?: "sm" | "default";
}): react_jsx_runtime.JSX.Element;
declare function SelectContent({ className, children, position, align, ...props }: React$1.ComponentProps<typeof SelectPrimitive.Content>): react_jsx_runtime.JSX.Element;
declare function SelectItem({ className, children, ...props }: React$1.ComponentProps<typeof SelectPrimitive.Item>): react_jsx_runtime.JSX.Element;

declare function Separator({ className, orientation, decorative, ...props }: React$1.ComponentProps<typeof SeparatorPrimitive.Root>): react_jsx_runtime.JSX.Element;

declare function Skeleton({ className, ...props }: React.ComponentProps<"div">): react_jsx_runtime.JSX.Element;

declare function Table({ className, ...props }: React$1.ComponentProps<"table">): react_jsx_runtime.JSX.Element;
declare function TableHeader({ className, ...props }: React$1.ComponentProps<"thead">): react_jsx_runtime.JSX.Element;
declare function TableBody({ className, ...props }: React$1.ComponentProps<"tbody">): react_jsx_runtime.JSX.Element;
declare function TableFooter({ className, ...props }: React$1.ComponentProps<"tfoot">): react_jsx_runtime.JSX.Element;
declare function TableRow({ className, ...props }: React$1.ComponentProps<"tr">): react_jsx_runtime.JSX.Element;
declare function TableHead({ className, ...props }: React$1.ComponentProps<"th">): react_jsx_runtime.JSX.Element;
declare function TableCell({ className, ...props }: React$1.ComponentProps<"td">): react_jsx_runtime.JSX.Element;
declare function TableCaption({ className, ...props }: React$1.ComponentProps<"caption">): react_jsx_runtime.JSX.Element;

declare const badgeVariants: (props?: ({
    variant?: "default" | "destructive" | "outline" | "secondary" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
declare function Badge({ className, variant, asChild, ...props }: React$1.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
}): react_jsx_runtime.JSX.Element;

export { Badge, Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Checkbox, ClientPivotWrapper, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DraggableField, DropZone, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, ExportDialog, Input, Label, PivotConfig, PivotMetadata, PivotPanel, PivotRow, PivotTable, RadioGroup, RadioGroupItem, ScrollArea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Separator, Skeleton, Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow };
