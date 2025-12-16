/**
 * Options Portfolio Greeks - TDD Scenario
 *
 * RED-GREEN-REFACTOR Test Cases
 *
 * This test suite validates pivot table functionality for a real-world
 * options trading desk managing Greeks across different strategies.
 */

import { describe, test, expect } from 'bun:test'
import { transformToPivot } from '@/lib/pivot/transformer'
import type { PivotConfig } from '@/lib/pivot/schemas'
import {
  optionsData,
  expectedGreeksByStrategyExpiry,
  expectedGreeksByUnderlying,
  expectedContractsByStrategyType,
  expectedIVStatsByStrategy,
} from '../fixtures/options-data'

describe('Options Portfolio Greeks - Pivot Table', () => {
  describe('Scenario 1: Greeks by Strategy and Expiry', () => {
    test('should pivot Greeks by strategy and expiry bucket with sum aggregation', () => {
      // ARRANGE: Configure pivot to show Greeks by Strategy + Expiry
      const config: PivotConfig = {
        rowFields: ['strategy', 'expiryBucket'],
        columnFields: [],
        valueFields: [
          {
            field: 'delta',
            aggregation: 'sum',
            displayName: 'Total Delta',
          },
          {
            field: 'gamma',
            aggregation: 'sum',
            displayName: 'Total Gamma',
          },
          {
            field: 'vega',
            aggregation: 'sum',
            displayName: 'Total Vega',
          },
          {
            field: 'contracts',
            aggregation: 'sum',
            displayName: 'Total Contracts',
          },
        ],
        options: {
          showRowTotals: true,
          showColumnTotals: false,
          showGrandTotal: true,
          expandedByDefault: false,
        },
      }

      // ACT: Transform raw options data into pivot table
      const result = transformToPivot(optionsData, config)

      // ASSERT: Verify structure and aggregations
      expect(result.data).toBeDefined()
      expect(result.data.length).toBeGreaterThan(0)

      // Find Covered Call - 1M expiry
      const coveredCall1M = result.data.find(
        (row) => row.strategy === 'Covered Call' && row.expiryBucket === '1M'
      )
      expect(coveredCall1M).toBeDefined()
      expect(coveredCall1M?.['Total Delta']).toBeCloseTo(-0.77, 2)
      expect(coveredCall1M?.['Total Gamma']).toBeCloseTo(0.033, 3)
      expect(coveredCall1M?.['Total Vega']).toBeCloseTo(0.20, 2)
      expect(coveredCall1M?.['Total Contracts']).toBe(150)
    })

    test('should calculate Protective Put Greeks correctly', () => {
      const config: PivotConfig = {
        rowFields: ['strategy', 'expiryBucket'],
        columnFields: [],
        valueFields: [
          {
            field: 'delta',
            aggregation: 'sum',
            displayName: 'Total Delta',
          },
          {
            field: 'gamma',
            aggregation: 'sum',
            displayName: 'Total Gamma',
          },
          {
            field: 'vega',
            aggregation: 'sum',
            displayName: 'Total Vega',
          },
        ],
        options: {
          showRowTotals: true,
          showColumnTotals: false,
          showGrandTotal: true,
          expandedByDefault: false,
        },
      }

      const result = transformToPivot(optionsData, config)

      // Find Protective Put - 2M expiry (AAPL + GOOGL)
      const protectivePut2M = result.data.find(
        (row) => row.strategy === 'Protective Put' && row.expiryBucket === '2M'
      )
      expect(protectivePut2M).toBeDefined()
      expect(protectivePut2M?.['Total Delta']).toBeCloseTo(0.47, 2) // 0.25 + 0.22
      expect(protectivePut2M?.['Total Gamma']).toBeCloseTo(0.036, 3) // 0.020 + 0.016
      expect(protectivePut2M?.['Total Vega']).toBeCloseTo(0.25, 2) // 0.15 + 0.10

      // Find Protective Put - 3M expiry (MSFT + NVDA)
      const protectivePut3M = result.data.find(
        (row) => row.strategy === 'Protective Put' && row.expiryBucket === '3M'
      )
      expect(protectivePut3M).toBeDefined()
      expect(protectivePut3M?.['Total Delta']).toBeCloseTo(0.65, 2) // 0.30 + 0.35
      expect(protectivePut3M?.['Total Gamma']).toBeCloseTo(0.055, 3) // 0.025 + 0.030
      expect(protectivePut3M?.['Total Vega']).toBeCloseTo(0.45, 2) // 0.20 + 0.25
    })

    test('should aggregate strategy totals across all expiries', () => {
      const config: PivotConfig = {
        rowFields: ['strategy', 'expiryBucket'],
        columnFields: [],
        valueFields: [
          {
            field: 'delta',
            aggregation: 'sum',
            displayName: 'Total Delta',
          },
        ],
        options: {
          showRowTotals: true,
          showColumnTotals: false,
          showGrandTotal: true,
          expandedByDefault: false,
        },
      }

      const result = transformToPivot(optionsData, config)

      // Find Covered Call total across all expiries
      const coveredCallTotal = result.data.find(
        (row) => row.strategy === 'Covered Call' && row.expiryBucket === '__TOTAL__'
      )
      expect(coveredCallTotal).toBeDefined()
      // Should sum: -0.77 (1M) + -0.60 (2M) + -0.40 (3M) = -1.77
      expect(coveredCallTotal?.['Total Delta']).toBeCloseTo(-1.77, 2)
    })
  })

  describe('Scenario 2: Net Greeks by Underlying', () => {
    test('should calculate net Greeks by underlying asset', () => {
      // ARRANGE: Configure pivot to show net Greeks by Underlying
      const config: PivotConfig = {
        rowFields: ['underlying'],
        columnFields: [],
        valueFields: [
          {
            field: 'delta',
            aggregation: 'sum',
            displayName: 'Net Delta',
          },
          {
            field: 'gamma',
            aggregation: 'sum',
            displayName: 'Net Gamma',
          },
          {
            field: 'vega',
            aggregation: 'sum',
            displayName: 'Net Vega',
          },
          {
            field: 'theta',
            aggregation: 'sum',
            displayName: 'Net Theta',
          },
        ],
        options: {
          showRowTotals: false,
          showColumnTotals: false,
          showGrandTotal: true,
          expandedByDefault: false,
        },
      }

      // ACT: Transform raw options data into pivot table
      const result = transformToPivot(optionsData, config)

      // ASSERT: Verify net Greeks for SPY
      const spyRow = result.data.find((row) => row.underlying === 'SPY')
      expect(spyRow).toBeDefined()
      expect(spyRow?.['Net Delta']).toBeCloseTo(-0.75, 2) // OPT001 + OPT018
      expect(spyRow?.['Net Gamma']).toBeCloseTo(0.035, 3)
      expect(spyRow?.['Net Vega']).toBeCloseTo(0.23, 2)
      expect(spyRow?.['Net Theta']).toBeCloseTo(-0.13, 2)
    })

    test('should calculate delta-neutral TSLA straddle correctly', () => {
      const config: PivotConfig = {
        rowFields: ['underlying'],
        columnFields: [],
        valueFields: [
          {
            field: 'delta',
            aggregation: 'sum',
            displayName: 'Net Delta',
          },
          {
            field: 'gamma',
            aggregation: 'sum',
            displayName: 'Net Gamma',
          },
          {
            field: 'vega',
            aggregation: 'sum',
            displayName: 'Net Vega',
          },
        ],
        options: {
          showRowTotals: false,
          showColumnTotals: false,
          showGrandTotal: false,
          expandedByDefault: false,
        },
      }

      const result = transformToPivot(optionsData, config)

      // TSLA straddle should be delta neutral (0.50 + -0.50 = 0)
      const tslaRow = result.data.find((row) => row.underlying === 'TSLA')
      expect(tslaRow).toBeDefined()
      expect(tslaRow?.['Net Delta']).toBeCloseTo(0.00, 2)
      expect(tslaRow?.['Net Gamma']).toBeCloseTo(0.070, 3)
      expect(tslaRow?.['Net Vega']).toBeCloseTo(0.60, 2)
    })

    test('should handle Iron Condor net Greeks correctly', () => {
      const config: PivotConfig = {
        rowFields: ['underlying'],
        columnFields: [],
        valueFields: [
          {
            field: 'delta',
            aggregation: 'sum',
            displayName: 'Net Delta',
          },
          {
            field: 'gamma',
            aggregation: 'sum',
            displayName: 'Net Gamma',
          },
          {
            field: 'vega',
            aggregation: 'sum',
            displayName: 'Net Vega',
          },
          {
            field: 'theta',
            aggregation: 'sum',
            displayName: 'Net Theta',
          },
        ],
        options: {
          showRowTotals: false,
          showColumnTotals: false,
          showGrandTotal: false,
          expandedByDefault: false,
        },
      }

      const result = transformToPivot(optionsData, config)

      // SPX Iron Condor has complex net Greeks from 4 legs
      const spxRow = result.data.find((row) => row.underlying === 'SPX')
      expect(spxRow).toBeDefined()
      expect(spxRow?.['Net Delta']).toBeCloseTo(0.12, 2)
      expect(spxRow?.['Net Gamma']).toBeCloseTo(0.000, 3)
      expect(spxRow?.['Net Vega']).toBeCloseTo(0.00, 2)
      expect(spxRow?.['Net Theta']).toBeCloseTo(0.01, 2) // Iron Condor has positive theta
    })
  })

  describe('Scenario 3: Contracts by Strategy and Option Type', () => {
    test('should pivot contracts by strategy with option type as columns', () => {
      // ARRANGE: Configure pivot for Contracts by Strategy x Option Type
      const config: PivotConfig = {
        rowFields: ['strategy'],
        columnFields: ['optionType'],
        valueFields: [
          {
            field: 'contracts',
            aggregation: 'sum',
            displayName: 'Contracts',
          },
        ],
        options: {
          showRowTotals: true,
          showColumnTotals: true,
          showGrandTotal: true,
          expandedByDefault: false,
        },
      }

      // ACT: Transform raw options data into pivot table
      const result = transformToPivot(optionsData, config)

      // ASSERT: Verify pivot table was created
      expect(result.data).toBeDefined()
      expect(result.data.length).toBeGreaterThan(0)
    })

    test('should aggregate Covered Call contracts correctly (all Calls)', () => {
      const config: PivotConfig = {
        rowFields: ['strategy'],
        columnFields: ['optionType'],
        valueFields: [
          {
            field: 'contracts',
            aggregation: 'sum',
            displayName: 'Contracts',
          },
        ],
        options: {
          showRowTotals: true,
          showColumnTotals: true,
          showGrandTotal: true,
          expandedByDefault: false,
        },
      }

      const result = transformToPivot(optionsData, config)

      // Covered Call should only have Call contracts
      const coveredCallRow = result.data.find(
        (row) => row.strategy === 'Covered Call'
      )
      expect(coveredCallRow).toBeDefined()
      expect(coveredCallRow?.['Call__Contracts']).toBe(405)
      expect(coveredCallRow?.['Put__Contracts']).toBeUndefined()
      expect(coveredCallRow?.['__total_Contracts']).toBe(405)
    })

    test('should aggregate Protective Put contracts correctly (all Puts)', () => {
      const config: PivotConfig = {
        rowFields: ['strategy'],
        columnFields: ['optionType'],
        valueFields: [
          {
            field: 'contracts',
            aggregation: 'sum',
            displayName: 'Contracts',
          },
        ],
        options: {
          showRowTotals: true,
          showColumnTotals: true,
          showGrandTotal: true,
          expandedByDefault: false,
        },
      }

      const result = transformToPivot(optionsData, config)

      // Protective Put should only have Put contracts
      const protectivePutRow = result.data.find(
        (row) => row.strategy === 'Protective Put'
      )
      expect(protectivePutRow).toBeDefined()
      expect(protectivePutRow?.['Put__Contracts']).toBe(530)
      expect(protectivePutRow?.['Call__Contracts']).toBeUndefined()
      expect(protectivePutRow?.['__total_Contracts']).toBe(530)
    })

    test('should aggregate Straddle contracts correctly (equal Calls and Puts)', () => {
      const config: PivotConfig = {
        rowFields: ['strategy'],
        columnFields: ['optionType'],
        valueFields: [
          {
            field: 'contracts',
            aggregation: 'sum',
            displayName: 'Contracts',
          },
        ],
        options: {
          showRowTotals: true,
          showColumnTotals: true,
          showGrandTotal: true,
          expandedByDefault: false,
        },
      }

      const result = transformToPivot(optionsData, config)

      // Straddle should have equal Call and Put contracts
      const straddleRow = result.data.find((row) => row.strategy === 'Straddle')
      expect(straddleRow).toBeDefined()
      expect(straddleRow?.['Call__Contracts']).toBe(120)
      expect(straddleRow?.['Put__Contracts']).toBe(120)
      expect(straddleRow?.['__total_Contracts']).toBe(240)
    })
  })

  describe('Scenario 4: Implied Volatility Statistics by Strategy', () => {
    test('should calculate IV statistics by strategy', () => {
      const config: PivotConfig = {
        rowFields: ['strategy'],
        columnFields: [],
        valueFields: [
          {
            field: 'impliedVol',
            aggregation: 'min',
            displayName: 'Min IV',
          },
          {
            field: 'impliedVol',
            aggregation: 'max',
            displayName: 'Max IV',
          },
          {
            field: 'impliedVol',
            aggregation: 'avg',
            displayName: 'Avg IV',
          },
        ],
        options: {
          showRowTotals: false,
          showColumnTotals: false,
          showGrandTotal: false,
          expandedByDefault: false,
        },
      }

      const result = transformToPivot(optionsData, config)

      // Covered Call strategy (lowest IV range)
      const coveredCallRow = result.data.find(
        (row) => row.strategy === 'Covered Call'
      )
      expect(coveredCallRow).toBeDefined()
      expect(coveredCallRow?.['Min IV']).toBe(17.8)
      expect(coveredCallRow?.['Max IV']).toBe(22.3)
      expect(coveredCallRow?.['Avg IV']).toBeCloseTo(19.58, 2)

      // Straddle strategy (highest IV range - volatility plays)
      const straddleRow = result.data.find((row) => row.strategy === 'Straddle')
      expect(straddleRow).toBeDefined()
      expect(straddleRow?.['Min IV']).toBe(38.6)
      expect(straddleRow?.['Max IV']).toBe(45.8)
      expect(straddleRow?.['Avg IV']).toBeCloseTo(42.23, 2)
    })

    test('should verify IV increases with risk for strategies', () => {
      const config: PivotConfig = {
        rowFields: ['strategy'],
        columnFields: [],
        valueFields: [
          {
            field: 'impliedVol',
            aggregation: 'avg',
            displayName: 'Avg IV',
          },
        ],
        options: {
          showRowTotals: false,
          showColumnTotals: false,
          showGrandTotal: false,
          expandedByDefault: false,
        },
      }

      const result = transformToPivot(optionsData, config)

      // Extract average IVs for each strategy
      const strategies = ['Iron Condor', 'Covered Call', 'Protective Put', 'Straddle']
      const avgIVs = strategies.map((strategy) => {
        const row = result.data.find((r) => r.strategy === strategy)
        return row?.['Avg IV'] ?? 0
      })

      // Verify risk ordering: Iron Condor < Covered Call < Protective Put < Straddle
      expect(avgIVs[0]).toBeLessThan(avgIVs[1]) // Iron Condor < Covered Call
      expect(avgIVs[1]).toBeLessThan(avgIVs[2]) // Covered Call < Protective Put
      expect(avgIVs[2]).toBeLessThan(avgIVs[3]) // Protective Put < Straddle
    })
  })
})
