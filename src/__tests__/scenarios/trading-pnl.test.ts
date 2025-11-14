/**
 * Trading Desk P&L Analysis - TDD Scenario
 *
 * RED-GREEN-REFACTOR Test Cases
 *
 * This test suite validates pivot table functionality for a real-world
 * trading desk P&L analysis scenario.
 */

import { describe, test, expect } from 'bun:test'
import { transformToPivot } from '@/lib/pivot/transformer'
import type { PivotConfig } from '@/lib/pivot/schemas'
import {
  tradingData,
  expectedPnLByDeskTrader,
  expectedVolumeByInstrumentTrader,
} from '../fixtures/trading-data'

describe('Trading Desk P&L Analysis - Pivot Table', () => {
  describe('Scenario 1: P&L by Desk and Trader', () => {
    test('should pivot P&L by desk and trader with sum aggregation', () => {
      // ARRANGE: Configure pivot to show P&L by Desk + Trader
      const config: PivotConfig = {
        rowFields: ['desk', 'trader'],
        columnFields: [],
        valueFields: [
          {
            field: 'pnl',
            aggregation: 'sum',
            displayName: 'Total P&L',
          },
        ],
        options: {
          showRowTotals: true,
          showColumnTotals: false,
          showGrandTotal: true,
        },
      }

      // ACT: Transform raw trading data into pivot table
      const result = transformToPivot(tradingData, config)

      // ASSERT: Verify structure and aggregations
      expect(result.data).toBeDefined()
      expect(result.data.length).toBeGreaterThan(0)

      // Find Alice Chen's total P&L (Equities desk)
      const aliceRow = result.data.find(
        (row) => row.desk === 'Equities' && row.trader === 'Alice Chen'
      )
      expect(aliceRow).toBeDefined()
      expect(aliceRow?.['Total P&L']).toBe(18950) // 12500 + 8750 - 2300

      // Find Bob Smith's total P&L (Equities desk)
      const bobRow = result.data.find(
        (row) => row.desk === 'Equities' && row.trader === 'Bob Smith'
      )
      expect(bobRow).toBeDefined()
      expect(bobRow?.['Total P&L']).toBe(38000) // 15600 + 22400

      // Verify Equities desk total
      const equitiesTotalRow = result.data.find(
        (row) => row.desk === 'Equities' && row.trader === '__TOTAL__'
      )
      expect(equitiesTotalRow).toBeDefined()
      expect(equitiesTotalRow?.['Total P&L']).toBe(56950) // 18950 + 38000
    })

    test('should calculate Fixed Income desk totals correctly', () => {
      const config: PivotConfig = {
        rowFields: ['desk', 'trader'],
        columnFields: [],
        valueFields: [
          {
            field: 'pnl',
            aggregation: 'sum',
            displayName: 'Total P&L',
          },
        ],
        options: {
          showRowTotals: true,
          showColumnTotals: false,
          showGrandTotal: true,
        },
      }

      const result = transformToPivot(tradingData, config)

      // Find Carol Wong's total P&L (Fixed Income desk)
      const carolRow = result.data.find(
        (row) => row.desk === 'Fixed Income' && row.trader === 'Carol Wong'
      )
      expect(carolRow).toBeDefined()
      expect(carolRow?.['Total P&L']).toBe(58300) // 45000 + 18500 - 5200

      // Find David Lee's total P&L (Fixed Income desk)
      const davidRow = result.data.find(
        (row) => row.desk === 'Fixed Income' && row.trader === 'David Lee'
      )
      expect(davidRow).toBeDefined()
      expect(davidRow?.['Total P&L']).toBe(40900) // 32000 + 8900

      // Verify Fixed Income desk total
      const fixedIncomeTotalRow = result.data.find(
        (row) => row.desk === 'Fixed Income' && row.trader === '__TOTAL__'
      )
      expect(fixedIncomeTotalRow).toBeDefined()
      expect(fixedIncomeTotalRow?.['Total P&L']).toBe(99200) // 58300 + 40900
    })

    test('should calculate FX desk totals correctly', () => {
      const config: PivotConfig = {
        rowFields: ['desk', 'trader'],
        columnFields: [],
        valueFields: [
          {
            field: 'pnl',
            aggregation: 'sum',
            displayName: 'Total P&L',
          },
        ],
        options: {
          showRowTotals: true,
          showColumnTotals: false,
          showGrandTotal: true,
        },
      }

      const result = transformToPivot(tradingData, config)

      // Find Emma Johnson's total P&L (FX desk)
      const emmaRow = result.data.find(
        (row) => row.desk === 'FX' && row.trader === 'Emma Johnson'
      )
      expect(emmaRow).toBeDefined()
      expect(emmaRow?.['Total P&L']).toBe(43500) // 28000 + 15500

      // Find Frank Martinez's total P&L (FX desk)
      const frankRow = result.data.find(
        (row) => row.desk === 'FX' && row.trader === 'Frank Martinez'
      )
      expect(frankRow).toBeDefined()
      expect(frankRow?.['Total P&L']).toBe(3600) // -8700 + 12300

      // Find Grace Kim's total P&L (FX desk)
      const graceRow = result.data.find(
        (row) => row.desk === 'FX' && row.trader === 'Grace Kim'
      )
      expect(graceRow).toBeDefined()
      expect(graceRow?.['Total P&L']).toBe(19800)

      // Verify FX desk total
      const fxTotalRow = result.data.find(
        (row) => row.desk === 'FX' && row.trader === '__TOTAL__'
      )
      expect(fxTotalRow).toBeDefined()
      expect(fxTotalRow?.['Total P&L']).toBe(66900) // 43500 + 3600 + 19800
    })

    test('should calculate grand total P&L across all desks', () => {
      const config: PivotConfig = {
        rowFields: ['desk', 'trader'],
        columnFields: [],
        valueFields: [
          {
            field: 'pnl',
            aggregation: 'sum',
            displayName: 'Total P&L',
          },
        ],
        options: {
          showRowTotals: true,
          showColumnTotals: false,
          showGrandTotal: true,
        },
      }

      const result = transformToPivot(tradingData, config)

      // Find grand total row
      const grandTotalRow = result.data.find(
        (row) => row.desk === '__GRAND_TOTAL__'
      )
      expect(grandTotalRow).toBeDefined()
      expect(grandTotalRow?.['Total P&L']).toBe(223050) // 56950 + 99200 + 66900
    })
  })

  describe('Scenario 2: Volume by Instrument and Trader', () => {
    test('should pivot volume by instrument with traders as columns', () => {
      // ARRANGE: Configure pivot to show volumes by Instrument x Trader
      const config: PivotConfig = {
        rowFields: ['instrument'],
        columnFields: ['trader'],
        valueFields: [
          {
            field: 'quantity',
            aggregation: 'sum',
            displayName: 'Volume',
          },
        ],
        options: {
          showRowTotals: true,
          showColumnTotals: true,
          showGrandTotal: true,
        },
      }

      // ACT: Transform raw trading data into pivot table
      const result = transformToPivot(tradingData, config)

      // ASSERT: Verify dynamic columns were created
      expect(result.metadata.pivotColumns).toBeDefined()
      expect(result.metadata.pivotColumns.length).toBe(7) // 7 unique traders

      // Verify column names include all traders
      const traderColumns = result.metadata.pivotColumns.map((col) => col.pivotValue)
      expect(traderColumns).toContain('Alice Chen')
      expect(traderColumns).toContain('Bob Smith')
      expect(traderColumns).toContain('Carol Wong')
      expect(traderColumns).toContain('David Lee')
      expect(traderColumns).toContain('Emma Johnson')
      expect(traderColumns).toContain('Frank Martinez')
      expect(traderColumns).toContain('Grace Kim')
    })

    test('should aggregate US10Y volumes across multiple traders', () => {
      const config: PivotConfig = {
        rowFields: ['instrument'],
        columnFields: ['trader'],
        valueFields: [
          {
            field: 'quantity',
            aggregation: 'sum',
            displayName: 'Volume',
          },
        ],
        options: {
          showRowTotals: true,
          showColumnTotals: true,
          showGrandTotal: true,
        },
      }

      const result = transformToPivot(tradingData, config)

      // Find US10Y row
      const us10yRow = result.data.find((row) => row.instrument === 'US10Y')
      expect(us10yRow).toBeDefined()

      // Carol Wong traded 10M of US10Y
      expect(us10yRow?.['Carol Wong__Volume']).toBe(10000000)

      // David Lee traded 8M of US10Y
      expect(us10yRow?.['David Lee__Volume']).toBe(8000000)

      // Row total should be 18M
      expect(us10yRow?.['__TOTAL__']).toBe(18000000)
    })

    test('should handle single-trader instruments correctly', () => {
      const config: PivotConfig = {
        rowFields: ['instrument'],
        columnFields: ['trader'],
        valueFields: [
          {
            field: 'quantity',
            aggregation: 'sum',
            displayName: 'Volume',
          },
        ],
        options: {
          showRowTotals: true,
          showColumnTotals: true,
          showGrandTotal: true,
        },
      }

      const result = transformToPivot(tradingData, config)

      // Find AAPL row (only Alice Chen traded it)
      const aaplRow = result.data.find((row) => row.instrument === 'AAPL')
      expect(aaplRow).toBeDefined()
      expect(aaplRow?.['Alice Chen__Volume']).toBe(1000)
      expect(aaplRow?.['__TOTAL__']).toBe(1000)

      // All other trader columns should be undefined or 0
      expect(aaplRow?.['Bob Smith__Volume']).toBeUndefined()
      expect(aaplRow?.['Carol Wong__Volume']).toBeUndefined()
    })

    test('should calculate column totals for each trader', () => {
      const config: PivotConfig = {
        rowFields: ['instrument'],
        columnFields: ['trader'],
        valueFields: [
          {
            field: 'quantity',
            aggregation: 'sum',
            displayName: 'Volume',
          },
        ],
        options: {
          showRowTotals: true,
          showColumnTotals: true,
          showGrandTotal: true,
        },
      }

      const result = transformToPivot(tradingData, config)

      // Find column total row
      const columnTotalRow = result.data.find(
        (row) => row.instrument === '__COLUMN_TOTAL__'
      )
      expect(columnTotalRow).toBeDefined()

      // Verify Alice Chen's total volume (1000 + 500 + 300 = 1800)
      expect(columnTotalRow?.['Alice Chen__Volume']).toBe(1800)

      // Verify Carol Wong's total volume (10M + 5M + 3M = 18M)
      expect(columnTotalRow?.['Carol Wong__Volume']).toBe(18000000)
    })
  })

  describe('Scenario 3: Multi-metric analysis', () => {
    test('should support multiple value fields (P&L and Volume)', () => {
      const config: PivotConfig = {
        rowFields: ['desk'],
        columnFields: [],
        valueFields: [
          {
            field: 'pnl',
            aggregation: 'sum',
            displayName: 'Total P&L',
          },
          {
            field: 'quantity',
            aggregation: 'sum',
            displayName: 'Total Volume',
          },
          {
            field: 'pnl',
            aggregation: 'avg',
            displayName: 'Avg P&L per Trade',
          },
        ],
        options: {
          showRowTotals: false,
          showColumnTotals: false,
          showGrandTotal: true,
        },
      }

      const result = transformToPivot(tradingData, config)

      // Find Equities desk row
      const equitiesRow = result.data.find((row) => row.desk === 'Equities')
      expect(equitiesRow).toBeDefined()

      // Should have 3 value columns
      expect(equitiesRow?.['Total P&L']).toBe(56950)
      expect(equitiesRow?.['Total Volume']).toBeDefined()
      expect(equitiesRow?.['Avg P&L per Trade']).toBeDefined()

      // Verify average calculation (56950 / 5 trades = 11390)
      expect(equitiesRow?.['Avg P&L per Trade']).toBe(11390)
    })
  })
})
