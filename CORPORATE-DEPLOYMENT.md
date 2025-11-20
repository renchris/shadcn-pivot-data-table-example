# Corporate Deployment Guide

> **Quick Start**: This library is designed to be portable across organizations. Choose the deployment method that best fits your infrastructure.

## Table of Contents

- [Deployment Methods Comparison](#deployment-methods-comparison)
- [Method 1: GitHub Organization (Recommended)](#method-1-github-organization-recommended)
- [Method 2: File Path Dependencies](#method-2-file-path-dependencies)
- [Method 3: Private npm Registry](#method-3-private-npm-registry)
- [Troubleshooting](#troubleshooting)
- [Security Considerations](#security-considerations)

---

## Deployment Methods Comparison

| Method | Best For | Setup Time | Next.js 16/Turbopack | Maintenance |
|--------|----------|------------|----------------------|-------------|
| **GitHub Organization** | Most teams | 10 min | ✅ Works perfectly | Low |
| **File Path** | .zip transfers | 5 min | ⚠️ Symlink issues | Low |
| **Private Registry** | Enterprise (100+ devs) | 1 hour | ✅ Works perfectly | Medium |

**Recommendation**: Use **Method 1 (GitHub Organization)** for Next.js 16/Turbopack projects.

---

## Method 1: GitHub Organization (Recommended)

### Overview

Fork or upload this library to your organization's GitHub/GitLab, then use Git dependencies for clean imports.

**Why this works:**
- ✅ Works flawlessly with Next.js 16/Turbopack (no symlink issues)
- ✅ Version control integration
- ✅ Clean import syntax: `import { PivotTable } from 'pivot-table'`
- ✅ Easy updates via git pull/fetch

### Step 1: Upload to Your Organization

#### Option A: If you received a .zip file

```bash
# Extract the library
unzip pivot-table.zip -d /tmp/pivot-table

# Navigate to extracted directory
cd /tmp/pivot-table

# Initialize git (if not already a git repo)
git init
git add .
git commit -m "Initial import of pivot table library v1.0.0"

# Create repository in your GitHub organization via UI
# Then push to your organization
git remote add origin git@github.com:YOUR_ORG/pivot-table.git
git push -u origin main

# Create library branch (recommended for consumption)
git checkout -b library
git push -u origin library
```

#### Option B: If you can fork from GitHub

1. Navigate to https://github.com/renchris/shadcn-pivot-data-table-example
2. Click "Fork" → Select your organization
3. Clone your fork locally

### Step 2: Build the Library

```bash
# Install dependencies
npm install
# or
bun install

# Build the library
npm run build
# or
bun run build

# Verify build output
ls -la dist/
# Should see: index.js, index.cjs, headless.js, server.js, etc.
```

### Step 3: Commit Build Artifacts (Optional)

If your organization prefers committed builds:

```bash
git add dist/
git commit -m "Add built library files"
git push
```

### Step 4: Install in Consumer Projects

In your application's `package.json`:

```json
{
  "dependencies": {
    "pivot-table": "git+https://github.com/YOUR_ORG/pivot-table.git#library",
    "@tanstack/react-table": "^8.20.0",
    "@tanstack/react-virtual": "^3.10.8",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "next": "^15.0.0"
  }
}
```

**Note**: These are **minimum required versions**. React 19 is fully supported by all dependencies. See [COMPATIBILITY.md](./COMPATIBILITY.md) for version details.

**Replace `YOUR_ORG`** with your actual GitHub organization name (e.g., `acme-corp`).

### Step 5: Install and Use

```bash
npm install
```

```typescript
// Clean imports work immediately
import { ClientPivotWrapper } from 'pivot-table'
import { transformToPivot } from 'pivot-table/headless'
import { exportPivotData } from 'pivot-table/server'
```

### Version Pinning

Pin to specific versions for stability:

```json
{
  "dependencies": {
    "pivot-table": "git+https://github.com/YOUR_ORG/pivot-table.git#v1.0.0"
  }
}
```

Or use commit SHAs:

```json
{
  "dependencies": {
    "pivot-table": "git+https://github.com/YOUR_ORG/pivot-table.git#a204e45"
  }
}
```

---

## Method 2: File Path Dependencies

### Overview

Use local file paths for development. **Note**: This has limitations with Next.js 16/Turbopack due to symlink resolution issues.

**Use this method when:**
- You need immediate local changes during development
- You're not using Next.js 16/Turbopack
- You need offline development capability

**Limitations:**
- ⚠️ Does not work with Next.js 16/Turbopack (symlink resolver bug)
- ⚠️ Requires relative or absolute paths in package.json
- ⚠️ Each consumer project needs correct path configuration

### Setup

#### Option A: Shared Library Location

```bash
# Extract library to shared location
mkdir -p /shared/libraries
unzip pivot-table.zip -d /shared/libraries/pivot-table

# Build the library
cd /shared/libraries/pivot-table
npm install && npm run build
```

In consumer `package.json`:

```json
{
  "dependencies": {
    "pivot-table": "file:/shared/libraries/pivot-table"
  }
}
```

#### Option B: Per-Project Copy

```bash
# In your project root
mkdir -p lib
unzip pivot-table.zip -d lib/pivot-table

# Build the library
cd lib/pivot-table
npm install && npm run build
cd ../..
```

In consumer `package.json`:

```json
{
  "dependencies": {
    "pivot-table": "file:./lib/pivot-table"
  }
}
```

### Workaround for Next.js 16/Turbopack

If you must use file paths with Next.js 16, add this to `next.config.ts`:

```typescript
import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '..')
  }
}

export default nextConfig
```

**Note**: This requires the library to be in a parent directory of your project, which may not always be feasible.

---

## Method 3: Private npm Registry

### Overview

Publish to your organization's private npm registry (Artifactory, Nexus, Verdaccio, GitHub Packages).

**Best for:**
- Large organizations (100+ developers)
- Teams with existing private registry infrastructure
- Projects requiring semantic versioning and npm tooling

### Prerequisites

- Access to private npm registry
- Registry credentials configured locally
- npm publish permissions

### Step 1: Configure Package for Your Registry

Update `package.json`:

```json
{
  "name": "@your-org/pivot-table",
  "version": "1.0.0",
  "private": false,
  "publishConfig": {
    "registry": "https://npm.your-company.com"
  }
}
```

### Step 2: Build and Publish

```bash
# Install and build
npm install
npm run build

# Login to your registry
npm login --registry=https://npm.your-company.com

# Publish
npm publish
```

### Step 3: Install in Consumer Projects

Configure registry in `.npmrc`:

```ini
@your-org:registry=https://npm.your-company.com
//npm.your-company.com/:_authToken=${NPM_TOKEN}
```

Install normally:

```json
{
  "dependencies": {
    "@your-org/pivot-table": "^1.0.0"
  }
}
```

```bash
npm install
```

### CI/CD Integration

For GitHub Actions:

```yaml
steps:
  - name: Install dependencies
    env:
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
    run: npm install
```

---

## Troubleshooting

### Issue: Module not found errors with Next.js 16/Turbopack

**Symptoms:**
```
Module not found: Can't resolve 'pivot-table'
```

**Cause**: Using `file:` dependencies creates symlinks that Turbopack cannot resolve.

**Solution**: Use Method 1 (Git dependencies) instead:

```json
{
  "dependencies": {
    "pivot-table": "git+https://github.com/YOUR_ORG/pivot-table.git#library"
  }
}
```

### Issue: Type definitions not found

**Symptoms:**
```
Could not find a declaration file for module 'pivot-table'
```

**Solution**: Ensure the library was built before installation:

```bash
cd /path/to/pivot-table
npm run build
ls dist/*.d.ts  # Should show type definition files
```

### Issue: Peer dependency warnings

**Symptoms:**
```
npm WARN pivot-table@1.0.0 requires a peer of react@>=18.3.0 but none is installed
```

**Solution**: Install all peer dependencies listed in the library's `package.json`:

```bash
npm install react@^18.3.0 react-dom@^18.3.0 @tanstack/react-table@^8.20.0 @tanstack/react-virtual@^3.10.8
```

See [COMPATIBILITY.md](./COMPATIBILITY.md) for detailed version requirements.

### Issue: Git authentication failures

**Symptoms:**
```
fatal: could not read Username for 'https://github.com'
```

**Solution**: Use SSH instead of HTTPS:

```json
{
  "dependencies": {
    "pivot-table": "git+ssh://git@github.com/YOUR_ORG/pivot-table.git#library"
  }
}
```

Configure SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

---

## Security Considerations

### Dependency Scanning

Run security audits regularly:

```bash
npm audit
# or
bun audit
```

### License Compliance

This library is MIT licensed. See [LICENSE](./LICENSE) for details.

### Private Repository Access

**For GitHub Organization repositories:**

```bash
# Local development: Use SSH keys
git config --global url."git@github.com:".insteadOf "https://github.com/"

# CI/CD: Use GitHub tokens
npm install pivot-table@git+https://${GITHUB_TOKEN}@github.com/YOUR_ORG/pivot-table.git#library
```

**For GitLab:**

```bash
# Use deploy tokens or personal access tokens
npm install pivot-table@git+https://gitlab-ci-token:${CI_JOB_TOKEN}@gitlab.com/YOUR_ORG/pivot-table.git#library
```

### Code Integrity

Verify git commit signatures:

```bash
cd /path/to/pivot-table
git log --show-signature
```

---

## Next Steps

1. Choose your deployment method based on the comparison table
2. Follow the corresponding setup guide
3. See [SETUP-CHECKLIST.md](./SETUP-CHECKLIST.md) for verification steps
4. Review [README.md](./README.md) for usage examples
5. Check [LOCAL-USAGE.md](./LOCAL-USAGE.md) for development patterns

## Support

- **Issues**: Document issues in your organization's internal ticketing system
- **Documentation**: [README.md](./README.md), [API.md](./API.md), [LOCAL-USAGE.md](./LOCAL-USAGE.md)
- **License**: [MIT License](./LICENSE)

---

**Quick Reference:**

```bash
# Method 1: Git dependency (recommended for Next.js 16)
"pivot-table": "git+https://github.com/YOUR_ORG/pivot-table.git#library"

# Method 2: File path (development only)
"pivot-table": "file:./lib/pivot-table"

# Method 3: Private registry (enterprise)
"@your-org/pivot-table": "^1.0.0"
```
