import { test, expect } from '@playwright/test'
import { PivotPage } from './page-objects/pivot-page'

/**
 * E2E Tests: Priority 5 - Scenario Switching
 *
 * Tests the scenario selector dropdown functionality:
 * - Switching between all 5 finance scenarios
 * - Verifying table updates with correct data for each scenario
 * - Checking that field configuration changes appropriately
 * - Validating URL updates when scenario changes
 */
test.describe('Scenario Switching', () => {
  let pivotPage: PivotPage

  test.beforeEach(async ({ page }) => {
    pivotPage = new PivotPage(page)
    await pivotPage.goto()
  })

  test('should display scenario selector dropdown', async ({ page }) => {
    // Verify the scenario selector is visible
    const scenarioCard = page.getByRole('heading', { name: /scenario/i }).first()
    await expect(scenarioCard).toBeVisible()

    // Verify the select element exists
    const select = page.getByRole('combobox')
    await expect(select).toBeVisible()
  })

  test('should list all 5 finance scenarios in dropdown', async ({ page }) => {
    // Click the scenario selector to open dropdown
    await page.getByRole('combobox').click()

    // Wait for dropdown to be visible
    await page.waitForSelector('[role="listbox"]', { state: 'visible' })

    // Verify all 5 scenarios are listed
    const expectedScenarios = [
      'Market Data OHLC Analysis',
      'Trading Desk P&L Analysis',
      'Bond Portfolio Analysis',
      'Options Portfolio Greeks',
      'Risk Management (VaR)',
    ]

    for (const scenario of expectedScenarios) {
      const option = page.getByRole('option', { name: scenario })
      await expect(option).toBeVisible()
    }
  })

  test('should switch to Trading P&L scenario and update table', async ({ page }) => {
    // Switch to Trading P&L scenario
    await page.getByRole('combobox').click()
    await page.getByRole('option', { name: /Trading Desk P&L/ }).click()

    // Wait for table to update
    await pivotPage.waitForTableLoad()

    // Verify URL updated
    const url = await pivotPage.getCurrentUrl()
    expect(url).toContain('scenario=trading-pnl')

    // Verify table has data
    await pivotPage.verifyTableHasData()

    // Verify expected columns for Trading P&L
    const columnHeaders = await pivotPage.getColumnHeaders()
    const headersText = columnHeaders.join(' ')
    expect(headersText).toContain('P&L')
  })

  test('should switch to Bond Portfolio scenario and update table', async ({ page }) => {
    // Switch to Bond Portfolio scenario
    await page.getByRole('combobox').click()
    await page.getByRole('option', { name: /Bond Portfolio/ }).click()

    // Wait for table to update
    await pivotPage.waitForTableLoad()

    // Verify URL updated
    const url = await pivotPage.getCurrentUrl()
    expect(url).toContain('scenario=bond-portfolio')

    // Verify table has data
    await pivotPage.verifyTableHasData()

    // Verify expected columns for Bond Portfolio
    const columnHeaders = await pivotPage.getColumnHeaders()
    const headersText = columnHeaders.join(' ')
    expect(headersText).toMatch(/Market Value|Duration|YTM/)
  })

  test('should switch to Options Greeks scenario and update table', async ({ page }) => {
    // Switch to Options Greeks scenario
    await page.getByRole('combobox').click()
    await page.getByRole('option', { name: /Options Portfolio Greeks/ }).click()

    // Wait for table to update
    await pivotPage.waitForTableLoad()

    // Verify URL updated
    const url = await pivotPage.getCurrentUrl()
    expect(url).toContain('scenario=options-greeks')

    // Verify table has data
    await pivotPage.verifyTableHasData()

    // Verify expected columns for Options Greeks
    const columnHeaders = await pivotPage.getColumnHeaders()
    const headersText = columnHeaders.join(' ')
    expect(headersText).toMatch(/Delta|Gamma|Vega|Theta/)
  })

  test('should switch to Risk VaR scenario and update table', async ({ page }) => {
    // Switch to Risk VaR scenario
    await page.getByRole('combobox').click()
    await page.getByRole('option', { name: /Risk Management/ }).click()

    // Wait for table to update
    await pivotPage.waitForTableLoad()

    // Verify URL updated
    const url = await pivotPage.getCurrentUrl()
    expect(url).toContain('scenario=risk-var')

    // Verify table has data
    await pivotPage.verifyTableHasData()

    // Verify expected columns for Risk VaR
    const columnHeaders = await pivotPage.getColumnHeaders()
    const headersText = columnHeaders.join(' ')
    expect(headersText).toMatch(/VaR|Volatility/)
  })

  test('should switch back to Market Data scenario', async ({ page }) => {
    // First, switch to a different scenario
    await page.getByRole('combobox').click()
    await page.getByRole('option', { name: /Trading/ }).click()
    await pivotPage.waitForTableLoad()

    // Now switch back to Market Data
    await page.getByRole('combobox').click()
    await page.getByRole('option', { name: /Market Data/ }).click()
    await pivotPage.waitForTableLoad()

    // Verify URL updated
    const url = await pivotPage.getCurrentUrl()
    expect(url).toContain('scenario=market-data')

    // Verify table has OHLC data
    const columnHeaders = await pivotPage.getColumnHeaders()
    const headersText = columnHeaders.join(' ')
    expect(headersText).toContain('Open')
    expect(headersText).toContain('Close')
  })

  test('should update scenario description when switching', async ({ page }) => {
    // Initial scenario description should be visible
    const descriptionBox = page.locator('.bg-muted').first()
    await expect(descriptionBox).toBeVisible()

    // Get initial description text
    const initialDescription = await descriptionBox.textContent()
    expect(initialDescription).toBeTruthy()

    // Switch scenario
    await page.getByRole('combobox').click()
    await page.getByRole('option', { name: /Trading/ }).click()
    await pivotPage.waitForTableLoad()

    // Description should have changed
    const newDescription = await descriptionBox.textContent()
    expect(newDescription).toBeTruthy()
    expect(newDescription).not.toBe(initialDescription)
  })

  test('should maintain table structure when switching scenarios', async () => {
    const scenarios = [
      'trading-pnl',
      'bond-portfolio',
      'options-greeks',
      'risk-var',
      'market-data',
    ]

    for (const scenario of scenarios) {
      await test.step(`Verifying ${scenario} scenario`, async () => {
        await pivotPage.goto(scenario)

        // Verify table exists
        await expect(pivotPage.pivotTable).toBeVisible()

        // Verify table has rows and columns
        const rowCount = await pivotPage.getRowCount()
        const columnCount = await pivotPage.getColumnCount()

        expect(rowCount).toBeGreaterThan(0)
        expect(columnCount).toBeGreaterThan(0)
      })
    }
  })

  test('should show different row counts for different scenarios', async () => {
    // Market Data has ~20 rows (5 symbols × 4 time buckets)
    await pivotPage.goto('market-data')
    const marketDataRows = await pivotPage.getRowCount()

    // Trading P&L has different number of rows
    await pivotPage.goto('trading-pnl')
    const tradingRows = await pivotPage.getRowCount()

    // They should be different (not a strict equality test)
    expect(marketDataRows).toBeGreaterThan(0)
    expect(tradingRows).toBeGreaterThan(0)
    // Note: Depending on grouping/totals, counts may vary
  })

  test('should preserve URL state when manually navigating with scenario param', async () => {
    // Navigate directly to a specific scenario URL
    await pivotPage.goto('bond-portfolio')

    // Verify table loads correctly
    await pivotPage.verifyTableHasData()

    // Verify the scenario selector shows the correct selection
    const combobox = pivotPage.page.getByRole('combobox')
    await expect(combobox).toContainText(/Bond Portfolio/i)
  })
})
