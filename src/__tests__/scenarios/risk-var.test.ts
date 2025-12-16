/**
 * Risk Management (VaR) - TDD Scenario
 *
 * RED-GREEN-REFACTOR Test Cases
 *
 * This test suite validates pivot table functionality for a real-world
 * portfolio risk analysis scenario with Value-at-Risk metrics.
 *
 * IMPORTANT NOTE: These tests use naive sum aggregation for VaR.
 * In production, proper VaR aggregation requires correlation matrices.
 * Portfolio VaR ≠ Sum of individual VaRs due to diversification effects.
 */

import { describe, test, expect } from 'bun:test'
import { transformToPivot } from '@/lib/pivot/transformer'
import type { PivotConfig } from '@/lib/pivot/schemas'
import {
  riskData,
  expectedVaRByAssetClassRegion,
  expectedVaRByRegion,
  expectedVolatilityStatsByAssetClass,
} from '../fixtures/risk-data'

describe('Risk Management (VaR) - Pivot Table', () => {
  describe('Scenario 1: VaR by Asset Class and Region', () => {
    test('should pivot VaR by asset class and region with sum aggregation', () => {
      // ARRANGE: Configure pivot to show VaR by Asset Class + Region
      const config: PivotConfig = {
        rowFields: ['assetClass', 'region'],
        columnFields: [],
        valueFields: [
          {
            field: 'var95',
            aggregation: 'sum',
            displayName: 'VaR 95% (Sum)',
          },
          {
            field: 'var99',
            aggregation: 'sum',
            displayName: 'VaR 99% (Sum)',
          },
          {
            field: 'marketValue',
            aggregation: 'sum',
            displayName: 'Market Value',
          },
        ],
        options: {
          expandedByDefault: false,
          showRowTotals: true,
          showColumnTotals: false,
          showGrandTotal: true,
        },
      }

      // ACT: Transform raw risk data into pivot table
      const result = transformToPivot(riskData, config)

      // ASSERT: Verify structure and aggregations
      expect(result.data).toBeDefined()
      expect(result.data.length).toBeGreaterThan(0)

      // Find Equities - Americas
      const equitiesAmericas = result.data.find(
        (row) => row.assetClass === 'Equities' && row.region === 'Americas'
      )
      expect(equitiesAmericas).toBeDefined()
      expect(equitiesAmericas?.['VaR 95% (Sum)']).toBe(1750000) // 850k + 520k + 380k
      expect(equitiesAmericas?.['VaR 99% (Sum)']).toBe(2610000)
      expect(equitiesAmericas?.['Market Value']).toBe(80000000)
    })

    test('should calculate Fixed Income VaR correctly (lowest risk)', () => {
      const config: PivotConfig = {
        rowFields: ['assetClass', 'region'],
        columnFields: [],
        valueFields: [
          {
            field: 'var95',
            aggregation: 'sum',
            displayName: 'VaR 95% (Sum)',
          },
          {
            field: 'marketValue',
            aggregation: 'sum',
            displayName: 'Market Value',
          },
        ],
        options: {
          expandedByDefault: false,
          showRowTotals: true,
          showColumnTotals: false,
          showGrandTotal: true,
        },
      }

      const result = transformToPivot(riskData, config)

      // Fixed Income - Americas (Treasuries + Corporate IG)
      const fixedIncomeAmericas = result.data.find(
        (row) => row.assetClass === 'Fixed Income' && row.region === 'Americas'
      )
      expect(fixedIncomeAmericas).toBeDefined()
      expect(fixedIncomeAmericas?.['VaR 95% (Sum)']).toBe(705000) // 420k + 285k
      expect(fixedIncomeAmericas?.['Market Value']).toBe(147700000) // 98.5M + 49.2M

      // Fixed Income - Europe
      const fixedIncomeEurope = result.data.find(
        (row) => row.assetClass === 'Fixed Income' && row.region === 'Europe'
      )
      expect(fixedIncomeEurope).toBeDefined()
      expect(fixedIncomeEurope?.['VaR 95% (Sum)']).toBe(310000)
      expect(fixedIncomeEurope?.['Market Value']).toBe(59100000)
    })

    test('should calculate Commodities VaR correctly (highest risk per dollar)', () => {
      const config: PivotConfig = {
        rowFields: ['assetClass', 'region'],
        columnFields: [],
        valueFields: [
          {
            field: 'var95',
            aggregation: 'sum',
            displayName: 'VaR 95% (Sum)',
          },
          {
            field: 'marketValue',
            aggregation: 'sum',
            displayName: 'Market Value',
          },
        ],
        options: {
          expandedByDefault: false,
          showRowTotals: true,
          showColumnTotals: false,
          showGrandTotal: true,
        },
      }

      const result = transformToPivot(riskData, config)

      // Commodities - Americas (Energy)
      const commoditiesAmericas = result.data.find(
        (row) => row.assetClass === 'Commodities' && row.region === 'Americas'
      )
      expect(commoditiesAmericas).toBeDefined()
      expect(commoditiesAmericas?.['VaR 95% (Sum)']).toBe(650000)
      expect(commoditiesAmericas?.['Market Value']).toBe(15000000)

      // Commodities - Europe (Metals)
      const commoditiesEurope = result.data.find(
        (row) => row.assetClass === 'Commodities' && row.region === 'Europe'
      )
      expect(commoditiesEurope).toBeDefined()
      expect(commoditiesEurope?.['VaR 95% (Sum)']).toBe(380000)
      expect(commoditiesEurope?.['Market Value']).toBe(10000000)
    })

    test('should calculate asset class totals across all regions', () => {
      const config: PivotConfig = {
        rowFields: ['assetClass', 'region'],
        columnFields: [],
        valueFields: [
          {
            field: 'var95',
            aggregation: 'sum',
            displayName: 'VaR 95% (Sum)',
          },
          {
            field: 'marketValue',
            aggregation: 'sum',
            displayName: 'Market Value',
          },
        ],
        options: {
          expandedByDefault: false,
          showRowTotals: true,
          showColumnTotals: false,
          showGrandTotal: true,
        },
      }

      const result = transformToPivot(riskData, config)

      // Find Equities total across all regions
      const equitiesTotal = result.data.find(
        (row) => row.assetClass === 'Equities' && row.region === '__TOTAL__'
      )
      expect(equitiesTotal).toBeDefined()
      expect(equitiesTotal?.['VaR 95% (Sum)']).toBe(3225000) // Americas + Europe + Asia
      expect(equitiesTotal?.['Market Value']).toBe(162000000)
    })

    test('should calculate grand total VaR across all asset classes', () => {
      const config: PivotConfig = {
        rowFields: ['assetClass', 'region'],
        columnFields: [],
        valueFields: [
          {
            field: 'var95',
            aggregation: 'sum',
            displayName: 'VaR 95% (Sum)',
          },
          {
            field: 'var99',
            aggregation: 'sum',
            displayName: 'VaR 99% (Sum)',
          },
          {
            field: 'marketValue',
            aggregation: 'sum',
            displayName: 'Market Value',
          },
        ],
        options: {
          expandedByDefault: false,
          showRowTotals: true,
          showColumnTotals: false,
          showGrandTotal: true,
        },
      }

      const result = transformToPivot(riskData, config)

      // Find grand total row
      const grandTotal = result.data.find(
        (row) => row.assetClass === '__GRAND_TOTAL__'
      )
      expect(grandTotal).toBeDefined()
      expect(grandTotal?.['VaR 95% (Sum)']).toBe(6110000)
      expect(grandTotal?.['VaR 99% (Sum)']).toBe(9295000)
      expect(grandTotal?.['Market Value']).toBe(483800000)

      // NOTE: This is naive sum. Real portfolio VaR would be lower due to diversification
      // Portfolio VaR with correlations would typically be 70-90% of naive sum
    })
  })

  describe('Scenario 2: VaR Contribution by Region', () => {
    test('should calculate VaR contribution by region', () => {
      // ARRANGE: Configure pivot to show VaR by Region
      const config: PivotConfig = {
        rowFields: ['region'],
        columnFields: [],
        valueFields: [
          {
            field: 'var95',
            aggregation: 'sum',
            displayName: 'VaR 95% (Sum)',
          },
          {
            field: 'var99',
            aggregation: 'sum',
            displayName: 'VaR 99% (Sum)',
          },
          {
            field: 'marketValue',
            aggregation: 'sum',
            displayName: 'Market Value',
          },
          {
            field: 'positionId',
            aggregation: 'count',
            displayName: 'Position Count',
          },
        ],
        options: {
          expandedByDefault: false,
          showRowTotals: false,
          showColumnTotals: false,
          showGrandTotal: true,
        },
      }

      // ACT: Transform raw risk data into pivot table
      const result = transformToPivot(riskData, config)

      // ASSERT: Verify VaR by region
      expect(result.data).toBeDefined()
      expect(result.data.length).toBe(4) // 3 regions + grand total

      // Americas (largest exposure)
      const americasRow = result.data.find((row) => row.region === 'Americas')
      expect(americasRow).toBeDefined()
      expect(americasRow?.['VaR 95% (Sum)']).toBe(3425000)
      expect(americasRow?.['VaR 99% (Sum)']).toBe(5190000)
      expect(americasRow?.['Market Value']).toBe(282700000)
      expect(americasRow?.['Position Count']).toBe(7)

      // Europe
      const europeRow = result.data.find((row) => row.region === 'Europe')
      expect(europeRow).toBeDefined()
      expect(europeRow?.['VaR 95% (Sum)']).toBe(1635000)
      expect(europeRow?.['VaR 99% (Sum)']).toBe(2505000)
      expect(europeRow?.['Market Value']).toBe(144100000)
      expect(europeRow?.['Position Count']).toBe(5)

      // Asia (smallest exposure)
      const asiaRow = result.data.find((row) => row.region === 'Asia')
      expect(asiaRow).toBeDefined()
      expect(asiaRow?.['VaR 95% (Sum)']).toBe(1050000)
      expect(asiaRow?.['VaR 99% (Sum)']).toBe(1600000)
      expect(asiaRow?.['Market Value']).toBe(57000000)
      expect(asiaRow?.['Position Count']).toBe(3)
    })

    test('should verify Americas has highest VaR contribution', () => {
      const config: PivotConfig = {
        rowFields: ['region'],
        columnFields: [],
        valueFields: [
          {
            field: 'var95',
            aggregation: 'sum',
            displayName: 'VaR 95% (Sum)',
          },
        ],
        options: {
          expandedByDefault: false,
          showRowTotals: false,
          showColumnTotals: false,
          showGrandTotal: false,
        },
      }

      const result = transformToPivot(riskData, config)

      // Extract VaRs for each region
      const regions = ['Americas', 'Europe', 'Asia']
      const varValues = regions.map((region) => {
        const row = result.data.find((r) => r.region === region)
        return row?.['VaR 95% (Sum)'] ?? 0
      })

      // Verify Americas > Europe > Asia
      expect(varValues[0]).toBeGreaterThan(varValues[1]) // Americas > Europe
      expect(varValues[1]).toBeGreaterThan(varValues[2]) // Europe > Asia
    })
  })

  describe('Scenario 3: Volatility and Beta Statistics by Asset Class', () => {
    test('should calculate average volatility and beta by asset class', () => {
      const config: PivotConfig = {
        rowFields: ['assetClass'],
        columnFields: [],
        valueFields: [
          {
            field: 'volatility',
            aggregation: 'avg',
            displayName: 'Avg Volatility',
          },
          {
            field: 'beta',
            aggregation: 'avg',
            displayName: 'Avg Beta',
          },
          {
            field: 'volatility',
            aggregation: 'min',
            displayName: 'Min Volatility',
          },
          {
            field: 'volatility',
            aggregation: 'max',
            displayName: 'Max Volatility',
          },
          {
            field: 'marketValue',
            aggregation: 'sum',
            displayName: 'Market Value',
          },
        ],
        options: {
          expandedByDefault: false,
          showRowTotals: false,
          showColumnTotals: false,
          showGrandTotal: false,
        },
      }

      const result = transformToPivot(riskData, config)

      // Fixed Income (lowest volatility)
      const fixedIncomeRow = result.data.find(
        (row) => row.assetClass === 'Fixed Income'
      )
      expect(fixedIncomeRow).toBeDefined()
      expect(fixedIncomeRow?.['Avg Volatility']).toBeCloseTo(5.7, 1)
      expect(fixedIncomeRow?.['Avg Beta']).toBeCloseTo(0.19, 2)
      expect(fixedIncomeRow?.['Min Volatility']).toBe(4.8)
      expect(fixedIncomeRow?.['Max Volatility']).toBe(6.5)

      // Commodities (highest volatility)
      const commoditiesRow = result.data.find(
        (row) => row.assetClass === 'Commodities'
      )
      expect(commoditiesRow).toBeDefined()
      expect(commoditiesRow?.['Avg Volatility']).toBeCloseTo(45.35, 1)
      expect(commoditiesRow?.['Avg Beta']).toBeCloseTo(0.60, 2)
      expect(commoditiesRow?.['Min Volatility']).toBe(42.2)
      expect(commoditiesRow?.['Max Volatility']).toBe(48.5)
    })

    test('should verify volatility ordering: FI < FX < Equities < Commodities', () => {
      const config: PivotConfig = {
        rowFields: ['assetClass'],
        columnFields: [],
        valueFields: [
          {
            field: 'volatility',
            aggregation: 'avg',
            displayName: 'Avg Volatility',
          },
        ],
        options: {
          expandedByDefault: false,
          showRowTotals: false,
          showColumnTotals: false,
          showGrandTotal: false,
        },
      }

      const result = transformToPivot(riskData, config)

      // Extract average volatilities
      const assetClasses = ['Fixed Income', 'FX', 'Equities', 'Commodities']
      const volatilities = assetClasses.map((assetClass) => {
        const row = result.data.find((r) => r.assetClass === assetClass)
        return row?.['Avg Volatility'] ?? 0
      })

      // Verify ordering
      expect(volatilities[0]).toBeLessThan(volatilities[1]) // FI < FX
      expect(volatilities[1]).toBeLessThan(volatilities[2]) // FX < Equities
      expect(volatilities[2]).toBeLessThan(volatilities[3]) // Equities < Commodities
    })

    test('should calculate Equities beta statistics', () => {
      const config: PivotConfig = {
        rowFields: ['assetClass'],
        columnFields: [],
        valueFields: [
          {
            field: 'beta',
            aggregation: 'min',
            displayName: 'Min Beta',
          },
          {
            field: 'beta',
            aggregation: 'max',
            displayName: 'Max Beta',
          },
          {
            field: 'beta',
            aggregation: 'avg',
            displayName: 'Avg Beta',
          },
        ],
        options: {
          expandedByDefault: false,
          showRowTotals: false,
          showColumnTotals: false,
          showGrandTotal: false,
        },
      }

      const result = transformToPivot(riskData, config)

      // Equities should have highest beta (most market-sensitive)
      const equitiesRow = result.data.find((row) => row.assetClass === 'Equities')
      expect(equitiesRow).toBeDefined()
      expect(equitiesRow?.['Min Beta']).toBe(0.75) // Japanese Equities
      expect(equitiesRow?.['Max Beta']).toBe(1.45) // Latin America
      expect(equitiesRow?.['Avg Beta']).toBeCloseTo(1.06, 2)
    })
  })

  describe('Scenario 4: VaR by Asset Class with Region as Columns', () => {
    test('should pivot VaR by asset class with regions as columns', () => {
      // ARRANGE: Configure pivot for VaR by Asset Class × Region
      const config: PivotConfig = {
        rowFields: ['assetClass'],
        columnFields: ['region'],
        valueFields: [
          {
            field: 'var95',
            aggregation: 'sum',
            displayName: 'VaR 95%',
          },
        ],
        options: {
          expandedByDefault: false,
          showRowTotals: true,
          showColumnTotals: true,
          showGrandTotal: true,
        },
      }

      // ACT: Transform raw risk data into pivot table
      const result = transformToPivot(riskData, config)

      // ASSERT: Verify pivot table structure was created
      expect(result.data).toBeDefined()
      expect(result.data.length).toBeGreaterThan(0)
    })

    test('should show Equities VaR distribution across regions', () => {
      const config: PivotConfig = {
        rowFields: ['assetClass'],
        columnFields: ['region'],
        valueFields: [
          {
            field: 'var95',
            aggregation: 'sum',
            displayName: 'VaR 95%',
          },
        ],
        options: {
          expandedByDefault: false,
          showRowTotals: true,
          showColumnTotals: true,
          showGrandTotal: true,
        },
      }

      const result = transformToPivot(riskData, config)

      // Find Equities row
      const equitiesRow = result.data.find((row) => row.assetClass === 'Equities')
      expect(equitiesRow).toBeDefined()

      // Verify VaR by region
      expect(equitiesRow?.['Americas__VaR 95%']).toBe(1750000)
      expect(equitiesRow?.['Europe__VaR 95%']).toBe(705000)
      expect(equitiesRow?.['Asia__VaR 95%']).toBe(770000)

      // Row total
      expect(equitiesRow?.['__total_VaR 95%']).toBe(3225000)
    })

    test('should show Fixed Income has no Asia exposure', () => {
      const config: PivotConfig = {
        rowFields: ['assetClass'],
        columnFields: ['region'],
        valueFields: [
          {
            field: 'var95',
            aggregation: 'sum',
            displayName: 'VaR 95%',
          },
        ],
        options: {
          expandedByDefault: false,
          showRowTotals: true,
          showColumnTotals: true,
          showGrandTotal: true,
        },
      }

      const result = transformToPivot(riskData, config)

      // Find Fixed Income row
      const fixedIncomeRow = result.data.find(
        (row) => row.assetClass === 'Fixed Income'
      )
      expect(fixedIncomeRow).toBeDefined()

      // Has Americas and Europe exposure
      expect(fixedIncomeRow?.['Americas__VaR 95%']).toBe(705000)
      expect(fixedIncomeRow?.['Europe__VaR 95%']).toBe(310000)

      // No Asia exposure
      expect(fixedIncomeRow?.['Asia__VaR 95%']).toBeUndefined()

      // Row total
      expect(fixedIncomeRow?.['__total_VaR 95%']).toBe(1015000)
    })
  })

  describe('Scenario 5: VaR Limitations Documentation', () => {
    test('should document naive VaR sum limitation', () => {
      // This test documents the limitation of naive VaR summation
      const config: PivotConfig = {
        rowFields: ['assetClass'],
        columnFields: [],
        valueFields: [
          {
            field: 'var95',
            aggregation: 'sum',
            displayName: 'Naive VaR Sum',
          },
        ],
        options: {
          expandedByDefault: false,
          showRowTotals: false,
          showColumnTotals: false,
          showGrandTotal: true,
        },
      }

      const result = transformToPivot(riskData, config)

      // Grand total uses naive sum
      const grandTotal = result.data.find(
        (row) => row.assetClass === '__GRAND_TOTAL__'
      )
      expect(grandTotal).toBeDefined()

      const naiveVarSum = grandTotal?.['Naive VaR Sum'] as number
      expect(naiveVarSum).toBe(6110000)

      // IMPORTANT: Real portfolio VaR would be significantly lower
      // With typical correlations, portfolio VaR might be 70-90% of naive sum
      // Example: If average correlation = 0.3, diversified VaR ≈ $4.8M - $5.5M
      //
      // Proper calculation requires:
      // - Variance-covariance matrix
      // - Correlation matrix between asset classes/regions
      // - Monte Carlo simulation or analytical methods
      //
      // For production implementation, consider:
      // - Using a custom aggregation function
      // - Calculating diversified VaR separately
      // - Displaying both naive sum and diversified VaR
    })
  })
})
