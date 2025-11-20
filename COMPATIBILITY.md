# Version Compatibility Guide

This document provides comprehensive version requirements and compatibility information for the shadcn-pivot-data-table-example library.

## Quick Reference

| Dependency | Minimum | Recommended | Tested Up To | Corporate Lag OK? |
|------------|---------|-------------|--------------|-------------------|
| **Node.js** | 18.0.0 | 20.x | 22.x | ✅ Yes (if 18+) |
| **npm** | 9.0.0 | 10.x | 10.x | ✅ Yes |
| **Bun** | 1.0.0 | 1.1.18+ | 1.3.x | ✅ Yes |
| **React** | 18.3.0 | 19.2.0 | 19.2.0 | ✅ Yes (18.3+ or 19.x) |
| **React DOM** | 18.3.0 | 19.2.0 | 19.2.0 | ✅ Yes (18.3+ or 19.x) |
| **Next.js** | 15.0.0 | 16.0.3 | 16.0.3 | ⚠️ Needs 15.0+ |
| **TypeScript** | 5.0.0 | 5.7.x | 5.7.x | ✅ Yes (5.0+) |
| **@tanstack/react-table** | 8.20.0 | 8.21.3+ | 8.21.3 | ✅ Yes |
| **@tanstack/react-virtual** | 3.10.8 | 3.13.12+ | 3.13.12 | ✅ Yes |

---

## React Version Support

### React 18.x: Fully Supported ✅

**Minimum**: React 18.3.0
**Why 18.3?**
- Stable React Server Components (RSC) support
- Better TypeScript typing for async components
- `cache()` function available via Next.js App Router

**What Works:**
- ✅ All pivot table features
- ✅ Server Components (`async` components)
- ✅ Server Actions (`'use server'`)
- ✅ Drag-and-drop functionality
- ✅ Virtual scrolling
- ✅ Export functionality (CSV/Excel/JSON)

**React 18.0-18.2 Issues:**
- ⚠️ TypeScript typing errors with async Server Components
- ⚠️ `cache()` function may not be available
- ⚠️ RSC support less stable

### React 19.x: Fully Supported ✅

**Status**: All dependencies support React 19

**What Works:**
- ✅ All React hooks used in codebase (no React 19-exclusive features required)
- ✅ Server Components and Server Actions (React 18.2+ feature via Next.js)
- ✅ All core library features
- ✅ **lucide-react v0.553.0** - Full React 19 support (peer deps: `^16.5.1 || ^17.0.0 || ^18.0.0 || ^19.0.0`)
- ✅ **@atlaskit/pragmatic-drag-and-drop v1.7.7** - Framework-agnostic (no React peer dependency)
- ✅ **All Radix UI components** - React 19 support in all versions we use

**Dependency Details:**

#### lucide-react
- **Current Version**: 0.553.0
- **React 19 Support**: Yes, since v0.500.0 (December 2024)
- **Peer Dependencies**: `react@^16.5.1 || ^17.0.0 || ^18.0.0 || ^19.0.0`
- **Note**: Issue #2951 was about `lucide-react-native` (different package we don't use)

#### @atlaskit/pragmatic-drag-and-drop
- **Current Version**: 1.7.7
- **React 19 Support**: Yes (framework-agnostic)
- **Peer Dependencies**: None (core packages are framework-agnostic JavaScript)
- **Packages Used**: `@atlaskit/pragmatic-drag-and-drop`, `@atlaskit/pragmatic-drag-and-drop-hitbox`
- **Note**: Issue #181 was about optional React-specific packages we don't use

**Recommendation**: React 19 is fully supported. Update when ready.

**Upgrade Path**:
1. Update React and React DOM to 19.x
2. Update Next.js to 16.x (requires React 19.0.0+)
3. All dependencies will work without `--legacy-peer-deps`

---

## Next.js Version Support

### Minimum: Next.js 15.0.0 ⚠️

**Critical**: This library requires Next.js 15+ due to the **async `searchParams` API**

```typescript
// This pattern only works in Next.js 15+
export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams  // ← Async in Next.js 15+
}
```

### Next.js Version Compatibility

| Version | Supported | React Requirement | Notes |
|---------|-----------|-------------------|-------|
| 13.x | ❌ No | 18.2+ | Synchronous `searchParams` - **incompatible** |
| 14.x | ❌ No | 18.2+ | Synchronous `searchParams` - **incompatible** |
| 15.x | ✅ Yes | 18.0+ | Async `searchParams` - **required** |
| 16.x | ✅ Yes | **19.0+** | React 19 minimum (Turbopack default) |

### Next.js 15 vs 16

**Next.js 15 (Minimum):**
- ✅ Works with React 18.3+
- ✅ Async `searchParams` support
- ✅ Server Actions stable
- ⚠️ No Turbopack by default (use `--turbo` flag)

**Next.js 16 (Recommended):**
- ✅ Turbopack enabled by default
- ✅ Better performance
- ✅ **Requires React 19.0+**
- ✅ All dependencies support React 19 (see React 19 section)

### Turbopack

**Status**: Optional

- Next.js 15: Enable with `next dev --turbo`
- Next.js 16: Enabled by default (opt-out with `--webpack`)
- No Turbopack-specific code in this library

---

## TypeScript Version

### Minimum: 5.0.0

**Required for:**
- Zod v4 (tested with TypeScript 5.5+)
- Async Server Components typing
- Better type inference with React Server Components

**Compatibility:**
- TypeScript 4.5.5+: May work with most dependencies
- TypeScript 5.0+: **Recommended minimum**
- TypeScript 5.5+: Best support for all features

---

## TanStack Dependencies

### @tanstack/react-table

**Minimum**: 8.20.0
**Recommended**: 8.21.3+
**React Requirement**: 16.8+ (works with React 16, 17, 18, 19)

**Corporate Registry Notes:**
- ✅ Version 8.20.0 is stable and widely available
- ✅ Patch and minor updates are safe (8.20.x → 8.21.x)
- ✅ Compatible with all supported React versions

### @tanstack/react-virtual

**Minimum**: 3.10.8 (⚠️ **NOT** 3.10.0)
**Recommended**: 3.13.12+
**React Requirement**: 16.8+ (works with React 16, 17, 18, 19)

**CRITICAL NOTE**: Version 3.10.0 was **never successfully published** to npm due to a build failure. Always use 3.10.8 or higher.

---

## Radix UI Components

All Radix UI packages have consistent requirements:

**React Requirement**: 16.8+ (works with React 16, 17, 18, 19)
**React 19 Status**: All minimum versions support React 19

| Package | Minimum Version | Latest Tested |
|---------|----------------|---------------|
| @radix-ui/react-checkbox | 1.3.0 | 1.3.3 |
| @radix-ui/react-dialog | 1.1.0 | 1.1.15 |
| @radix-ui/react-dropdown-menu | 2.1.0 | 2.1.16 |
| @radix-ui/react-label | 2.1.0 | 2.1.8 |
| @radix-ui/react-radio-group | 1.3.0 | 1.3.8 |
| @radix-ui/react-scroll-area | 1.2.0 | 1.2.10 |
| @radix-ui/react-select | 2.2.0 | 2.2.6 |
| @radix-ui/react-separator | 1.1.0 | 1.1.8 |
| @radix-ui/react-slot | 1.2.0 | 1.2.4 |

✅ All minimum versions are compatible with React 18 and 19

---

## Corporate Registry Version Lag

### Typical Lag: 1-3 Months

Corporate npm registries typically lag behind public npm by 1-3 months due to security scanning and approval processes.

### Version Lag Tolerance

**This library is designed to handle version lag:**

| Scenario | Registry Has | Package Requires | Works? |
|----------|--------------|------------------|--------|
| React | 18.3.0 | >=18.3.0 | ✅ Yes |
| React | 18.2.0 | >=18.3.0 | ⚠️ May have RSC issues |
| Next.js | 15.0.0 | >=15.0.0 | ✅ Yes |
| Next.js | 14.2.0 | >=15.0.0 | ❌ No (async searchParams) |
| TanStack Table | 8.20.0 | ^8.20.0 | ✅ Yes |
| TanStack Table | 8.19.0 | ^8.20.0 | ❌ No |

### If Your Registry Lacks Minimum Versions

**Option 1**: Request package addition
- Contact your registry administrators
- Provide this compatibility guide
- Request specific minimum versions

**Option 2**: Use overrides (temporary workaround)
```json
{
  "overrides": {
    "@tanstack/react-table": "8.19.0"  // ⚠️ May cause runtime issues
  }
}
```

**Option 3**: Wait for registry updates
- Most corporate registries update monthly
- Critical security updates often expedited

---

## Browser Compatibility

### Modern Browsers Required

- **Chrome/Edge**: Last 2 versions (111+)
- **Firefox**: Last 2 versions (128+)
- **Safari**: Last 2 versions (16.4+)
- **Mobile Safari**: iOS 15+
- **Mobile Chrome**: Android 10+

### Why These Requirements?

- ES2020+ JavaScript features
- CSS Grid and Flexbox
- Modern DOM APIs
- React 18/19 requires modern browsers

---

## Package Manager Compatibility

### Bun (Recommended)

**Minimum**: 1.0.0
**Recommended**: 1.1.18+ (for corporate .npmrc support)
**Latest**: 1.3.x

**Best For**:
- Speed (6-17x faster than npm)
- Corporate deployments with existing .npmrc configurations
- Better peer dependency handling than npm (React 19 compatibility)

**Version-Specific Features**:

#### Bun 1.0.0 (September 2023)
- ✅ First stable release
- ✅ bunfig.toml support for registry configuration
- ❌ No .npmrc support (use bunfig.toml only)

#### Bun 1.1.18+ (July 2024) - **Recommended for Corporate**
- ✅ Added .npmrc support
- ✅ Read existing npm registry configurations
- ✅ Works with corporate registries without migration
- ✅ Both bunfig.toml and .npmrc work together

#### Bun 1.3.1+ (Recent)
- ✅ Improved .npmrc `:email` field support
- ✅ Better authentication with scoped registries
- ✅ Enhanced corporate registry compatibility

**Configuration**: See [bunfig.toml](./bunfig.toml) for registry setup

**Corporate Deployment Note**: If your organization uses .npmrc for registry authentication, use Bun 1.1.18+ to avoid configuration migration.

### npm

**Version**: 9.0.0+
**React 19 Issue**: Requires `--legacy-peer-deps` flag
**Registry Config**: Use `.npmrc` file

### pnpm

**Version**: 8.0.0+
**Best For**: Disk space efficiency
**React 19**: Good peer dependency handling

### yarn

**Version**: 3.0.0+
**Best For**: Teams already using Yarn
**React 19**: Good peer dependency handling

---

## Upgrade Guides

### Upgrading from React 18 to 19

**When**: Wait for dependency support (Q1-Q2 2025)

**Steps**:
1. Check dependency support:
   - lucide-react: Monitor [Issue #2951](https://github.com/lucide-icons/lucide/issues/2951)
   - @atlaskit: Monitor [Issue #181](https://github.com/atlassian/pragmatic-drag-and-drop/issues/181)

2. Update React:
   ```bash
   npm install react@19 react-dom@19 @types/react@19 @types/react-dom@19
   ```

3. Update Next.js (required):
   ```bash
   npm install next@latest  # Minimum Next.js 16
   ```

4. Test your application:
   ```bash
   npm run build
   npm run test
   npm run test:e2e
   ```

5. No library changes required (this library is React 19 compatible)

### Upgrading Next.js 15 → 16

**Requirements**:
- React 19.0.0+ (Next.js 16 minimum)
- Node.js 20.9.0+

**Steps**:
```bash
# Update all together
npm install next@latest react@latest react-dom@latest

# Or specific versions
npm install next@16 react@19 react-dom@19
```

**Breaking Changes**:
- React 19 is now required
- Node.js 18 no longer supported (20.9+ minimum)
- Turbopack enabled by default (opt-out with `--webpack`)

---

## Troubleshooting

### "Peer dependency conflict for react"

**Symptom**: npm warns about React version mismatch

**Check your version**:
```bash
npm ls react
```

**Solution**:
- Upgrade to React 18.3+ or 19+
- Check all dependencies support your React version

### "No matching version found for @tanstack/react-virtual@^3.10.0"

**Cause**: Version 3.10.0 doesn't exist (build failure)

**Solution**: Update package.json:
```json
{
  "peerDependencies": {
    "@tanstack/react-virtual": "^3.10.8"  // or higher
  }
}
```

### "Type error: Promise<Element> is not assignable to Element"

**Cause**: TypeScript version too old or React version < 18.3

**Solution**:
1. Update TypeScript: `npm install -D typescript@5`
2. Update React: `npm install react@18.3 react-dom@18.3`
3. Update @types: `npm install -D @types/react@18 @types/react-dom@18`

### "searchParams is not a Promise"

**Cause**: Next.js version < 15.0.0

**Solution**: This library requires Next.js 15+
```bash
npm install next@15  # minimum
# or
npm install next@16  # recommended
```

---

## Version Support Policy

### Active Support

**React**: 18.3.x and 19.x
**Next.js**: 15.x and 16.x
**Node.js**: 18.x LTS, 20.x LTS, 22.x Current
**Bun**: 1.0.x, 1.1.x, 1.2.x, 1.3.x

### End of Life

**React 18.0-18.2**: Not recommended (RSC instability)
**Next.js 13-14**: Not compatible (synchronous searchParams)
**Node.js <18**: Not supported

### Future Compatibility

We aim to maintain compatibility with:
- Latest 2 major React versions
- Latest 2 major Next.js versions
- Active LTS Node.js versions

---

## Summary

**Minimum Supported Configuration**:
```json
{
  "node": "18.0.0",
  "npm": "9.0.0",
  "bun": "1.0.0",
  "react": "18.3.0",
  "next": "15.0.0",
  "typescript": "5.0.0"
}
```

**Recommended Configuration**:
```json
{
  "node": "20.x",
  "npm": "10.x",
  "bun": "1.1.18+",  // For corporate .npmrc support
  "react": "19.2.0",  // Both 18.3+ and 19.x supported
  "next": "16.x",  // Requires React 19+
  "typescript": "5.7.x"
}
```

**Tested Configuration (devDependencies)**:
```json
{
  "node": "22.x",
  "react": "19.2.0",
  "next": "16.0.3",
  "typescript": "5.x"
}
```

---

For deployment guidance, see [DEPLOYMENT.md](./DEPLOYMENT.md)

For installation help, see [SETUP-CHECKLIST.md](./SETUP-CHECKLIST.md)

For API documentation, see [API.md](./API.md)
