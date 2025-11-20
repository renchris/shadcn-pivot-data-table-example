# Source-Only Archive Installation Instructions

This file (`pivot-table-source-nogit.tar.gz`) contains the **source code only** of the pivot table library without Git history. This is a fallback option if the Git bundle cannot be delivered via email.

## What's Included

- ✅ All TypeScript source code (`.ts`, `.tsx` files)
- ✅ All documentation (`.md` files)
- ✅ Configuration files (`package.json`, `tsconfig.json`, etc.)
- ✅ Templates directory with deployment examples
- ✅ Test suites (unit and E2E tests)
- ❌ `.git` directory (Git history excluded for email safety)
- ❌ `node_modules` (dependencies must be installed)
- ❌ `dist` folder (must be built after extraction)

**Size**: 2.1 MB

## Why This Version?

This archive excludes the `.git` directory to avoid email security filters that flag:
- Binary pack files as potential malware
- Git repository structures as data exfiltration attempts
- Config files with URLs as phishing indicators

**Trade-off**: You won't have Git history, but you get all the source code needed to build and use the library.

## Prerequisites

You need Node.js or Bun installed:

```bash
# Check if Node.js is installed
node --version
npm --version

# Or check for Bun
bun --version

# If not installed:
# Node.js: https://nodejs.org/
# Bun: https://bun.sh/
```

## Installation Steps

### Step 1: Extract the Archive

```bash
# Navigate to where you want to extract
cd /path/to/your/workspace

# Extract the archive
tar xzf pivot-table-source-nogit.tar.gz

# This creates a directory with all source files
cd shadcn-pivot-data-table-example
```

### Step 2: Initialize Git (Optional but Recommended)

Since Git history is not included, you may want to initialize a new Git repository:

```bash
# Inside the extracted directory
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Pivot table library v1.1.0"

# (Optional) Add remote to your organization's GitHub
git remote add origin https://github.com/YOUR_ORG/pivot-table.git

# (Optional) Create branches
git branch -M main
git checkout -b library

# (Optional) Create tags
git tag v1.1.0
```

Replace `YOUR_ORG` with your organization name.

### Step 3: Install Dependencies

```bash
# Using npm
npm install

# Or using Bun (faster)
bun install
```

This will install all required dependencies listed in `package.json`.

### Step 4: Build the Library

```bash
# Using npm
npm run build

# Or using Bun
bun run build
```

This creates the `dist/` folder with compiled JavaScript files ready for use in other projects.

### Step 5: Verify the Build

```bash
# Check that dist/ folder was created
ls -la dist/

# Should see:
# - index.js, index.cjs, index.d.ts (main entry)
# - headless.js, headless.cjs, headless.d.ts (headless entry)
# - server.js, server.cjs, server.d.ts (server entry)
# - chunk-*.js files (code-split bundles)
```

## Using the Library

### Option 1: Use as Local File Dependency

In your project's `package.json`:

```json
{
  "dependencies": {
    "pivot-table": "file:../shadcn-pivot-data-table-example"
  }
}
```

Then:
```bash
npm install
```

**⚠️ Warning**: File path dependencies create symlinks that **don't work with Next.js 16/Turbopack**. Use Git dependency instead (see Option 2).

### Option 2: Push to Organization GitHub (Recommended)

After initializing Git (Step 2), push to your organization:

```bash
# Push to your organization's GitHub
git push origin main
git push origin library
git push --tags

# Then in your projects
npm install pivot-table@git+https://github.com/YOUR_ORG/pivot-table.git#library
```

This enables clean imports:
```typescript
import { PivotTable } from 'pivot-table'
import { transformToPivot } from 'pivot-table/headless'
```

### Option 3: Link for Local Development

```bash
# Inside the library directory
npm link
# or
bun link

# In your project directory
npm link shadcn-pivot-data-table-example
# or
bun link shadcn-pivot-data-table-example
```

### Option 4: Copy Source Directly

For maximum control, copy source files directly into your project:

```bash
# Copy components
cp -r src/components/pivot-table /path/to/your-project/src/components/

# Copy library utilities
cp -r src/lib/pivot /path/to/your-project/src/lib/

# Copy UI components (if needed)
cp -r src/components/ui /path/to/your-project/src/components/
```

Then import directly:
```typescript
import { PivotTable } from '@/components/pivot-table'
import { transformToPivot } from '@/lib/pivot/transformer'
```

## Quick Start Demo

To run the demo application:

```bash
# After extraction and installation
cd shadcn-pivot-data-table-example

# Install dependencies
npm install

# Start demo server
npm run dev

# Visit http://localhost:3000/pivot
```

The demo showcases 5 financial scenarios with drag-and-drop pivot configuration.

## Running Tests

```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# E2E tests (requires Playwright)
npx playwright install  # First time only
npm run test:e2e

# E2E with UI
npm run test:e2e:ui
```

## Documentation

See these guides in the extracted directory:

- **[CORPORATE-DEPLOYMENT.md](./CORPORATE-DEPLOYMENT.md)** - Complete deployment guide
- **[SETUP-CHECKLIST.md](./SETUP-CHECKLIST.md)** - Step-by-step verification
- **[API.md](./API.md)** - Full API reference and examples
- **[LOCAL-USAGE.md](./LOCAL-USAGE.md)** - Local development patterns
- **[README.md](./README.md)** - Main documentation

## Differences from Git Bundle

| Feature | Git Bundle | Source Archive |
|---------|------------|----------------|
| **Size** | 1.5 MB | 2.1 MB |
| **Git History** | ✅ Full history | ❌ Not included |
| **Branches** | ✅ All branches | ❌ Single snapshot |
| **Tags** | ✅ All tags | ❌ None |
| **Setup Steps** | 1 command | 4 commands |
| **Email Safety** | High | Very High |
| **Recommended?** | ✅ Yes (if possible) | 🟡 Fallback option |

**Recommendation**: If you can receive the Git bundle, use that instead. It's smaller, easier to set up, and includes full Git history.

## Restoring Git History (Advanced)

If you need the full Git history later, you can fetch it:

```bash
# Add the original repository as a remote
git remote add upstream https://github.com/chrisrennewbie/shadcn-pivot-data-table-example.git

# Fetch all history
git fetch upstream

# Merge or rebase your changes
git merge upstream/main
```

Or clone the full repository separately:

```bash
# Clone from public reference
git clone https://github.com/chrisrennewbie/shadcn-pivot-data-table-example.git

# Or from your organization
git clone https://github.com/YOUR_ORG/pivot-table.git
```

## Troubleshooting

### Issue: "Cannot find module" during build

**Solution**: Ensure all dependencies are installed:

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: "Permission denied" when extracting

**Solution**: Extract to a directory where you have write permissions:

```bash
# Extract to home directory
cd ~
mkdir pivot-table-library
cd pivot-table-library
tar xzf /path/to/pivot-table-source-nogit.tar.gz
```

### Issue: Build fails with TypeScript errors

**Solution**: Ensure you're using compatible versions:

```bash
# Check versions
node --version  # Should be >= 18
npm --version   # Should be >= 9

# Update TypeScript
npm install -D typescript@latest
npm run build
```

### Issue: Import errors in Next.js project

**Solution**: For Next.js 16/Turbopack compatibility, don't use file path dependencies. Push to GitHub and use Git dependency:

```json
{
  "dependencies": {
    "pivot-table": "git+https://github.com/YOUR_ORG/pivot-table.git#library"
  }
}
```

## File Structure

After extraction, you'll see:

```
shadcn-pivot-data-table-example/
├── src/
│   ├── app/                    # Next.js demo application
│   ├── components/
│   │   ├── pivot-table/        # Library components
│   │   └── ui/                 # Shadcn UI components
│   ├── lib/pivot/              # Core pivot logic
│   │   ├── transformer.ts      # Transformation engine
│   │   ├── aggregations.ts     # Aggregation functions
│   │   └── schemas.ts          # Zod validation
│   └── __tests__/              # Test suites
├── e2e/                        # Playwright tests
├── templates/                  # Deployment templates
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript config
├── tsup.config.ts              # Build config
├── CORPORATE-DEPLOYMENT.md     # Deployment guide
├── SETUP-CHECKLIST.md          # Setup checklist
├── API.md                      # API documentation
└── README.md                   # Main docs
```

## Why No .git Directory?

Email security systems (Gmail, Outlook, Proofpoint, Mimecast) scan archive contents and block:

1. **Binary pack files** in `.git/objects/` (flagged as potential malware)
2. **Git repository structures** (flagged as data exfiltration attempts)
3. **Config files with URLs** in `.git/config` (phishing indicators)
4. **Hooks directories** even if empty (execution risk)

By excluding `.git`, this archive has a **much higher chance** of passing through corporate email filters.

## Alternative: Use Cloud Storage

If email still blocks this archive, upload it to:

- **Google Drive**: Upload → Share → Send link via email
- **OneDrive**: Upload → Share → Send link via email
- **Dropbox**: Upload → Share → Send link via email
- **SharePoint**: Company file sharing (if available)

Cloud storage links bypass email attachment filters entirely.

## Support

For questions or issues:

1. Review [CORPORATE-DEPLOYMENT.md](./CORPORATE-DEPLOYMENT.md) for deployment scenarios
2. Check [TROUBLESHOOTING](./CORPORATE-DEPLOYMENT.md#troubleshooting) section
3. Contact your IT department for assistance

---

**Version**: v1.1.0
**Archive Created**: 2025-11-19
**Format**: tar.gz (gzip compressed tar archive)
**Size**: 2.1 MB
**Git History**: Not included (use Git bundle for full history)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
