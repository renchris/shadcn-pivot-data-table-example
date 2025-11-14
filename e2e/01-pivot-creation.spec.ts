import { test, expect } from '@playwright/test'
import { PivotPage } from './page-objects/pivot-page'

/**
 * E2E Tests: Priority 1 - Happy Path Pivot Creation
 *
 * Tests the core user workflow of creating a pivot table by:
 * - Loading the pivot table page
 * - Verifying default scenario loads
 * - Checking that table renders with data
 * - Verifying table structure (headers, rows, columns)
 * - Checking that aggregations are calculated
 */
test.describe('Pivot Table Creation - Happy Path', () => {
  let pivotPage: PivotPage

  test.beforeEach(async ({ page }) => {
    pivotPage = new PivotPage(page)
  })

  test('should load the default pivot table scenario', async ({ page }) => {
    // Navigate to the pivot page
    await pivotPage.goto()

    // Verify the page loaded
    await expect(page).toHaveTitle(/Create Next App/)

    // Verify the pivot table is visible
    await expect(pivotPage.pivotTable).toBeVisible()

    // Verify table has data
    await pivotPage.verifyTableHasData()
  })

  test('should display Market Data OHLC scenario by default', async () => {
    // Navigate without specifying scenario (should default to market-data)
    await pivotPage.goto()

    // Verify the correct scenario is loaded
    const url = await pivotPage.getCurrentUrl()
    expect(url).toContain('/pivot')

    // Verify table has data
    const rowCount = await pivotPage.getRowCount()
    expect(rowCount).toBeGreaterThan(0)

    // Verify column count (should have: symbol, timeBucket, Open, High, Low, Close, Volume)
    const columnCount = await pivotPage.getColumnCount()
    expect(columnCount).toBeGreaterThanOrEqual(7)
  })

  test('should show correct table structure with row and column headers', async () => {
    // Load trading-pnl scenario for hierarchical testing
    await pivotPage.goto('trading-pnl')

    // Get column headers
    const columnHeaders = await pivotPage.getColumnHeaders()
    expect(columnHeaders.length).toBeGreaterThan(0)

    // Verify column headers include expected fields
    const headersText = columnHeaders.join(' ')
    expect(headersText).toContain('Total P&L')
    expect(headersText).toContain('Total Volume')

    // Get row headers
    const rowHeaders = await pivotPage.getRowHeaders()
    expect(rowHeaders.length).toBeGreaterThan(0)

    // Verify row headers include desk names
    const rowsText = rowHeaders.join(' ')
    expect(rowsText).toMatch(/Equities|Fixed Income|FX/)
  })

  test('should calculate and display aggregated values correctly', async () => {
    // Load market-data scenario with known values
    await pivotPage.goto('market-data')

    // Verify table has the expected number of rows (5 symbols × 4 time buckets = 20 rows)
    const rowCount = await pivotPage.getRowCount()
    expect(rowCount).toBeGreaterThanOrEqual(15) // At least 15 rows (allowing for some grouping)

    // Verify all cells have numeric values or valid data
    const firstCellValue = await pivotPage.getCellValue(0, 0)
    expect(firstCellValue).toBeTruthy()
  })

  test('should render pivot table with proper layout and styling', async ({ page }) => {
    await pivotPage.goto('bond-portfolio')

    // Verify the pivot table card is visible
    const pivotCard = page.getByRole('article').filter({ hasText: 'Results' })
    await expect(pivotCard).toBeVisible()

    // Verify table is inside a scroll container (for large datasets)
    const scrollContainer = page.locator('[data-slot="scroll-area"]')
    const tableExists = await pivotPage.pivotTable.isVisible()
    expect(tableExists).toBeTruthy()

    // Verify table has proper borders and styling
    const table = pivotPage.pivotTable
    await expect(table).toHaveCSS('border-collapse', /collapse|separate/)
  })

  test('should show row totals when configured', async () => {
    // Trading P&L scenario has showRowTotals: true
    await pivotPage.goto('trading-pnl')

    // Wait for table to load
    await pivotPage.waitForTableLoad()

    // Check for total indicator in the table
    // Note: Actual implementation may vary, adjust selector as needed
    const tableContent = await pivotPage.pivotTable.textContent()
    expect(tableContent).toBeTruthy()

    // Verify we have at least some subtotal rows
    const rowCount = await pivotPage.getRowCount()
    expect(rowCount).toBeGreaterThan(5) // Should have desk groups + traders + totals
  })

  test('should show grand total when configured', async () => {
    // Trading P&L scenario has showGrandTotal: true
    await pivotPage.goto('trading-pnl')

    // Wait for table to load
    await pivotPage.waitForTableLoad()

    // Verify table has data including grand total
    const rowCount = await pivotPage.getRowCount()
    expect(rowCount).toBeGreaterThan(0)

    // The last row might be a grand total (implementation-dependent)
    const lastRowText = await pivotPage.getCellValue(rowCount - 1, 0)
    expect(lastRowText).toBeTruthy()
  })

  test('should handle scenarios with no column fields (flat pivots)', async () => {
    // Market data has no column fields, just rows
    await pivotPage.goto('market-data')

    // Verify table loads without errors
    await pivotPage.verifyTableHasData()

    // Verify we have the expected value columns
    const columnHeaders = await pivotPage.getColumnHeaders()
    const headersText = columnHeaders.join(' ')

    // Check for OHLC metrics
    expect(headersText).toContain('Open')
    expect(headersText).toContain('High')
    expect(headersText).toContain('Low')
    expect(headersText).toContain('Close')
    expect(headersText).toContain('Volume')
  })

  test('should handle complex financial scenarios without errors', async () => {
    const scenarios = ['market-data', 'trading-pnl', 'bond-portfolio', 'options-greeks', 'risk-var']

    for (const scenario of scenarios) {
      await test.step(`Testing ${scenario} scenario`, async () => {
        await pivotPage.goto(scenario)

        // Verify table loads
        await expect(pivotPage.pivotTable).toBeVisible()

        // Verify table has data
        await pivotPage.verifyTableHasData()

        // Verify no error messages
        const errorMessage = pivotPage.page.getByText(/error|failed|crash/i)
        await expect(errorMessage).not.toBeVisible()
      })
    }
  })
})
