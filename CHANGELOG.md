# shadcn-pivot-data-table-example

## 1.0.0

### Major Changes

- 6d7c7a5: Initial release of enterprise-grade pivot table

  - feat: Server-side pivot transformation engine with AG Grid-inspired algorithm
  - feat: Shadcn Data Table integration with TanStack Table v8
  - feat: Virtual scrolling for 100K+ rows using TanStack Virtual
  - feat: Drag-and-drop field configuration with Pragmatic Drag and Drop
  - feat: Dynamic column generation from pivot values
  - feat: Multiple aggregation functions (sum, avg, count, min, max, median, first, last)
  - feat: Subtotals and grand totals support
  - feat: Export functionality (CSV, Excel, JSON)
  - feat: Server Components + Server Actions architecture (no React Query)
  - feat: URL-based configuration for shareable pivot links
  - feat: Type-safe implementation with Zod validation
  - feat: Sample data generator for demonstration

### Minor Changes

- 4800b9f: # Enterprise Pivot Table with AG Grid-level Performance

  ## New Features

  ### Pivot Table Implementation

  - Client-side pivot transformation engine with 0.69ms - 13ms performance
  - Five enterprise scenarios: market data, trading P&L, bond portfolio, options Greeks, risk VaR
  - Scenario selector with real-time switching
  - URL state persistence for shareable pivot configurations
  - Comprehensive test coverage (unit + e2e with Playwright)

  ### Bidirectional Drag-and-Drop

  - AG Grid-style drag-and-drop between all zones (Available ↔ Row Groups ↔ Pivot Columns)
  - Source zone tracking for intelligent cross-zone moves
  - Visual remove buttons on hover
  - Instant drag operations with <100ms perceived lag

  ## Performance Optimizations

  - Reduced URL debounce from 300ms to 100ms (200ms improvement)
  - React.memo on DraggableField and DropZone components
  - Single source of truth for config state (eliminated duplicate state)
  - Reduced state updates from 3 to 1 per drag operation

  ## Architecture

  - Hybrid server/client pattern for instant transformations
  - Isomorphic pivot transformer (runs on server and client)
  - React Server Components + Server Actions
  - Type-safe with Zod validation
  - Zero-dependency pivot algorithm

  ## Test Coverage

  - Unit tests for all 5 scenarios with realistic financial data
  - E2E tests for pivot creation, scenario switching, URL persistence, export, and drag-and-drop
  - Page Object Model pattern for maintainable tests

### Patch Changes

- 20faff2: # Drag-and-Drop UX Improvements

  ## Bug Fixes

  ### Remove Button Integration

  - Integrated remove button inside badge instead of floating externally
  - Fixed inverted color states (now: subtle grey → dark on hover)
  - Reduced button size from 3.5×3.5 to 3×3 for better proportions
  - Removed destructive red hover that clashed with badge aesthetic

  ### Display Fixes

  - Fixed `__TOTAL__` appearing as literal text in subtotal rows
  - Now displays user-friendly labels: "Total", "Column Total", "Grand Total"

  ## UX Enhancements

  ### React Portal Drag Preview

  - Implemented official Pragmatic Drag and Drop pattern with `createPortal`
  - Removed rectangular wrapper border from drag preview
  - Clean badge-only preview during drag operations
  - Reduced code complexity by ~40% (removed manual DOM manipulation)

  ### Preserved Click Offset

  - Switched from `pointerOutsideOfPreview` to `preserveOffsetOnSource`
  - Badge maintains position where user clicked during drag
  - Follows Atlassian design guidelines for small draggable elements
  - Natural dragging feel without jarring repositioning

  ## Code Quality

  - Removed `getFieldIconSVG()` helper function (no longer needed)
  - Simplified drag state management with state machine pattern
  - Better adherence to Pragmatic Drag and Drop best practices
