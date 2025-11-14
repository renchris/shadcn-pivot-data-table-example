---
"shadcn-pivot-data-table-example": patch
---

# Drag-and-Drop UX Improvements

## Bug Fixes

### Remove Button Integration
- Integrated remove button inside badge instead of floating externally
- Fixed inverted color states (now: subtle grey → dark on hover)
- Reduced button size from 3.5×3.5 to 3×3 for better proportions
- Removed destructive red hover that clashed with badge aesthetic

### Display Fixes
- Fixed `__TOTAL__` appearing as literal text in subtotal rows
- Now displays user-friendly labels: "Total", "Column Total", "Grand Total"

## UX Enhancements

### React Portal Drag Preview
- Implemented official Pragmatic Drag and Drop pattern with `createPortal`
- Removed rectangular wrapper border from drag preview
- Clean badge-only preview during drag operations
- Reduced code complexity by ~40% (removed manual DOM manipulation)

### Preserved Click Offset
- Switched from `pointerOutsideOfPreview` to `preserveOffsetOnSource`
- Badge maintains position where user clicked during drag
- Follows Atlassian design guidelines for small draggable elements
- Natural dragging feel without jarring repositioning

## Code Quality
- Removed `getFieldIconSVG()` helper function (no longer needed)
- Simplified drag state management with state machine pattern
- Better adherence to Pragmatic Drag and Drop best practices
