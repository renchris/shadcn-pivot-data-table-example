# Corporate Deployment Setup Checklist

Use this checklist to verify successful deployment of the Pivot Table library in your corporate environment.

## Pre-Deployment

- [ ] **Received library files** (.zip or git clone)
- [ ] **Chosen deployment method** (Git dependency recommended for Next.js 16)
- [ ] **Have access** to your GitHub organization or private registry
- [ ] **Reviewed** [CORPORATE-DEPLOYMENT.md](./CORPORATE-DEPLOYMENT.md)

---

## Method 1: GitHub Organization Deployment (Recommended)

### Step 1: Upload to Your Organization

- [ ] Created repository in your GitHub organization (e.g., `YOUR_ORG/pivot-table`)
- [ ] Uploaded library code to repository
- [ ] Pushed both `main` and `library` branches to remote
- [ ] Verified repository is accessible to your team

### Step 2: Build the Library

```bash
cd pivot-table
npm install
npm run build
```

- [ ] Dependencies installed successfully
- [ ] Build completed without errors
- [ ] `dist/` directory contains built files:
  - [ ] `index.js` and `index.cjs`
  - [ ] `headless.js` and `headless.cjs`
  - [ ] `server.js` and `server.cjs`
  - [ ] `*.d.ts` type definition files

### Step 3: Document Your Repository URL

**Your organization's repository URL**:
```
git+https://github.com/YOUR_ORG/pivot-table.git#library
```

- [ ] Documented URL for team reference
- [ ] Shared with development team
- [ ] Added to internal documentation

### Step 4: Test Installation in Sample Project

Create a test project:

```bash
mkdir pivot-table-test && cd pivot-table-test
npm init -y
```

Add to `package.json`:
```json
{
  "dependencies": {
    "pivot-table": "git+https://github.com/YOUR_ORG/pivot-table.git#library"
  }
}
```

- [ ] Updated `package.json` with your org's URL
- [ ] Ran `npm install` successfully
- [ ] Library installed in `node_modules/pivot-table`
- [ ] `node_modules/pivot-table/dist/` contains built files

### Step 5: Verify Imports

Create `test.js`:
```javascript
// Test all entry points
import { PivotTable } from 'pivot-table'
import { transformToPivot } from 'pivot-table/headless'
import { exportPivotData } from 'pivot-table/server'

console.log('✓ All imports successful!')
```

- [ ] Main entry point imports work
- [ ] Headless entry point imports work
- [ ] Server entry point imports work
- [ ] TypeScript definitions load correctly
- [ ] No module resolution errors

---

## Method 2: File Path Deployment

### Step 1: Extract Library

- [ ] Extracted .zip to project directory (`./lib/pivot-table`)
- [ ] Navigated to library directory
- [ ] Library files present and intact

### Step 2: Build

```bash
cd lib/pivot-table
npm install
npm run build
```

- [ ] Dependencies installed
- [ ] Build completed successfully
- [ ] `dist/` directory populated

### Step 3: Configure package.json

```json
{
  "dependencies": {
    "pivot-table": "file:./lib/pivot-table"
  }
}
```

- [ ] Added file path dependency
- [ ] Ran `npm install`
- [ ] Symlink created in `node_modules/`

### Step 4: Verify (Non-Turbopack Projects Only)

- [ ] Imports work in development
- [ ] ⚠️ **Known limitation**: Does not work with Next.js 16/Turbopack
- [ ] Consider switching to Git dependency method for Next.js 16

---

## Method 3: Private npm Registry

### Step 1: Publish Library

- [ ] Updated `package.json` with scoped name (`@your-org/pivot-table`)
- [ ] Built library (`npm run build`)
- [ ] Published to private registry (`npm publish`)
- [ ] Verified package appears in registry

### Step 2: Configure Registry Access

- [ ] Created `.npmrc` with registry configuration
- [ ] Set `NPM_TOKEN` environment variable
- [ ] Tested authentication (`npm whoami --registry=...`)

### Step 3: Install in Consumer Project

```bash
npm install @your-org/pivot-table
```

- [ ] Package installed successfully
- [ ] All peer dependencies installed
- [ ] Imports work correctly

---

## Post-Deployment Verification

### Test All Features

- [ ] **Styled component works**:
  ```typescript
  import { PivotTable } from 'pivot-table'
  ```

- [ ] **Headless variant works**:
  ```typescript
  import { transformToPivot } from 'pivot-table/headless'
  ```

- [ ] **Server functions work** (Next.js):
  ```typescript
  import { exportPivotData } from 'pivot-table/server'
  ```

- [ ] **TypeScript types available**:
  - Autocomplete works in IDE
  - No type errors in consuming project

- [ ] **Peer dependencies installed**:
  - `@tanstack/react-table`
  - `@tanstack/react-virtual`
  - All Radix UI components
  - See `package.json` for full list

### Performance Check

- [ ] Demo app runs successfully
- [ ] Pivot transformation completes quickly
- [ ] No console errors or warnings
- [ ] Export functionality works (CSV, Excel, JSON)

### Team Onboarding

- [ ] Shared deployment method with team
- [ ] Documented organization-specific URLs/paths
- [ ] Added to team's development guide
- [ ] Tested by at least one other developer

---

## Troubleshooting

If you encounter issues, check:

1. **Module not found errors**:
   - [ ] Library was built before installation
   - [ ] Using Git dependency for Next.js 16 (not file path)
   - [ ] Repository URL is correct

2. **Type definition errors**:
   - [ ] TypeScript version is 5.0 or higher
   - [ ] `dist/*.d.ts` files exist
   - [ ] `node_modules/pivot-table` contains type files

3. **Peer dependency warnings**:
   - [ ] Install all peer dependencies listed in library's `package.json`
   - [ ] Versions match compatibility requirements

4. **Authentication errors** (Git/Registry):
   - [ ] SSH keys configured (for Git SSH)
   - [ ] GITHUB_TOKEN set (for Git HTTPS)
   - [ ] NPM_TOKEN set (for private registry)

See [CORPORATE-DEPLOYMENT.md - Troubleshooting](./CORPORATE-DEPLOYMENT.md#troubleshooting) for detailed solutions.

---

## Success Criteria

Your deployment is successful when:

✅ Library installed in consumer project
✅ All import statements work
✅ TypeScript types available
✅ No console errors
✅ Demo/test page renders correctly
✅ Team can reproduce installation

---

## Your Configuration

**Document your specific setup for future reference:**

**Deployment Method**: ________________ (Git / File Path / Registry)

**Repository/Registry URL**:
```
_________________________________________________________________
```

**Package Name**:
```
_________________________________________________________________
```

**Import Syntax**:
```typescript
import { PivotTable } from '_______________'
```

**Installation Date**: _____________

**Verified By**: _____________

**Notes**:
```
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
```

---

## Next Steps

After successful deployment:

1. Review [API.md](./API.md) for complete API reference
2. Explore demo scenarios at `/pivot` route
3. Customize components for your use case
4. Set up CI/CD integration (see CORPORATE-DEPLOYMENT.md)
5. Plan for version updates and maintenance

## Support

- **Documentation**: [README.md](./README.md), [CORPORATE-DEPLOYMENT.md](./CORPORATE-DEPLOYMENT.md)
- **Configuration Templates**: [templates/](./templates/)
- **Issues**: Contact your internal development team or refer to the public repository
