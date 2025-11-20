# Local Usage Guide

This guide explains how to use the Shadcn Pivot Table library in your project **without publishing to npm**. These patterns are ideal for local development, customization, or when you want to use the library from source.

> **🏢 Corporate Deployment?** See [DEPLOYMENT.md](./DEPLOYMENT.md) for organization-specific setup including .zip transfers, private registries, and Next.js 16/Turbopack compatibility.

## Table of Contents

- [Overview](#overview)
- [Usage Patterns](#usage-patterns)
  - [1. Bun/npm Link (Recommended)](#1-bunnpm-link-recommended)
  - [2. File Path Dependency](#2-file-path-dependency)
  - [3. Git Submodule](#3-git-submodule)
  - [4. Workspace Dependency](#4-workspace-dependency)
  - [5. Direct Source Copy](#5-direct-source-copy)
- [Running the Demo](#running-the-demo)
- [Building the Library](#building-the-library)
- [Troubleshooting](#troubleshooting)

---

## Overview

This repository is structured as a **hybrid demo + library package**:

- **Library source**: `src/` (components, lib, utilities)
- **Built library**: `dist/` (compiled ESM, CJS, TypeScript declarations)
- **Demo app**: `src/app/` (Next.js demo application)

**Key benefits for local usage:**
- ✅ Library package at root (short, clean paths)
- ✅ Demo works immediately: `bun dev`
- ✅ No deep nesting (no `packages/` subdirectory)
- ✅ All local import patterns work seamlessly

---

## Usage Patterns

### 1. Bun/npm Link (Recommended)

Link the library globally for use across multiple projects.

#### Setup

```bash
# Clone the repository (use YOUR_ORG)
git clone https://github.com/YOUR_ORG/pivot-table.git
cd pivot-table

# Install dependencies and build
bun install
bun run build

# Link globally
bun link
```

#### In Your Project

```bash
cd ~/my-project
bun link shadcn-pivot-data-table-example

# Or if you renamed it:
bun link shadcn-pivot-table
```

#### Usage in Code

```typescript
import { PivotTable } from 'shadcn-pivot-data-table-example'
import { transformToPivot } from 'shadcn-pivot-data-table-example/headless'
import { exportPivotData } from 'shadcn-pivot-data-table-example/server'
```

#### Rebuilding After Changes

```bash
# In the library directory
cd ~/Development/shadcn-pivot-data-table-example
bun run build

# Your project will automatically use the updated version
```

**Pros:**
- Fast development workflow
- Changes reflect immediately across all linked projects
- No file copying needed

**Cons:**
- Requires rebuild after source changes
- Link persists globally (can cause confusion if forgotten)

---

### 2. File Path Dependency

Reference the library directly via local file path in `package.json`.

#### Setup

```bash
# Your project structure
my-project/
├── package.json
└── lib/
    └── pivot-table/  (cloned repo)
```

```bash
cd my-project
git clone https://github.com/YOUR_ORG/pivot-table.git lib/pivot-table
cd lib/pivot-table
bun install
bun run build
cd ../..
bun install
```

#### package.json

```json
{
  "dependencies": {
    "shadcn-pivot-table": "file:./lib/pivot-table"
  }
}
```

#### Usage in Code

```typescript
import { PivotTable } from 'shadcn-pivot-table'
import { transformToPivot } from 'shadcn-pivot-table/headless'
```

**Pros:**
- Self-contained within your project
- Version controlled via your project's dependencies
- Works in CI/CD without special setup

**Cons:**
- Takes up disk space (full repo copy)
- Requires manual updates to get library changes

---

### 3. Git Submodule

Add the library as a Git submodule for version-controlled local usage.

#### Setup

```bash
cd my-project
git submodule add https://github.com/YOUR_ORG/pivot-table.git lib/pivot-table
git submodule update --init --recursive
cd lib/pivot-table
bun install
bun run build
cd ../..
```

#### package.json

```json
{
  "dependencies": {
    "shadcn-pivot-table": "file:./lib/pivot-table"
  },
  "scripts": {
    "postinstall": "cd lib/pivot-table && bun install && bun run build"
  }
}
```

#### Updating the Submodule

```bash
# Pull latest changes
cd lib/pivot-table
git pull origin main
bun install
bun run build
cd ../..

# Commit the submodule update
git add lib/pivot-table
git commit -m "Update pivot-table submodule"
```

**Pros:**
- Git tracks exact version used
- Easy to update to specific commits
- Team members get same version via git clone --recurse-submodules

**Cons:**
- Submodule management requires Git knowledge
- CI/CD needs special clone commands

#### CI/CD Example (Dockerfile)

```dockerfile
# Clone with submodules
RUN git clone --recurse-submodules <your-repo-url> /app

# Build the submodule library
WORKDIR /app/lib/pivot-table
RUN bun install && bun run build

# Install main app
WORKDIR /app
RUN bun install
```

---

### 4. Workspace Dependency

Integrate the library into a monorepo workspace (Bun, npm, pnpm, or Yarn workspaces).

#### Bun Workspaces Example

**Your project structure:**
```
my-monorepo/
├── package.json  (workspace root)
├── apps/
│   └── web/
│       └── package.json
├── packages/
│   └── ui/
└── vendor/
    └── pivot-table/  (cloned repo)
```

**Root package.json:**
```json
{
  "name": "my-monorepo",
  "workspaces": [
    "apps/*",
    "packages/*",
    "vendor/pivot-table"
  ]
}
```

**apps/web/package.json:**
```json
{
  "dependencies": {
    "shadcn-pivot-data-table-example": "workspace:*"
  }
}
```

#### Setup

```bash
cd my-monorepo

# Clone library into vendor/
git clone https://github.com/YOUR_ORG/pivot-table.git vendor/pivot-table

# Install all workspace dependencies
bun install

# Build the library
cd vendor/pivot-table
bun run build
```

#### Usage in apps/web

```typescript
import { PivotTable } from 'shadcn-pivot-data-table-example'
```

**Pros:**
- Native workspace integration
- Centralized dependency management
- Easy to work on library and app together

**Cons:**
- Requires workspace setup
- More complex tooling configuration

---

### 5. Direct Source Copy

Copy library source directly into your project for full customization.

#### Setup

```bash
# Clone the repo temporarily
git clone https://github.com/YOUR_ORG/pivot-table.git /tmp/pivot-table

# Copy library source to your project
cp -r /tmp/pivot-table/src/components/pivot-table my-project/src/components/
cp -r /tmp/pivot-table/src/lib/pivot my-project/src/lib/
cp -r /tmp/pivot-table/src/components/ui my-project/src/components/

# Copy utilities
cp /tmp/pivot-table/src/lib/utils.ts my-project/src/lib/

# Clean up
rm -rf /tmp/pivot-table
```

#### Install Required Dependencies

```json
{
  "dependencies": {
    "@atlaskit/pragmatic-drag-and-drop": "^1.7.7",
    "@atlaskit/pragmatic-drag-and-drop-hitbox": "^1.1.0",
    "@radix-ui/react-checkbox": "^1.3.0",
    "@radix-ui/react-dialog": "^1.1.0",
    "@radix-ui/react-dropdown-menu": "^2.1.0",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-radio-group": "^1.3.0",
    "@radix-ui/react-scroll-area": "^1.2.0",
    "@radix-ui/react-select": "^2.2.0",
    "@radix-ui/react-separator": "^1.1.0",
    "@radix-ui/react-slot": "^1.2.0",
    "@tanstack/react-table": "^8.20.0",
    "@tanstack/react-virtual": "^3.10.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.553.0",
    "tailwind-merge": "^3.4.0",
    "zod": "^4.1.12"
  },
  "optionalDependencies": {
    "exceljs": "^4.4.0"
  }
}
```

#### Usage in Code

```typescript
// Direct imports from your source
import { PivotTable } from '@/components/pivot-table/pivot-table'
import { transformToPivot } from '@/lib/pivot/transformer'
import { Button } from '@/components/ui/button'
```

**Pros:**
- Full control and customization
- No build step needed (Next.js/Vite compiles)
- Can modify components directly

**Cons:**
- No automatic updates from upstream
- More files to maintain
- Harder to track changes

---

## Running the Demo

The demo Next.js app is included in the repository:

```bash
# Clone and install
git clone https://github.com/YOUR_ORG/pivot-table.git
cd shadcn-pivot-data-table-example
bun install

# Run demo
bun dev

# Open http://localhost:3000/pivot
```

The demo showcases:
- ✅ 5 financial scenarios (market data, trading P&L, bonds, options, risk)
- ✅ Interactive drag-and-drop field configuration
- ✅ Multiple aggregations (sum, avg, count, min, max, median, first, last)
- ✅ Export functionality (CSV, Excel, JSON)
- ✅ URL-based state persistence

---

## Building the Library

The library uses [tsup](https://tsup.egoist.dev/) for building:

```bash
# One-time build
bun run build

# Watch mode (rebuilds on changes)
bun run dev:lib
```

**Build output:**
```
dist/
├── index.js                  # ESM main entry
├── index.cjs                 # CommonJS main entry
├── index.d.ts                # TypeScript types
├── headless.js               # ESM headless entry
├── headless.cjs              # CommonJS headless
├── headless.d.ts             # Headless types
├── server.js                 # ESM server entry
├── server.cjs                # CommonJS server
├── server.d.ts               # Server types
└── [chunk files and maps]
```

**Entry points:**
- **Main** (`index`): Full-featured with styled React components
- **Headless** (`headless`): Framework-agnostic core transformation logic
- **Server** (`server`): Next.js server-side utilities

---

## Troubleshooting

### Issue: "Cannot find module 'shadcn-pivot-table'"

**Solution:** Make sure you've built the library:
```bash
cd path/to/pivot-table
bun run build
```

### Issue: "Module not found" errors for peer dependencies

**Solution:** Install the required peer dependencies in your project:
```bash
bun add @tanstack/react-table @tanstack/react-virtual
bun add @radix-ui/react-dropdown-menu @radix-ui/react-checkbox
# ... (see package.json peerDependencies)
```

### Issue: Link not working after rebuild

**Solution:** Unlink and relink:
```bash
bun unlink shadcn-pivot-data-table-example
cd path/to/pivot-table && bun link
cd path/to/your-project && bun link shadcn-pivot-data-table-example
```

### Issue: Types not found in TypeScript

**Solution:** Ensure `dist/` is not gitignored and contains `.d.ts` files:
```bash
bun run build
ls dist/*.d.ts  # Should show index.d.ts, headless.d.ts, server.d.ts
```

### Issue: File path dependency not updating

**Solution:** Remove node_modules and reinstall:
```bash
rm -rf node_modules
bun install
```

### Issue: Build fails with "Cannot find module"

**Solution:** Install all dependencies:
```bash
rm -rf node_modules
bun install
bun run build
```

---

## Comparison Table

| Pattern | Setup Complexity | Update Ease | CI/CD Support | Use Case |
|---------|------------------|-------------|---------------|----------|
| **bun link** | Low | Excellent | No | Multi-project development |
| **File path** | Low | Manual | Yes | Single project, simple |
| **Git submodule** | Medium | Good | Yes | Version tracking |
| **Workspace** | High | Excellent | Yes | Monorepo |
| **Direct copy** | Medium | Manual | Yes | Heavy customization |

---

## Additional Resources

- **API Documentation**: See [API.md](./API.md)
- **Library Status**: See [LIBRARY-READY.md](./LIBRARY-READY.md)
- **npm Package**: For published version, see `library` branch
- **Issues**: Track issues in your organization's repository

---

For questions or contributions, please open an issue on GitHub.
