import { test, expect } from '@playwright/test'
import { PivotPage } from './page-objects/pivot-page'

/**
 * E2E Tests: Priority 4 - URL State Persistence
 *
 * Tests that pivot table configuration is persisted in the URL:
 * - Scenario parameter is in URL
 * - Configuration can be restored from URL
 * - URL can be shared and reproduced
 * - Deep linking works correctly
 */
test.describe('URL State Persistence', () => {
  let pivotPage: PivotPage

  test.beforeEach(async ({ page }) => {
    pivotPage = new PivotPage(page)
  })

  test('should include scenario in URL query params', async () => {
    // Navigate to a specific scenario
    await pivotPage.goto('trading-pnl')

    // Verify URL contains scenario parameter
    const url = await pivotPage.getCurrentUrl()
    expect(url).toContain('scenario=trading-pnl')

    // Verify searchParams can be parsed
    const params = await pivotPage.getUrlParams()
    expect(params.get('scenario')).toBe('trading-pnl')
  })

  test('should restore scenario from URL on page load', async ({ page, context }) => {
    // Navigate to bond-portfolio scenario
    await page.goto('/pivot?scenario=bond-portfolio')
    await pivotPage.waitForTableLoad()

    // Verify the correct scenario was loaded
    const url = await pivotPage.getCurrentUrl()
    expect(url).toContain('scenario=bond-portfolio')

    // Verify table has bond portfolio data
    const columnHeaders = await pivotPage.getColumnHeaders()
    const headersText = columnHeaders.join(' ')
    expect(headersText).toMatch(/Market Value|Duration/)

    // Verify scenario selector shows bond-portfolio
    const combobox = page.getByRole('combobox')
    await expect(combobox).toContainText(/Bond Portfolio/i)
  })

  test('should maintain URL state when switching scenarios', async () => {
    // Start with market-data
    await pivotPage.goto('market-data')
    let url = await pivotPage.getCurrentUrl()
    expect(url).toContain('scenario=market-data')

    // Switch to options-greeks
    await pivotPage.goto('options-greeks')
    url = await pivotPage.getCurrentUrl()
    expect(url).toContain('scenario=options-greeks')

    // Verify old scenario is not in URL
    expect(url).not.toContain('market-data')
  })

  test('should be shareable - URL works in new tab', async ({ page, context }) => {
    // Configure a specific pivot table
    await pivotPage.goto('risk-var')

    // Get the URL
    const configuredUrl = await pivotPage.getCurrentUrl()

    // Open URL in a new page (simulating sharing the link)
    const newPage = await context.newPage()
    const newPivotPage = new PivotPage(newPage)

    await newPage.goto(configuredUrl)
    await newPivotPage.waitForTableLoad()

    // Verify the new page has the same configuration
    const newUrl = await newPivotPage.getCurrentUrl()
    expect(newUrl).toBe(configuredUrl)

    // Verify table loaded with correct data
    await newPivotPage.verifyTableHasData()

    // Verify column headers match
    const originalHeaders = await pivotPage.getColumnHeaders()
    const newHeaders = await newPivotPage.getColumnHeaders()
    expect(newHeaders).toEqual(originalHeaders)

    await newPage.close()
  })

  test('should handle direct navigation to scenario URLs', async ({ page }) => {
    const scenarios = [
      { id: 'market-data', expectedText: /Open|Close/ },
      { id: 'trading-pnl', expectedText: /P&L/ },
      { id: 'bond-portfolio', expectedText: /Market Value|Duration/ },
      { id: 'options-greeks', expectedText: /Delta|Gamma/ },
      { id: 'risk-var', expectedText: /VaR|Volatility/ },
    ]

    for (const scenario of scenarios) {
      await test.step(`Testing direct navigation to ${scenario.id}`, async () => {
        // Navigate directly via URL
        await page.goto(`/pivot?scenario=${scenario.id}`)
        await pivotPage.waitForTableLoad()

        // Verify correct scenario loaded
        const url = await pivotPage.getCurrentUrl()
        expect(url).toContain(`scenario=${scenario.id}`)

        // Verify table has expected columns
        const columnHeaders = await pivotPage.getColumnHeaders()
        const headersText = columnHeaders.join(' ')
        expect(headersText).toMatch(scenario.expectedText)
      })
    }
  })

  test('should default to market-data when no scenario specified', async () => {
    // Navigate without scenario parameter
    await pivotPage.goto()

    // Verify default scenario is loaded
    const url = await pivotPage.getCurrentUrl()
    // URL should either have scenario=market-data or no scenario (defaults to market-data)

    // Verify table loaded correctly
    await pivotPage.verifyTableHasData()

    // Verify it's the market data scenario (has OHLC columns)
    const columnHeaders = await pivotPage.getColumnHeaders()
    const headersText = columnHeaders.join(' ')
    expect(headersText).toMatch(/Open|High|Low|Close/)
  })

  test('should handle invalid scenario parameter gracefully', async () => {
    // Navigate with invalid scenario
    await pivotPage.goto('invalid-scenario-name')

    // Should fallback to default scenario
    await pivotPage.waitForTableLoad()

    // Verify table still loads
    await pivotPage.verifyTableHasData()

    // Should load default (market-data) scenario
    const columnHeaders = await pivotPage.getColumnHeaders()
    const headersText = columnHeaders.join(' ')
    expect(headersText).toMatch(/Open|Close/)
  })

  test('should preserve URL params during browser navigation', async ({ page }) => {
    // Navigate to a scenario
    await pivotPage.goto('bond-portfolio')
    const originalUrl = await pivotPage.getCurrentUrl()

    // Switch to another scenario
    await pivotPage.goto('trading-pnl')

    // Use browser back button
    await page.goBack()
    await pivotPage.waitForTableLoad()

    // Verify we're back to bond-portfolio
    const backUrl = await pivotPage.getCurrentUrl()
    expect(backUrl).toContain('scenario=bond-portfolio')

    // Verify table shows bond portfolio data
    const columnHeaders = await pivotPage.getColumnHeaders()
    const headersText = columnHeaders.join(' ')
    expect(headersText).toMatch(/Market Value|Duration/)

    // Use browser forward button
    await page.goForward()
    await pivotPage.waitForTableLoad()

    // Verify we're back to trading-pnl
    const forwardUrl = await pivotPage.getCurrentUrl()
    expect(forwardUrl).toContain('scenario=trading-pnl')
  })

  test('should maintain URL state during page refresh', async ({ page }) => {
    // Navigate to a specific scenario
    await pivotPage.goto('options-greeks')

    // Get initial state
    const originalUrl = await pivotPage.getCurrentUrl()
    const originalHeaders = await pivotPage.getColumnHeaders()

    // Refresh the page
    await page.reload()
    await pivotPage.waitForTableLoad()

    // Verify URL is the same
    const refreshedUrl = await pivotPage.getCurrentUrl()
    expect(refreshedUrl).toBe(originalUrl)

    // Verify table configuration is the same
    const refreshedHeaders = await pivotPage.getColumnHeaders()
    expect(refreshedHeaders).toEqual(originalHeaders)
  })

  test('should encode special characters in URL params correctly', async ({ page }) => {
    // This test is future-proofing for when we add field names with special chars
    await pivotPage.goto('market-data')

    const url = await pivotPage.getCurrentUrl()
    const urlObj = new URL(url)

    // Verify URL is properly encoded
    expect(url).toMatch(/^https?:\/\/.*\/pivot/)

    // Verify params can be parsed
    const scenario = urlObj.searchParams.get('scenario')
    expect(scenario).toBeTruthy()
  })
})
