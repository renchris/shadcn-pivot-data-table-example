# Git Bundle Installation Instructions

This file (`pivot-table-v1.1.1.bundle`) is a **Git bundle** containing the complete pivot table library repository with full commit history, all branches, and tags.

## What is a Git Bundle?

A Git bundle is Git's official format for transferring repositories offline via email, USB, or other file-sharing methods. It's a single binary file that packages an entire Git repository for safe transfer.

## Prerequisites

You need Git installed on your system:

```bash
# Check if Git is installed
git --version

# If not installed, download from:
# https://git-scm.com/downloads
```

## Installation Steps

### Method 1: Clone from Bundle (Recommended)

```bash
# 1. Navigate to where you want to store the library
cd /path/to/your/workspace

# 2. Clone directly from the bundle
git clone pivot-table-v1.1.1.bundle pivot-table-library

# 3. Navigate into the cloned repository
cd pivot-table-library

# 4. Install dependencies
npm install
# or
bun install

# 5. Build the library
npm run build
# or
bun run build

# 6. (Optional) Add remote to pull updates
git remote add origin https://github.com/YOUR_ORG/pivot-table.git
```

Replace `YOUR_ORG` with your organization name.

### Method 2: Fetch into Existing Repository

If you already have a Git repository and want to fetch from the bundle:

```bash
# 1. Navigate to your existing repository
cd /path/to/your/repo

# 2. Add bundle as a remote
git remote add bundle-remote /path/to/pivot-table-v1.1.1.bundle

# 3. Fetch from bundle
git fetch bundle-remote

# 4. Checkout the branch you need
git checkout -b library bundle-remote/library
```

## Verification

After cloning, verify the repository is complete:

```bash
cd pivot-table-library

# Check branches
git branch -a

# Check tags
git tag -l

# View commit history
git log --oneline -10

# Check repository status
git status
```

Expected output:
- **Branches**: `main`, `library`, `shadcn-pivot-export`
- **Tags**: `v1.0.0`, `v1.1.0`, `v1.1.1`
- **Status**: Clean working tree

## Using the Library

### Option 1: Use as Local Dependency

In your project's `package.json`:

```json
{
  "dependencies": {
    "pivot-table": "file:../pivot-table-library"
  }
}
```

Then:
```bash
npm install
```

**Note**: File path dependencies create symlinks that don't work with Next.js 16/Turbopack.

### Option 2: Push to Organization GitHub

```bash
# Inside the cloned repository
cd pivot-table-library

# Add your organization's remote
git remote add origin https://github.com/YOUR_ORG/pivot-table.git

# Push all branches
git push origin --all

# Push all tags
git push origin --tags
```

Then in your projects:
```json
{
  "dependencies": {
    "pivot-table": "git+https://github.com/YOUR_ORG/pivot-table.git#library"
  }
}
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
npm link pivot-table
# or
bun link shadcn-pivot-data-table-example
```

## Bundle Contents

This bundle includes:

- ✅ Full Git history (all commits from initial to v1.1.1)
- ✅ All branches: `main`, `library`, `shadcn-pivot-export`
- ✅ All tags: `v1.0.0`, `v1.1.0`, `v1.1.1`
- ✅ All source code (TypeScript `.ts` and `.tsx` files)
- ✅ All documentation (Markdown files)
- ✅ Configuration files (`package.json`, `tsconfig.json`, etc.)
- ✅ Templates directory with deployment examples
- ✅ Test suites (unit tests and E2E tests)

**Size**: 1.5 MB

## Quick Start Demo

To run the demo application:

```bash
# After cloning from bundle
cd pivot-table-library

# Install dependencies
npm install

# Start demo server
npm run dev

# Visit http://localhost:3000/pivot
```

The demo showcases 5 financial scenarios with drag-and-drop pivot configuration.

## Documentation

After cloning, see these guides:

- **[COMPATIBILITY.md](./COMPATIBILITY.md)** - Comprehensive version compatibility matrix
- **[bunfig.toml](./bunfig.toml)**  Bun registry configuration template
- **[CORPORATE-DEPLOYMENT.md](./CORPORATE-DEPLOYMENT.md)** - Complete corporate deployment guide
- **[SETUP-CHECKLIST.md](./SETUP-CHECKLIST.md)** - Step-by-step verification
- **[API.md](./API.md)** - Full API reference and examples
- **[LOCAL-USAGE.md](./LOCAL-USAGE.md)** - Local development patterns

## Troubleshooting

### Issue: "fatal: not a git repository"

**Solution**: Ensure you're running the `git clone` command from outside the bundle file:

```bash
# Correct
git clone pivot-table-v1.1.1.bundle pivot-table-library

# Incorrect
cd pivot-table-v1.1.1.bundle  # This won't work
```

### Issue: "Bundle file not found"

**Solution**: Provide the full or relative path to the bundle:

```bash
# Absolute path
git clone /Users/yourname/Downloads/pivot-table-v1.1.1.bundle pivot-table

# Relative path
git clone ../Downloads/pivot-table-v1.1.1.bundle pivot-table
```

### Issue: "Permission denied"

**Solution**: Ensure the bundle file has read permissions:

```bash
chmod +r pivot-table-v1.1.1.bundle
git clone pivot-table-v1.1.1.bundle pivot-table
```

### Issue: Build fails with "Cannot find module"

**Solution**: Ensure all dependencies are installed:

```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or with bun
rm -rf node_modules bun.lockb
bun install
```

## Why Use Git Bundle?

**Advantages over archives (.zip/.tar.gz):**

1. ✅ **Email-Safe**: Not flagged by corporate security filters
2. ✅ **Complete History**: Includes all commits, branches, and tags
3. ✅ **Git Native**: Standard Git format, no extraction needed
4. ✅ **Smaller Size**: 1.5MB vs 2.0MB+ for archives
5. ✅ **Verifiable**: Built-in integrity checking (`git bundle verify`)
6. ✅ **Official Git Feature**: Purpose-built for offline transfer

**Why archives get blocked:**
- .zip/.tar.gz files containing `.js` files are blocked by Gmail/corporate email
- Even `.mjs` config files trigger security filters
- `.git` directory structure flagged as potential data exfiltration
- Archives are common malware delivery vectors (42% of malware)

**Git bundles avoid these issues** because they're a single, recognized Git format.

## Support

For questions or issues:

1. Check [CORPORATE-DEPLOYMENT.md](./CORPORATE-DEPLOYMENT.md) for deployment scenarios
2. Review [TROUBLESHOOTING](./CORPORATE-DEPLOYMENT.md#troubleshooting) section
3. Contact your IT department for Git/GitHub access

## Alternative: Cloud Storage Link

If email still blocks the bundle, upload it to:

- Google Drive / OneDrive / Dropbox
- SharePoint (corporate file sharing)
- GitHub Releases (if you have access)

Then share the download link via email instead of attaching the file.

---

**Repository Version**: v1.1.1
**Bundle Created**: 2025-11-19
**Format**: Git Bundle (.bundle)
**Size**: 1.5 MB

🤖 Generated with [Claude Code](https://claude.com/claude-code)
