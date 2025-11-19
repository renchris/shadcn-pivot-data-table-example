import { defineConfig } from 'tsup'

export default defineConfig({
  // Use build-specific TypeScript config
  tsconfig: './tsconfig.build.json',

  // Multiple entry points for different use cases
  entry: {
    // Main entry - styled components + core functionality
    index: 'src/index.ts',
    // Headless entry - core functionality only (framework-agnostic)
    headless: 'src/headless.ts',
    // Server entry - Next.js Server Components support
    server: 'src/server.ts',
  },

  // Output formats
  format: ['esm', 'cjs'],

  // Generate TypeScript declaration files
  dts: true,

  // Source maps for debugging
  sourcemap: true,

  // Clean dist directory before each build
  clean: true,

  // External dependencies (not bundled)
  external: [
    'react',
    'react-dom',
    'next',
    '@tanstack/react-table',
    '@tanstack/react-virtual',
    '@atlaskit/pragmatic-drag-and-drop',
    '@atlaskit/pragmatic-drag-and-drop-hitbox',
    '@radix-ui/react-checkbox',
    '@radix-ui/react-dialog',
    '@radix-ui/react-dropdown-menu',
    '@radix-ui/react-label',
    '@radix-ui/react-radio-group',
    '@radix-ui/react-scroll-area',
    '@radix-ui/react-select',
    '@radix-ui/react-separator',
    '@radix-ui/react-slot',
    'lucide-react',
    'exceljs', // Optional dependency for Excel export
  ],

  // Split vendor chunks for better caching
  splitting: true,

  // Tree-shake to remove unused code
  treeshake: true,

  // Target modern environments
  target: 'es2022',

  // Bundle configuration
  bundle: true,

  // Minify output for production
  minify: false, // Set to true for production builds

  // Skip node_modules from bundling
  skipNodeModulesBundle: true,
})
