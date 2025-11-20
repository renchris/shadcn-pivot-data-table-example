# Ultra-Clean Archive - Email-Safe Distribution

This archive has been specially prepared for **email distribution** to corporate environments. It excludes certain file types that are commonly blocked by email security filters.

## What's Excluded

The following files have been removed to ensure email compatibility:

### Configuration Files (Auto-Regenerated)
- `postcss.config.mjs` - PostCSS configuration
- `eslint.config.mjs` - ESLint configuration

### Scripts (Development Only)
- `scripts/sync-library-branch.sh` - Development script for syncing library branch

### Build Output (Must Be Built)
- `dist/` directory - JavaScript build output (contains .js files)

## How to Restore Missing Files

### Option 1: Auto-Regenerate (Recommended)

Many modern tools auto-generate missing configuration files:

```bash
# Extract the archive
tar xzf shadcn-pivot-table-library-ultraclean.tar.gz
# or
unzip shadcn-pivot-table-library-ultraclean.zip

cd shadcn-pivot-data-table-example

# Install dependencies (will auto-generate some config files)
bun install
# or
npm install

# Build the library (creates dist/ folder)
bun run build
# or
npm run build
```

After running these commands, the library is ready to use!

### Option 2: Copy from GitHub

If you have access to the GitHub repository:

```bash
# Clone the repository to get ALL files
git clone https://github.com/YOUR_ORG/pivot-table.git

# Or download specific missing files:
curl -O https://raw.githubusercontent.com/YOUR_ORG/pivot-table/main/postcss.config.mjs
curl -O https://raw.githubusercontent.com/YOUR_ORG/pivot-table/main/eslint.config.mjs
```

Replace `YOUR_ORG` with your organization name.

### Option 3: Manual Configuration (Advanced)

If auto-generation doesn't work, create these files manually:

#### `postcss.config.mjs`

```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}

export default config
```

#### `eslint.config.mjs`

```javascript
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
```

## What's Included

The archive contains everything you need to use the library:

- ✅ Full `.git` directory (all commit history, tags, branches)
- ✅ All source code (`.ts`, `.tsx` files)
- ✅ All documentation (`.md` files)
- ✅ `package.json` and `tsconfig.json`
- ✅ `templates/` directory with configuration examples
- ✅ `src/` directory with library components
- ✅ `e2e/` directory with Playwright tests
- ✅ License and changelog

## Quick Start

```bash
# 1. Extract archive
tar xzf shadcn-pivot-table-library-ultraclean.tar.gz

# 2. Install dependencies
cd shadcn-pivot-data-table-example
bun install

# 3. Build library
bun run build

# 4. Run demo (optional)
bun dev
# Visit http://localhost:3000/pivot

# 5. Use in other projects
# See CORPORATE-DEPLOYMENT.md for installation methods
```

## Why These Files Are Excluded

Email security filters (Gmail, Outlook, corporate gateways) block archives containing:

- `.js` files (JavaScript - blocked since 2017)
- `.mjs` files (Modern JavaScript modules - also blocked)
- `.sh` files (Shell scripts - often blocked)

These restrictions apply even when files are inside `.zip` or `.tar.gz` archives. By excluding these file types, the archive can be safely transferred via email.

## Archive Verification

Both archives have been scanned to confirm no blocked extensions:

```bash
# Verified clean (no matches)
tar tzf shadcn-pivot-table-library-ultraclean.tar.gz | grep -E '\.(js|mjs|sh|vbs|bat|cmd|exe)$'
unzip -l shadcn-pivot-table-library-ultraclean.zip | grep -E '\.(js|mjs|sh|vbs|bat|cmd|exe)$'
```

## Need Help?

See the comprehensive deployment guides:

- **[CORPORATE-DEPLOYMENT.md](./CORPORATE-DEPLOYMENT.md)** - Complete corporate deployment guide
- **[SETUP-CHECKLIST.md](./SETUP-CHECKLIST.md)** - Step-by-step verification checklist
- **[LOCAL-USAGE.md](./LOCAL-USAGE.md)** - Local development patterns
- **[API.md](./API.md)** - Full API reference

## Archive Contents

**Size**: ~2.0-2.1 MB compressed

**Formats**:
- `shadcn-pivot-table-library-ultraclean.tar.gz` (2.0 MB)
- `shadcn-pivot-table-library-ultraclean.zip` (2.1 MB)

**Download from**: GitHub Release v1.1.0

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
