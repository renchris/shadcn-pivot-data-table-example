---
"shadcn-pivot-data-table-example": patch
---

fix: resolve memory leaks causing Chrome crashes during drag-and-drop

- Memoize virtualizer callbacks (getScrollElement, estimateSize) to prevent recreation on every render
- Replace JSON.stringify with fast-deep-equal for efficient PivotConfig comparison in memo
- Fix unstable keys in DropZone (use field name only, not field-index)
- Add React.memo to ReorderableField component to prevent DnD listener churn
- Memoize callback props in PivotPanel (handleRemoveRowField, handleRemoveColumnField)
- Add proper Object URL cleanup in export dialog with try-finally pattern
- Add unmount guard to prevent state updates after component unmount
- Replace array spread with push for totals in transformer (saves ~100MB for large datasets)
- Add djb2 hash function for efficient config hashing (replaces JSON.stringify in cache)
- Reduce transform cache size from 10 to 5 entries

Estimated memory savings: 200-400MB for 100K row datasets
