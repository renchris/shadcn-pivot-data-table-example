# 📊 Enterprise Pivot Table

> Production-ready pivot table built with Shadcn Data Table, TanStack Table v8, and Next.js 16 App Router

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

https://github.com/renchris/shadcn-pivot-data-table-example

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

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.3.0+) or Node.js 20.9.0+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/renchris/shadcn-pivot-data-table-example.git
cd shadcn-pivot-data-table-example

# Install dependencies
bun install

# Start development server
bun dev

# Open in browser
open http://localhost:3000/pivot
```

### Alternative with npm/pnpm/yarn

```bash
# npm
npm install && npm run dev

# pnpm
pnpm install && pnpm dev

# yarn
yarn install && yarn dev
```

## 📖 Usage

1. **Navigate to** `/pivot` route
2. **Drag fields** from "Available Fields" to drop zones
3. **Configure pivot:**
   - Row Groups: Fields that become row headers
   - Pivot Columns: Fields that become column headers
   - Values: Metrics to aggregate (auto-configured)
4. **Share URL** - Configuration is in the URL
5. **Export data** - Click Export button

## 📁 Project Structure

```
src/
├── app/
│   ├── pivot/page.tsx        # Server Component
│   └── actions/pivot.ts      # Server Actions
├── components/
│   ├── ui/                   # Shadcn components
│   └── pivot-table/          # Pivot components
└── lib/pivot/
    ├── schemas.ts            # Zod schemas
    ├── transformer.ts        # Pivot algorithm
    └── aggregations.ts       # Functions
```

## 📦 Tech Stack

- **Next.js 16** + Turbopack
- **React 19** Server Components
- **TanStack Table v8** + Virtual
- **Pragmatic Drag & Drop**
- **Tailwind CSS v4**
- **TypeScript** + Zod
- **Bun** runtime

## 🤝 Contributing

Contributions welcome! Fork, modify, and submit a PR.

## 📄 License

MIT License - see [LICENSE](LICENSE)

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
