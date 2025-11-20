# 📊 Enterprise Pivot Table - Interactive Demo

> Production-ready pivot table library with interactive Next.js demo showcasing drag-and-drop configuration, financial scenarios, and export functionality

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A powerful, framework-agnostic pivot table library built with Shadcn UI, TanStack Table v8, and modern React patterns. This repository contains both the **interactive demo application** and the **library source code** for flexible local usage.

## ⚙️ Requirements

**Runtime & Package Managers:**
- **Node.js** 18.0.0+ (20.x recommended)
- **npm** 9.0.0+ or **Bun** 1.1.18+ (Bun recommended for speed & corporate .npmrc support)

**Framework & Libraries:**
- **React** 18.3.0+ or 19.x (both fully supported - see [COMPATIBILITY.md](./COMPATIBILITY.md))
- **Next.js** 15.0.0+ (16.x recommended for Turbopack, requires React 19+)
- **TypeScript** 5.0.0+

📖 **See [COMPATIBILITY.md](./COMPATIBILITY.md)** for comprehensive version compatibility information, including:
- React 18 vs React 19 support status
- Next.js version requirements and breaking changes
- Corporate registry version lag guidance
- Dependency-specific version requirements
- Upgrade guides and troubleshooting

## 🎬 Quick Demo

```bash
# Clone from your organization (or public reference)
git clone https://github.com/YOUR_ORG/pivot-table.git
cd pivot-table
bun install
bun dev

# Open http://localhost:3000/pivot
```

**Note**: Replace `YOUR_ORG` with your organization name.

The demo includes **5 financial scenarios**:
- 📈 **Market Data** - OHLC analysis for tech stocks
- 💰 **Trading P&L** - Multi-desk profit & loss tracking
- 🏦 **Bond Portfolio** - Fixed income analytics
- 📊 **Options Greeks** - Risk exposure analysis
- ⚠️ **Risk VaR** - Value-at-Risk by asset class

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

## 📦 Using as a Library

This repository is structured for **flexible usage across organizations**. Choose the method that fits your deployment scenario:

### 🏢 Corporate Deployment (Recommended for Next.js 16/Turbopack)

**For organizations deploying this library internally:**

```json
{
  "dependencies": {
    "pivot-table": "git+https://github.com/YOUR_ORG/pivot-table.git#library"
  }
}
```

**Replace `YOUR_ORG`** with your GitHub organization name (e.g., `acme-corp`).

**Setup:**
1. Fork or upload this repository to your organization's GitHub
2. Build the library: `npm install && npm run build`
3. Install in consumer projects using the Git dependency above
4. Clean imports work immediately: `import { PivotTable } from 'pivot-table'`

✅ **Works perfectly with Next.js 16/Turbopack** (no symlink issues)
✅ **Organization-portable** (no hardcoded references)
✅ **Version controlled** and easy to update

📖 **See [DEPLOYMENT.md](./DEPLOYMENT.md)** for complete deployment guide including .zip transfers, private registries, and authentication.

---

### 💻 Local Development Options

#### Option 1: Bun/npm Link

```bash
# Clone and link globally
git clone https://github.com/YOUR_ORG/pivot-table.git
cd pivot-table
bun install && bun run build
bun link

# In your project
bun link shadcn-pivot-data-table-example
```

#### Option 2: File Path Dependency

```json
{
  "dependencies": {
    "shadcn-pivot-table": "file:./lib/pivot-table"
  }
}
```

⚠️ **Note**: File paths create symlinks that don't work with Next.js 16/Turbopack. Use Git dependencies instead.

#### Option 3: Git Submodule

```bash
git submodule add https://github.com/YOUR_ORG/pivot-table.git lib/pivot-table
```

#### Option 4: npm Package (When Published)

```bash
npm install shadcn-pivot-table
```

📖 **See [LOCAL-USAGE.md](./LOCAL-USAGE.md) for complete guide** on all local usage patterns, including workspace integration and direct source copying.

## 🚀 Basic Usage

### Styled Component (Full UI)

```typescript
import { PivotTable, transformToPivot } from 'shadcn-pivot-data-table-example'

const config = {
  rowFields: ['region'],
  columnFields: ['product'],
  valueFields: [
    { field: 'sales', aggregation: 'sum', displayName: 'Total Sales' },
  ],
}

const result = transformToPivot(rawData, config)

<PivotTable
  data={result.data}
  config={result.config}
  metadata={result.metadata}
/>
```

### Client-Side (Interactive Configuration)

```typescript
import { ClientPivotWrapper } from 'shadcn-pivot-data-table-example'

<ClientPivotWrapper
  rawData={salesData}
  initialConfig={config}
  availableFields={[
    { name: 'region', type: 'string' },
    { name: 'sales', type: 'number' },
  ]}
/>
```

### Server-Side (Next.js)

```typescript
// app/actions/pivot.ts
'use server'
import { transformToPivot } from 'shadcn-pivot-data-table-example/server'

export async function executePivot(config) {
  const data = await db.query('SELECT * FROM sales')
  return transformToPivot(data, config)
}

// app/page.tsx
import { PivotTable } from 'shadcn-pivot-data-table-example'

const result = await executePivot(config)
<PivotTable {...result} />
```

### Headless (Framework-Agnostic)

```typescript
import { transformToPivot } from 'shadcn-pivot-data-table-example/headless'

// Use with Vue, Svelte, Angular, or vanilla JS
const result = transformToPivot(rawData, config)
// Build your own UI with result.data
```

## 📖 Documentation

- **[LOCAL-USAGE.md](./LOCAL-USAGE.md)** - Complete guide for local usage patterns
- **[API.md](./API.md)** - Full API reference and examples
- **[LIBRARY-READY.md](./LIBRARY-READY.md)** - Library packaging status

## 📁 Repository Structure

```
shadcn-pivot-data-table-example/
├── src/
│   ├── app/                      # Next.js demo application
│   │   ├── pivot/                # Demo page (/pivot route)
│   │   └── actions/              # Server actions
│   ├── components/
│   │   ├── pivot-table/          # Library React components
│   │   └── ui/                   # Shadcn UI components (19 components)
│   ├── lib/pivot/
│   │   ├── transformer.ts        # Core pivot transformation algorithm
│   │   ├── aggregations.ts       # 8 aggregation functions
│   │   ├── schemas.ts            # Zod validation schemas
│   │   ├── types.ts              # TypeScript type definitions
│   │   ├── export.ts             # CSV/Excel/JSON export utilities
│   │   └── scenarios.ts          # Demo financial scenarios
│   └── __tests__/                # Test suites for all scenarios
├── dist/                         # Built library (after `bun run build`)
│   ├── index.{js,cjs,d.ts}       # Main entry (styled components)
│   ├── headless.{js,cjs,d.ts}    # Headless entry (no React)
│   └── server.{js,cjs,d.ts}      # Server entry (Next.js)
├── e2e/                          # Playwright E2E tests
├── scripts/
│   └── sync-library-branch.sh   # Script to sync library branch
├── package.json                  # Main package (private: true, demo + library)
└── tsup.config.ts                # Library build configuration
```

## 📦 Tech Stack

- **Next.js 16** + Turbopack
- **React 19** Server Components
- **TanStack Table v8** + Virtual
- **Pragmatic Drag & Drop** by Atlassian
- **Shadcn UI** with Tailwind CSS v4
- **TypeScript 5** + Zod validation
- **Bun** runtime and package manager

## 🎯 Use Cases

- **Financial Dashboards** - P&L statements, balance sheets, trading analytics
- **Sales Analytics** - Regional performance, product comparisons, time-series
- **Data Exploration** - Interactive analysis for large datasets
- **Reporting Tools** - Embedded pivot tables in SaaS applications
- **Business Intelligence** - Self-service analytics for end users

## 🔧 Development

### Run the Demo

```bash
bun install
bun dev                  # Start Next.js dev server (http://localhost:3000)
```

### Build the Library

```bash
bun run build           # Build library to dist/
bun run dev:lib         # Watch mode for library development
```

### Testing

```bash
bun test                # Run unit tests
bun run test:watch      # Watch mode for tests
bun run test:coverage   # Generate coverage report
bun run test:e2e        # Run Playwright E2E tests
```

### Sync to Library Branch

```bash
# Create/update library branch for npm publishing
bash scripts/sync-library-branch.sh
```

This script:
- Creates `library` branch from `main`
- Removes demo-specific files (`src/app`, `e2e`, scenarios)
- Updates `package.json` for publishing (`private: false`)
- Commits changes with sync reference

## 🏗️ Architecture Decisions

This repository uses a **hybrid structure** that optimizes for both demo and library usage:

### Why Not a Monorepo?

We chose a **flat structure** over `packages/pivot-table/` for several reasons:

1. **Simpler Local Paths** - `file:./lib/pivot-table` vs `file:./lib/pivot-table/packages/pivot-table`
2. **Immediate Demo** - `bun dev` works right after clone
3. **Easy Linking** - `bun link` from root, no navigation
4. **Familiar Pattern** - Matches single-package open source projects

### Branch Strategy

- **`main` branch** - Demo app + library source (this branch, for .zip downloads and local usage)
- **`library` branch** - Auto-generated, library-only code for npm publishing

This keeps development simple (everything on `main`) while providing a clean library branch for publishing.

## 🚢 Deploying the Demo

The demo Next.js app can be self-deployed to any provider:

```bash
# Build for production
bun run build:demo

# Start production server
bun start

# Or deploy to:
# - Vercel (easiest for Next.js)
# - AWS Amplify / EC2 / EKS
# - Harness.io Pipeline
# - Any Node.js / Bun hosting
```

## 🤝 Contributing

Contributions welcome! This project is designed for:

- Library features (new aggregations, export formats, etc.)
- Demo improvements (new scenarios, better UX)
- Documentation enhancements
- Bug fixes and optimizations

Please open an issue first to discuss significant changes.

## 📄 License

MIT License - see [LICENSE](LICENSE)

---

**Repository Structure:**
- Main branch: Demo + library source (you are here)
- Library branch: Packaged for npm publishing

**For local usage:** See [LOCAL-USAGE.md](./LOCAL-USAGE.md)
**For API docs:** See [API.md](./API.md)

---
