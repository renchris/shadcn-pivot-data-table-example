---
"shadcn-pivot-table": patch
---

fix: remove nested overflow wrapper breaking sticky column headers

- Remove `overflow-x-auto` wrapper div from Table component that was creating a nested scroll container
- This fixes sticky positioning for both vertical (column headers) and horizontal (first column) scrolling
- Sticky headers now work correctly with the iOS 26 liquid glass effect
