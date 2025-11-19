#!/usr/bin/env bash

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  Library Branch Sync Script${NC}"
echo -e "${GREEN}  Syncs main branch to library branch for npm publishing${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check if we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo -e "${RED}Error: Must be on main branch to sync. Currently on: $CURRENT_BRANCH${NC}"
  exit 1
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
  echo -e "${RED}Error: You have uncommitted changes. Please commit or stash them first.${NC}"
  git status --short
  exit 1
fi

# Get current commit hash for reference
MAIN_COMMIT=$(git rev-parse --short HEAD)
echo -e "${YELLOW}Current main commit: $MAIN_COMMIT${NC}"
echo ""

# Check if library branch exists
if git show-ref --verify --quiet refs/heads/library; then
  echo -e "${YELLOW}Library branch exists. Will sync changes...${NC}"
  BRANCH_EXISTS=true
else
  echo -e "${YELLOW}Library branch does not exist. Will create it...${NC}"
  BRANCH_EXISTS=false
fi

# Create or checkout library branch
echo -e "\n${GREEN}Step 1: Checking out library branch${NC}"
if [ "$BRANCH_EXISTS" = true ]; then
  git checkout library
  git merge main --no-edit -m "Sync from main@$MAIN_COMMIT"
else
  git checkout -b library
  echo -e "${GREEN}Created new library branch${NC}"
fi

# Build the library to ensure dist/ is up to date
echo -e "\n${GREEN}Step 2: Building library${NC}"
bun install
bun run build

# Remove demo-specific files and directories
echo -e "\n${GREEN}Step 3: Removing demo-specific files${NC}"

# Demo app
if [ -d "src/app" ]; then
  echo -e "  ${YELLOW}Removing src/app/${NC}"
  git rm -rf src/app/
fi

# Test fixtures and scenarios
if [ -d "src/__tests__" ]; then
  echo -e "  ${YELLOW}Removing src/__tests__/${NC}"
  git rm -rf src/__tests__/
fi

# Scenario configuration
if [ -f "src/lib/pivot/scenarios.ts" ]; then
  echo -e "  ${YELLOW}Removing src/lib/pivot/scenarios.ts${NC}"
  git rm -f src/lib/pivot/scenarios.ts
fi

# Scenario selector component
if [ -f "src/components/pivot-table/scenario-selector.tsx" ]; then
  echo -e "  ${YELLOW}Removing src/components/pivot-table/scenario-selector.tsx${NC}"
  git rm -f src/components/pivot-table/scenario-selector.tsx
fi

# E2E tests
if [ -d "e2e" ]; then
  echo -e "  ${YELLOW}Removing e2e/${NC}"
  git rm -rf e2e/
fi

# Playwright config
if [ -f "playwright.config.ts" ]; then
  echo -e "  ${YELLOW}Removing playwright.config.ts${NC}"
  git rm -f playwright.config.ts
fi

# Next.js config
if [ -f "next.config.ts" ]; then
  echo -e "  ${YELLOW}Removing next.config.ts${NC}"
  git rm -f next.config.ts
fi

# Next.js environment types
if [ -f "next-env.d.ts" ]; then
  echo -e "  ${YELLOW}Removing next-env.d.ts${NC}"
  git rm -f next-env.d.ts 2>/dev/null || true
fi

# Public assets (Next.js specific)
if [ -d "public" ]; then
  echo -e "  ${YELLOW}Removing public/${NC}"
  git rm -rf public/
fi

# Examples directory (if it exists and is not empty)
if [ -d "examples" ] && [ "$(ls -A examples 2>/dev/null)" ]; then
  echo -e "  ${YELLOW}Removing examples/${NC}"
  git rm -rf examples/
fi

# Test results and reports
if [ -d "test-results" ]; then
  echo -e "  ${YELLOW}Removing test-results/${NC}"
  git rm -rf test-results/ 2>/dev/null || true
fi

if [ -d "playwright-report" ]; then
  echo -e "  ${YELLOW}Removing playwright-report/${NC}"
  git rm -rf playwright-report/ 2>/dev/null || true
fi

# Update package.json for library publishing
echo -e "\n${GREEN}Step 4: Updating package.json for library${NC}"

# Create a temporary Node script to update package.json
cat > /tmp/update-package.json.mjs <<'EOF'
import { readFileSync, writeFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));

// Set private to false (publishable)
pkg.private = false;

// Update scripts for library-only
pkg.scripts = {
  build: pkg.scripts.build,
  test: pkg.scripts.test,
  'test:watch': pkg.scripts['test:watch'],
  'test:coverage': pkg.scripts['test:coverage'],
  prepublishOnly: pkg.scripts.prepublishOnly,
};

// Remove demo-specific dependencies from devDependencies
const demoDevDeps = [
  'next',
  'eslint-config-next',
  '@playwright/test',
  'nuqs',
];

demoDevDeps.forEach(dep => {
  delete pkg.devDependencies[dep];
});

writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
console.log('✓ Updated package.json for library publishing');
EOF

node /tmp/update-package.json.mjs
git add package.json

# Update README.md for library consumers
echo -e "\n${GREEN}Step 5: Updating README.md for library${NC}"

# Check if library README template exists
if [ -f "scripts/README.library.md" ]; then
  echo -e "  ${YELLOW}Using README.library.md template${NC}"
  cp scripts/README.library.md README.md
  git add README.md
else
  echo -e "  ${YELLOW}No library README template found, keeping current README${NC}"
  echo -e "  ${YELLOW}Consider creating scripts/README.library.md for library-specific docs${NC}"
fi

# Commit changes
echo -e "\n${GREEN}Step 6: Committing changes${NC}"

if git diff --cached --quiet; then
  echo -e "${YELLOW}No changes to commit. Library branch is up to date.${NC}"
else
  git commit -m "Sync from main@$MAIN_COMMIT

Automated sync from main branch for library publishing.

Changes:
- Removed demo app and test files
- Updated package.json (private: false, library scripts only)
- Updated README for library consumers
- Built library to dist/

Source: main branch @ $MAIN_COMMIT"

  echo -e "${GREEN}✓ Changes committed to library branch${NC}"
fi

echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  Sync Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}Library branch is ready for:${NC}"
echo -e "  • Testing: bun test"
echo -e "  • Publishing: npm publish"
echo -e "  • Pushing: git push origin library"
echo ""
echo -e "${YELLOW}To return to main branch:${NC}"
echo -e "  git checkout main"
echo ""
