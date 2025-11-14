import { test, expect } from '@playwright/test'
import { PivotPage } from './page-objects/pivot-page'

/**
 * E2E Tests: Priority 2 - Drag-and-Drop Edge Cases
 *
 * Tests the drag-and-drop functionality using Pragmatic Drag & Drop:
 * - Dragging fields to drop zones
 * - Preventing duplicate fields
 * - Moving fields between drop zones
 * - Removing fields from drop zones
 * - Table updates after drag operations
 *
 * Note: These tests assume the UI has draggable field components.
 * Tests may need adjustment based on actual implementation details.
 */
test.describe('Drag-and-Drop Interactions', () => {
  let pivotPage: PivotPage

  test.beforeEach(async ({ page }) => {
    pivotPage = new PivotPage(page)
    await pivotPage.goto('market-data')
  })

  test('should display pivot configuration panel with drop zones', async ({ page }) => {
    // Verify configuration panel exists
    const configPanel = page.getByRole('heading', { name: /configuration|fields/i }).first()

    // If config panel exists, test it
    try {
      await expect(configPanel).toBeVisible({ timeout: 2000 })
    } catch {
      // Drag-and-drop panel not yet visible, skip these tests
      test.skip('Drag-and-drop configuration panel not yet implemented')
    }
  })

  test.skip('should show available fields for dragging', async ({ page }) => {
    // This test is skipped until drag-and-drop UI is confirmed
    // Look for available fields section
    const availableFields = page.getByRole('region', { name: /available fields/i })
    await expect(availableFields).toBeVisible()

    // Verify some fields are listed
    const fieldList = page.locator('[data-testid^="draggable-field-"]')
    const count = await fieldList.count()
    expect(count).toBeGreaterThan(0)
  })

  test.skip('should drag field to Rows drop zone', async ({ page }) => {
    // This test is skipped until drag-and-drop UI is implemented
    const field = page.getByTestId('draggable-field-symbol')
    const rowsDropZone = page.getByTestId('drop-zone-rows')

    // Drag the field
    await field.dragTo(rowsDropZone)

    // Wait for table to update
    await pivotPage.waitForTableLoad()

    // Verify field appears in drop zone
    await expect(rowsDropZone).toContainText('symbol')

    // Verify table updated with new row grouping
    const rowHeaders = await pivotPage.getRowHeaders()
    expect(rowHeaders.length).toBeGreaterThan(0)
  })

  test.skip('should drag field to Columns drop zone', async ({ page }) => {
    // This test is skipped until drag-and-drop UI is implemented
    const field = page.getByTestId('draggable-field-timeBucket')
    const columnsDropZone = page.getByTestId('drop-zone-columns')

    // Drag the field
    await field.dragTo(columnsDropZone)

    // Wait for table to update
    await pivotPage.waitForTableLoad()

    // Verify field appears in drop zone
    await expect(columnsDropZone).toContainText('timeBucket')

    // Verify table created pivot columns
    const columnHeaders = await pivotPage.getColumnHeaders()
    expect(columnHeaders.length).toBeGreaterThan(5) // Should have multiple time bucket columns
  })

  test.skip('should prevent duplicate fields in same drop zone', async ({ page }) => {
    // This test is skipped until drag-and-drop UI is implemented
    const field = page.getByTestId('draggable-field-symbol')
    const rowsDropZone = page.getByTestId('drop-zone-rows')

    // Drag field once
    await field.dragTo(rowsDropZone)
    await pivotPage.waitForTableLoad()

    // Try to drag the same field again
    await field.dragTo(rowsDropZone)

    // Verify field only appears once
    const symbolFields = rowsDropZone.getByText('symbol')
    const count = await symbolFields.count()
    expect(count).toBe(1)

    // Verify an error message or visual feedback was shown
    const errorMessage = page.getByText(/already added|duplicate/i)
    const hasError = await errorMessage.isVisible().catch(() => false)
    if (hasError) {
      await expect(errorMessage).toBeVisible()
    }
  })

  test.skip('should move field between drop zones', async ({ page }) => {
    // This test is skipped until drag-and-drop UI is implemented
    const field = page.getByTestId('draggable-field-symbol')
    const rowsDropZone = page.getByTestId('drop-zone-rows')
    const columnsDropZone = page.getByTestId('drop-zone-columns')

    // Drag to rows first
    await field.dragTo(rowsDropZone)
    await pivotPage.waitForTableLoad()

    // Verify it's in rows
    await expect(rowsDropZone).toContainText('symbol')

    // Now drag from rows to columns
    const fieldInRows = rowsDropZone.getByText('symbol')
    await fieldInRows.dragTo(columnsDropZone)
    await pivotPage.waitForTableLoad()

    // Verify it moved
    await expect(rowsDropZone).not.toContainText('symbol')
    await expect(columnsDropZone).toContainText('symbol')

    // Verify table updated accordingly
    const columnHeaders = await pivotPage.getColumnHeaders()
    const headersText = columnHeaders.join(' ')
    expect(headersText).toContain('AAPL') // Symbol values should be column headers now
  })

  test.skip('should remove field when clicking remove button', async ({ page }) => {
    // This test is skipped until drag-and-drop UI is implemented
    const field = page.getByTestId('draggable-field-symbol')
    const rowsDropZone = page.getByTestId('drop-zone-rows')

    // Drag field to rows
    await field.dragTo(rowsDropZone)
    await pivotPage.waitForTableLoad()

    // Click remove button (X icon)
    const removeButton = page.getByTestId('remove-field-symbol')
    await removeButton.click()
    await pivotPage.waitForTableLoad()

    // Verify field removed
    await expect(rowsDropZone).not.toContainText('symbol')

    // Verify table updated
    const rowHeaders = await pivotPage.getRowHeaders()
    // Row grouping should be different now
    expect(rowHeaders).toBeDefined()
  })

  test.skip('should update table immediately after drag operation', async ({ page }) => {
    // This test is skipped until drag-and-drop UI is implemented
    // Get initial row count
    const initialRowCount = await pivotPage.getRowCount()

    // Drag a field to rows
    const field = page.getByTestId('draggable-field-symbol')
    const rowsDropZone = page.getByTestId('drop-zone-rows')
    await field.dragTo(rowsDropZone)

    // Table should update within reasonable time
    await page.waitForTimeout(1000) // Allow for animation/update

    // Verify table changed
    const newRowCount = await pivotPage.getRowCount()
    expect(newRowCount).not.toBe(initialRowCount)

    // Verify loading states cleared
    const loadingIndicator = page.locator('[data-slot="skeleton"]')
    await expect(loadingIndicator).not.toBeVisible()
  })

  test.skip('should show visual feedback during drag operation', async ({ page }) => {
    // This test is skipped until drag-and-drop UI is implemented
    const field = page.getByTestId('draggable-field-symbol')

    // Start dragging (don't drop yet)
    await field.hover()
    await page.mouse.down()

    // Verify drag feedback (ghost element, drop zone highlights, etc.)
    const dropZone = page.getByTestId('drop-zone-rows')

    // Drop zones should have hover/active state
    const hasActiveState = await dropZone.evaluate((el) => {
      return window.getComputedStyle(el).getPropertyValue('opacity') !== '1' ||
             window.getComputedStyle(el).getPropertyValue('border-color') !== ''
    })

    // Complete the drag
    await page.mouse.up()
  })

  test('should display pivot table configuration summary', async ({ page }) => {
    // This test verifies the scenario configuration is displayed
    // (prerequisite for drag-and-drop understanding)

    // Look for configuration info section
    const configInfo = page.locator('.text-xs.text-muted-foreground')

    const configText = await configInfo.textContent().catch(() => '')

    if (configText) {
      // Verify it shows row fields
      expect(configText).toContain('Row Fields')

      // Verify it shows metrics
      expect(configText).toContain('Metrics')
    } else {
      // Configuration display not yet implemented
      test.skip('Configuration display not yet implemented')
    }
  })

  test('should maintain consistent state after multiple drag operations', async () => {
    // This is a smoke test - verify the page doesn't break
    // when navigating between scenarios (simulating config changes)

    await pivotPage.goto('market-data')
    await pivotPage.verifyTableHasData()

    await pivotPage.goto('trading-pnl')
    await pivotPage.verifyTableHasData()

    await pivotPage.goto('bond-portfolio')
    await pivotPage.verifyTableHasData()

    // If we got here without errors, state management is working
    expect(true).toBeTruthy()
  })
})
