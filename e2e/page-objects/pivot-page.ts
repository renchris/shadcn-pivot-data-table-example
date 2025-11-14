import { type Page, type Locator, expect } from '@playwright/test'

/**
 * Page Object Model for Pivot Table Page
 * Encapsulates all interactions with the pivot table UI
 */
export class PivotPage {
  readonly page: Page

  // Page elements
  readonly scenarioSelector: Locator
  readonly rowsDropZone: Locator
  readonly columnsDropZone: Locator
  readonly valuesDropZone: Locator
  readonly pivotTable: Locator
  readonly exportButton: Locator

  constructor(page: Page) {
    this.page = page
    this.scenarioSelector = page.getByRole('combobox', { name: /scenario/i })
    this.rowsDropZone = page.getByTestId('drop-zone-rows')
    this.columnsDropZone = page.getByTestId('drop-zone-columns')
    this.valuesDropZone = page.getByTestId('drop-zone-values')
    this.pivotTable = page.getByRole('table')
    this.exportButton = page.getByRole('button', { name: /export/i })
  }

  /**
   * Navigate to pivot table page
   */
  async goto(scenario?: string) {
    const url = scenario ? `/pivot?scenario=${scenario}` : '/pivot'
    await this.page.goto(url)
    await this.waitForTableLoad()
  }

  /**
   * Wait for the pivot table to finish loading
   */
  async waitForTableLoad() {
    // Wait for the table to be visible
    await this.pivotTable.waitFor({ state: 'visible' })

    // Wait for any loading spinners to disappear
    await this.page.waitForSelector('[data-slot="skeleton"]', {
      state: 'detached',
      timeout: 10000,
    }).catch(() => {
      // Skeleton might already be gone, that's fine
    })
  }

  /**
   * Drag a field to a drop zone
   */
  async dragFieldTo(fieldName: string, dropZone: 'rows' | 'columns' | 'values') {
    const field = this.page.getByTestId(`draggable-field-${fieldName}`)
    const zone = dropZone === 'rows' ? this.rowsDropZone
      : dropZone === 'columns' ? this.columnsDropZone
      : this.valuesDropZone

    // Drag and drop
    await field.dragTo(zone)

    // Wait for table to update
    await this.waitForTableLoad()
  }

  /**
   * Remove a field from a drop zone
   */
  async removeField(fieldName: string) {
    const removeButton = this.page.getByTestId(`remove-field-${fieldName}`)
    await removeButton.click()
    await this.waitForTableLoad()
  }

  /**
   * Switch to a different scenario
   */
  async selectScenario(scenarioTitle: string) {
    await this.scenarioSelector.click()
    await this.page.getByRole('option', { name: scenarioTitle }).click()
    await this.waitForTableLoad()
  }

  /**
   * Get all column headers from the pivot table
   */
  async getColumnHeaders(): Promise<string[]> {
    const headers = await this.page.locator('thead th').allTextContents()
    return headers.map((h) => h.trim()).filter(Boolean)
  }

  /**
   * Get all row headers (first column values)
   */
  async getRowHeaders(): Promise<string[]> {
    const rows = await this.page.locator('tbody tr td:first-child').allTextContents()
    return rows.map((r) => r.trim()).filter(Boolean)
  }

  /**
   * Get cell value at specific row and column
   */
  async getCellValue(rowIndex: number, columnIndex: number): Promise<string> {
    const cell = this.page.locator(`tbody tr:nth-child(${rowIndex + 1}) td:nth-child(${columnIndex + 1})`)
    return (await cell.textContent()) || ''
  }

  /**
   * Get the total row count
   */
  async getRowCount(): Promise<number> {
    return await this.page.locator('tbody tr').count()
  }

  /**
   * Get the total column count
   */
  async getColumnCount(): Promise<number> {
    return await this.page.locator('thead th').count()
  }

  /**
   * Check if a field is in a drop zone
   */
  async isFieldInDropZone(fieldName: string, dropZone: 'rows' | 'columns' | 'values'): Promise<boolean> {
    const zone = dropZone === 'rows' ? this.rowsDropZone
      : dropZone === 'columns' ? this.columnsDropZone
      : this.valuesDropZone

    const field = zone.getByText(fieldName, { exact: false })
    return await field.isVisible().catch(() => false)
  }

  /**
   * Verify table has data
   */
  async verifyTableHasData() {
    const rowCount = await this.getRowCount()
    expect(rowCount).toBeGreaterThan(0)
  }

  /**
   * Verify subtotal rows exist
   */
  async verifySubtotalsExist() {
    const subtotalRow = this.page.locator('tbody tr').filter({ hasText: '__TOTAL__' }).first()
    await expect(subtotalRow).toBeVisible()
  }

  /**
   * Verify grand total row exists
   */
  async verifyGrandTotalExists() {
    const grandTotalRow = this.page.locator('tbody tr').filter({ hasText: '__GRAND_TOTAL__' }).first()
    await expect(grandTotalRow).toBeVisible()
  }

  /**
   * Export data in specified format
   */
  async exportData(format: 'csv' | 'excel' | 'json') {
    await this.exportButton.click()

    const formatButton = this.page.getByRole('button', { name: new RegExp(format, 'i') })
    await formatButton.click()

    // Wait for download
    const downloadPromise = this.page.waitForEvent('download')
    await this.page.getByRole('button', { name: /download/i }).click()

    return await downloadPromise
  }

  /**
   * Get current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url()
  }

  /**
   * Get URL search params
   */
  async getUrlParams(): Promise<URLSearchParams> {
    const url = await this.getCurrentUrl()
    return new URL(url).searchParams
  }
}
