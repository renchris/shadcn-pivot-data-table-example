---
"shadcn-pivot-data-table-example": patch
---

Fix React 19 compatibility documentation

**Major Documentation Corrections:**
- Corrected React 19 support status - all dependencies fully support React 19
- Fixed incorrect information about lucide-react (we use web package which supports React 19 since Dec 2024)
- Fixed incorrect information about @atlaskit/pragmatic-drag-and-drop (framework-agnostic, no React peer dependency)
- Updated package.json peerDependencies to explicitly include React 19: `^18.3.0 || ^19.0.0`

**Files Updated:**
- COMPATIBILITY.md - Changed React 19 from "Partially Supported" to "Fully Supported"
- README.md - Updated requirements to show React 19 is fully supported
- CORPORATE-DEPLOYMENT.md - Removed incorrect peer dependency conflict warnings
- package.json - Added explicit React 19 support in peerDependencies

**Additional Enhancements:**
- Added comprehensive Bun version documentation (minimum 1.0.0, recommended 1.1.18+ for .npmrc support)
- Created bunfig.toml template for corporate registry configuration
- Created .env.example with NPM_TOKEN setup instructions
- Enhanced .gitignore with registry credential protection
- Added BUNDLE-INSTRUCTIONS.md for Git bundle recipients
- Created COMPATIBILITY.md as comprehensive version compatibility guide

**Result:** React 19 is now correctly documented as fully supported across all documentation.
