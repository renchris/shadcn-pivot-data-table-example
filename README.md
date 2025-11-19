# 📊 Shadcn Pivot Table

> Enterprise-grade pivot table library for React with server-side transformation, drag-and-drop configuration, and virtual scrolling

[![npm](https://img.shields.io/npm/v/shadcn-pivot-table)](https://www.npmjs.com/package/shadcn-pivot-table)
[![Next.js](https://img.shields.io/badge/Next.js-13+-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18+-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A powerful, framework-agnostic pivot table library built with Shadcn UI, TanStack Table v8, and modern React patterns. Features both styled and headless variants for maximum flexibility.

> **Note:** This is the library-only branch. For the interactive demo and local usage examples, see the [main branch](https://github.com/YOUR_ORG/pivot-table) or the public reference at [chrisrennewbie/shadcn-pivot-data-table-example](https://github.com/chrisrennewbie/shadcn-pivot-data-table-example).
>
> **🏢 Corporate Deployment?** See [CORPORATE-DEPLOYMENT.md](./CORPORATE-DEPLOYMENT.md) for organization-specific setup including .zip transfers and private registries.

## ✨ Features

### 🎯 Core Functionality
- ✅ **Server-Side Pivot Engine** - AG Grid-inspired transformation algorithm
- ✅ **Dynamic Column Generation** - Columns created from unique pivot values
- ✅ **8 Aggregation Functions** - Sum, Average, Count, Min, Max, Median, First, Last
- ✅ **Subtotals & Grand Totals** - Row totals, column totals, and grand total row
- ✅ **Type-Safe** - Full TypeScript + Zod validation throughout

### 🎨 User Interface
- ✅ **Drag-and-Drop Config** - Pragmatic Drag & Drop for field arrangement
- ✅ **Shadcn Components** - Built on proven UI patterns with Tailwind v4
- ✅ **URL-Based State** - Shareable pivot configurations via URL
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile

### ⚡ Performance
- ✅ **Virtual Scrolling** - Handles 100K+ rows at 60fps with TanStack Virtual
- ✅ **Server-Side Caching** - `use cache` directive for optimal performance
- ✅ **Streaming UI** - Suspense boundaries for progressive rendering
- ✅ **Small Bundle** - ~25KB (no React Query dependency)

### 📤 Export Functionality
- ✅ **CSV Export** - Excel-compatible format
- ✅ **Excel Export** - Formatted .xlsx with styling via ExcelJS
- ✅ **JSON Export** - Structured data for API integration

## 🚀 Quick Start

### Installation

```bash
npm install shadcn-pivot-table
# or
bun add shadcn-pivot-table
# or
yarn add shadcn-pivot-table
```

### Git Dependency (From GitHub)

**For corporate/private organizations**, use your organization's repository:

```bash
# Using HTTPS (recommended for CI/CD with GITHUB_TOKEN)
npm install pivot-table@git+https://github.com/YOUR_ORG/pivot-table.git#library

# Using SSH (recommended for local development)
npm install pivot-table@git+ssh://git@github.com/YOUR_ORG/pivot-table.git#library

# Or in package.json
{
  "dependencies": {
    "pivot-table": "git+https://github.com/YOUR_ORG/pivot-table.git#library"
  }
}
```

**Replace `YOUR_ORG`** with your GitHub organization name.

**For public reference implementation**:

```bash
npm install pivot-table@git+https://github.com/renchris/shadcn-pivot-data-table-example.git#library
```

This enables clean imports:
```typescript
import { PivotTable } from 'pivot-table'
import { transformToPivot } from 'pivot-table/headless'
```

**Why use Git dependencies?**
- ✅ Works with Next.js/Turbopack (avoids symlink issues)
- ✅ Access private organization repos
- ✅ Install pre-release versions or specific commits
- ✅ Clean import syntax with package aliases

**Version pinning:**
```bash
# Specific version tag
npm install pivot-table@git+https://...#v1.0.0

# Specific commit
npm install pivot-table@git+https://...#a204e45

# Latest on library branch (default)
npm install pivot-table@git+https://...#library
```

### Peer Dependencies

```bash
npm install react react-dom @tanstack/react-table @tanstack/react-virtual
```

For Shadcn UI components (required for styled variant):
```bash
npm install @radix-ui/react-checkbox @radix-ui/react-dialog @radix-ui/react-dropdown-menu
# ... (see package.json peerDependencies for full list)
```

### Basic Usage

```typescript
import { transformToPivot, PivotTable } from 'shadcn-pivot-table'

// Your raw data
const salesData = [
  { region: 'North', product: 'A', sales: 100, units: 10 },
  { region: 'North', product: 'B', sales: 150, units: 15 },
  { region: 'South', product: 'A', sales: 200, units: 20 },
]

// Configure the pivot
const config = {
  rowFields: ['region'],
  columnFields: ['product'],
  valueFields: [
    { field: 'sales', aggregation: 'sum', displayName: 'Total Sales' },
  ],
  options: {
    showRowTotals: true,
    showColumnTotals: true,
    showGrandTotal: true,
    expandedByDefault: false,
  },
}

// Transform and render
const result = transformToPivot(salesData, config)

<PivotTable
  data={result.data}
  config={result.config}
  metadata={result.metadata}
/>
```

## 📦 Entry Points

### Main Entry (Styled Components)

```typescript
import { PivotTable, transformToPivot } from 'shadcn-pivot-table'

// Includes full React UI with Shadcn components
```

### Headless Entry (Framework-Agnostic)

```typescript
import { transformToPivot, aggregate } from 'shadcn-pivot-table/headless'

// Core transformation logic only - build your own UI
// Use with Vue, Svelte, Angular, or vanilla JS
```

### Server Entry (Next.js)

```typescript
import { transformToPivot, exportPivotData } from 'shadcn-pivot-table/server'

// Server-side utilities for Next.js Server Actions
```

## 💡 Usage Examples

### Client-Side (Interactive Configuration)

```typescript
import { ClientPivotWrapper } from 'shadcn-pivot-table'

<ClientPivotWrapper
  rawData={salesData}
  initialConfig={config}
  availableFields={[
    { name: 'region', type: 'string' },
    { name: 'product', type: 'string' },
    { name: 'sales', type: 'number' },
  ]}
/>
```

### Server-Side (Next.js)

```typescript
// app/actions/pivot.ts
'use server'
import { transformToPivot } from 'shadcn-pivot-table/server'

export async function executePivot(config) {
  const data = await db.query('SELECT * FROM sales')
  return transformToPivot(data, config)
}

// app/page.tsx
import { PivotTable } from 'shadcn-pivot-table'

const result = await executePivot(config)
<PivotTable {...result} />
```

### Headless (Custom UI)

```typescript
import { transformToPivot } from 'shadcn-pivot-table/headless'

const result = transformToPivot(rawData, config)

// Build your own table UI with result.data
result.data.forEach(row => {
  // Custom rendering logic
})
```

### Export Functionality

```typescript
import { exportPivotData } from 'shadcn-pivot-table/server'

// Export as CSV
const csv = await exportPivotData(result, 'csv')

// Export as Excel
const excel = await exportPivotData(result, 'excel')

// Export as JSON
const json = await exportPivotData(result, 'json')
```

## 📖 API Reference

### `transformToPivot(data, config)`

Core transformation function that converts flat data into pivot table format.

**Parameters:**
- `data: unknown[]` - Array of raw data objects
- `config: PivotConfig` - Pivot configuration object

**Returns:**
```typescript
{
  data: PivotRow[]
  config: PivotConfig
  metadata: {
    rowFieldsData: FieldData[]
    columnFieldsData: FieldData[]
    valueFieldsData: FieldData[]
  }
}
```

### `PivotConfig`

```typescript
interface PivotConfig {
  rowFields: string[]
  columnFields: string[]
  valueFields: ValueField[]
  options?: {
    showRowTotals?: boolean
    showColumnTotals?: boolean
    showGrandTotal?: boolean
    expandedByDefault?: boolean
  }
}

interface ValueField {
  field: string
  aggregation: 'sum' | 'avg' | 'count' | 'min' | 'max' | 'median' | 'first' | 'last'
  displayName: string
}
```

### Aggregation Functions

All aggregation functions available from `shadcn-pivot-table/headless`:

```typescript
import { sum, avg, count, min, max, median, first, last } from 'shadcn-pivot-table/headless'

// Each function takes an array of values and returns a number
const total = sum([1, 2, 3]) // 6
const average = avg([1, 2, 3]) // 2
const middle = median([1, 2, 3, 4, 5]) // 3
```

## 🎯 Use Cases

- **Financial Dashboards** - P&L statements, balance sheets, trading analytics
- **Sales Analytics** - Regional performance, product comparisons, time-series analysis
- **Data Exploration** - Interactive data analysis for large datasets
- **Reporting Tools** - Embedded pivot tables in SaaS applications
- **Business Intelligence** - Self-service analytics for end users

## 📦 Tech Stack

- **React 18+** / **React 19**
- **TanStack Table v8** + TanStack Virtual
- **Pragmatic Drag & Drop** by Atlassian
- **Shadcn UI** components
- **TypeScript 5** + Zod validation
- **Next.js 13+** (optional, for server features)

## 🎬 Interactive Demo

Try the interactive demo with 5 financial scenarios:

👉 **[View Demo](https://github.com/chrisrennewbie/shadcn-pivot-data-table-example)** (main branch)

The demo showcases:
- Market Data OHLC analysis
- Trading desk P&L tracking
- Bond portfolio analytics
- Options Greeks exposure
- Risk VaR calculations

## 📚 Documentation

For complete documentation including local usage patterns, see the main repository:

- **[Repository](https://github.com/chrisrennewbie/shadcn-pivot-data-table-example)** - Main branch with demo
- **[LOCAL-USAGE.md](https://github.com/chrisrennewbie/shadcn-pivot-data-table-example/blob/main/LOCAL-USAGE.md)** - Local development patterns
- **[API.md](https://github.com/chrisrennewbie/shadcn-pivot-data-table-example/blob/main/API.md)** - Full API reference

## 🤝 Contributing

Contributions welcome! Please visit the [main repository](https://github.com/chrisrennewbie/shadcn-pivot-data-table-example) to:

- Report issues
- Submit pull requests
- Request features
- View the demo app

## 📄 License

MIT License - see [LICENSE](https://github.com/chrisrennewbie/shadcn-pivot-data-table-example/blob/main/LICENSE)

---

**Branches:**
- `library` - npm package (you are here)
- `main` - Demo app + library source

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
