# Configuration Templates

This directory contains ready-to-use configuration templates for different corporate deployment scenarios.

## Available Templates

### 1. `package.json.corporate-git`

**Use case**: Git dependency installation (recommended for Next.js 16/Turbopack)

**Setup**:
1. Copy to your project's `package.json`
2. Replace `YOUR_ORG` with your GitHub organization name
3. Run `npm install` or `bun install`

**Example**:
```json
{
  "dependencies": {
    "pivot-table": "git+https://github.com/acme-corp/pivot-table.git#library"
  }
}
```

**Clean imports**:
```typescript
import { PivotTable } from 'pivot-table'
import { transformToPivot } from 'pivot-table/headless'
```

---

### 2. `package.json.file-path`

**Use case**: Local file path dependency (development only)

**Setup**:
1. Extract library to `./lib/pivot-table`
2. Build library: `cd lib/pivot-table && npm run build`
3. Copy to your project's `package.json`
4. Run `npm install`

**Note**: ⚠️ Does not work with Next.js 16/Turbopack due to symlink issues. Use Git dependency instead.

---

### 3. `package.json.private-registry`

**Use case**: Corporate npm registry (Artifactory, Nexus, Verdaccio, GitHub Packages)

**Setup**:
1. Publish library to your private registry with scoped name (e.g., `@acme-corp/pivot-table`)
2. Copy to your project's `package.json`
3. Replace `@your-org` with your organization's scope
4. Configure `.npmrc` (see below)
5. Run `npm install`

**Example**:
```json
{
  "dependencies": {
    "@acme-corp/pivot-table": "^1.0.0"
  }
}
```

---

### 4. `.npmrc.corporate`

**Use case**: Private npm registry authentication

**Setup**:
1. Copy to your project root as `.npmrc`
2. Replace `your-company.com` with your registry URL
3. Replace `@your-org` with your organization scope
4. Set `NPM_TOKEN` environment variable with your registry token

**Example**:
```ini
@acme-corp:registry=https://npm.acme.com
//npm.acme.com/:_authToken=${NPM_TOKEN}
```

**CI/CD**:
```yaml
# GitHub Actions example
env:
  NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## Quick Reference

| Template | Method | Next.js 16 Compatible | Setup Time |
|----------|--------|----------------------|------------|
| `corporate-git` | Git dependency | ✅ Yes | 10 min |
| `file-path` | Local file | ⚠️ No (symlinks) | 5 min |
| `private-registry` | npm registry | ✅ Yes | 1 hour |
| `.npmrc.corporate` | Registry auth | ✅ Yes | 5 min |

## Deployment Guide

For complete deployment instructions, see:
- **[DEPLOYMENT.md](../DEPLOYMENT.md)** - Full deployment guide
- **[SETUP-CHECKLIST.md](../SETUP-CHECKLIST.md)** - Quick setup verification
- **[LOCAL-USAGE.md](../LOCAL-USAGE.md)** - Local development patterns

## Support

Questions? Refer to the [Troubleshooting section](../DEPLOYMENT.md#troubleshooting) in DEPLOYMENT.md.
