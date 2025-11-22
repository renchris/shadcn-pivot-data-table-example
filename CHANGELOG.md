# shadcn-pivot-data-table-example

## 2.1.0

### Minor Changes

- # Field Ordering UX & Visual Hierarchy Improvements

  ## New Features

  ### Field Ordering Visualization & Drag-to-Reorder

  - **Numbered badges** (①②③) show hierarchy order in Row Groups/Pivot Columns
  - **Drag-to-reorder** fields within same dropzone (no remove/re-add needed)
  - **Drop indicator lines** show exact insertion position during drag
  - Follows Excel, Tableau, AG Grid patterns for professional UX

  ### Enhanced Visual Hierarchy

  - **Parent row styling**: Subtle backgrounds distinguish group headers from data rows
  - **Section borders**: Top borders on parent rows create clear visual blocks
  - **Refined header**: Clean border-based design (bg-muted/40 with border-b-2)
  - **Improved indentation**: Reduced to 1.5rem (24px - Ant Design standard)
  - **Vertical guides**: Border-left on parent rows shows tree structure
  - **Right-aligned numeric headers**: Headers match data alignment

  ### Improved Expand/Collapse UX

  - **Expand by default**: All rows start expanded for immediate data visibility
  - **Full row clickable**: Entire parent row toggles expand/collapse (not just chevron)
  - **Visual indicators**: Smaller chevrons (h-4) with better proportions

  ## Performance Improvements

  ### Server-Side Request Deduplication

  - **React cache()** wrapper eliminates duplicate data loading
  - **50% faster**: 2 calls → 1 execution per request
  - **Clean logging**: Color-coded cache behavior (🔵 MISS with timing)
  - React 19 compatible, future-proof implementation

  ## Technical Changes

  - Add `index` prop to DraggableField for numbered badges
  - Implement ReorderableField wrapper component for drop targeting
  - Add reorder handlers in PivotPanel (handleReorderRowFields, handleReorderColumnFields)
  - Update PivotRow interface with optional fields
  - Fix transformer hierarchy logic (no longer requires showRowTotals flag)
  - Convert fetchDataSource to cache-wrapped arrow function

  ## Breaking Changes

  None - all changes are backward compatible

  ## Migration

  No migration needed - features work automatically with existing configurations

## 2.0.0

### Major Changes

- d60c0da: Redesign pivot workflow to start unpivoted with business context

  BREAKING CHANGES:

  - Scenarios now start in unpivoted view (empty rowFields/columnFields) instead of pre-configured pivots
  - ClientPivotWrapper and PivotPanel components now require defaultConfig prop
  - ScenarioConfig interface includes new businessValue field

  NEW FEATURES:

  - Unpivoted view mode displays raw data before pivoting for exploration
  - Business value descriptions explain use cases for each scenario
  - "IN USE" field indicators improve UX without hiding fields

  BUG FIXES:

  - Resolve duplicate column key errors with unique prefixes (row*, value*, pivot*, unpivoted*)
  - Fix scenario config pollution when switching scenarios

  DEVELOPER EXPERIENCE:

  - Enable --inspect flag by default for debugging
  - Add comprehensive debugging documentation
  - Add VS Code launch.json configuration
  - Add PIVOT-TABLE-GUIDE.md for user guidance

## 1.1.1

### Patch Changes

- 6b8a059: Fix React 19 compatibility documentation

  **Major Documentation Corrections:**

  - Corrected React 19 support status - all dependencies fully support React 19
  - Fixed incorrect information about lucide-react (we use web package which supports React 19 since Dec 2024)
  - Fixed incorrect information about @atlaskit/pragmatic-drag-and-drop (framework-agnostic, no React peer dependency)
  - Updated package.json peerDependencies to explicitly include React 19: `^18.3.0 || ^19.0.0`

  **Files Updated:**

  - COMPATIBILITY.md - Changed React 19 from "Partially Supported" to "Fully Supported"
  - README.md - Updated requirements to show React 19 is fully supported
  - CORPORATE-DEPLOYMENT.md - Removed incorrect peer dependency conflict warnings
  - package.json - Added explicit React 19 support in peerDependencies

  **Additional Enhancements:**

  - Added comprehensive Bun version documentation (minimum 1.0.0, recommended 1.1.18+ for .npmrc support)
  - Created bunfig.toml template for corporate registry configuration
  - Created .env.example with NPM_TOKEN setup instructions
  - Enhanced .gitignore with registry credential protection
  - Added BUNDLE-INSTRUCTIONS.md for Git bundle recipients
  - Created COMPATIBILITY.md as comprehensive version compatibility guide

  **Result:** React 19 is now correctly documented as fully supported across all documentation.

## 1.1.0

### Minor Changes

- Add two-branch library strategy and comprehensive corporate deployment documentation

  - Implement dual-branch strategy: main (demo) and library (npm package)
  - Add CORPORATE-DEPLOYMENT.md with 3 deployment methods (Git, file path, private registry)
  - Add SETUP-CHECKLIST.md for step-by-step corporate deployment verification
  - Add templates/ directory with ready-to-use configuration files
  - Update all documentation with YOUR_ORG placeholders for organization portability
  - Built library (dist/) is committed to git for zero-build deployment
  - Full Next.js 16/Turbopack compatibility via Git dependencies

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
