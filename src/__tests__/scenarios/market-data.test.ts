/**
 * Market Data Analysis - TDD Scenario
 *
 * RED-GREEN-REFACTOR Test Cases
 *
 * This test suite validates pivot table functionality for a real-world
 * intraday market data analysis scenario with OHLC aggregations.
 */

import { describe, test, expect } from 'bun:test'
import { transformToPivot } from '@/lib/pivot/transformer'
import type { PivotConfig } from '@/lib/pivot/schemas'
import {
  marketData,
  expectedOHLCBySymbolTime,
  expectedAggregatedOHLCBySymbol,
  expectedVolumeByTimeBucketSymbol,
  expectedPriceRangeBySymbol,
} from '../fixtures/market-data'

describe('Market Data Analysis - Pivot Table', () => {
  describe('Scenario 1: OHLC by Symbol and Time Bucket', () => {
    test('should preserve OHLC data for each symbol and time period', () => {
      // ARRANGE: Configure pivot to show OHLC by Symbol + Time Bucket
      const config: PivotConfig = {
        rowFields: ['symbol', 'timeBucket'],
        columnFields: [],
        valueFields: [
          {
            field: 'open',
            aggregation: 'first',
            displayName: 'Open',
          },
          {
            field: 'high',
            aggregation: 'max',
            displayName: 'High',
          },
          {
            field: 'low',
            aggregation: 'min',
            displayName: 'Low',
          },
          {
            field: 'close',
            aggregation: 'last',
            displayName: 'Close',
          },
          {
            field: 'volume',
            aggregation: 'sum',
            displayName: 'Volume',
          },
        ],
        options: {
          showRowTotals: false,
          showColumnTotals: false,
          showGrandTotal: false,
          expandedByDefault: false,
        },
      }

      // ACT: Transform raw market data into pivot table
      const result = transformToPivot(marketData, config)

      // ASSERT: Verify OHLC data is preserved correctly
      expect(result.data).toBeDefined()
      expect(result.data.length).toBe(20) // 5 symbols × 4 time periods

      // Verify AAPL 09:30 data
      const aapl0930 = result.data.find(
        (row) => row.symbol === 'AAPL' && row.timeBucket === '09:30'
      )
      expect(aapl0930).toBeDefined()
      expect(aapl0930?.['Open']).toBe(175.50)
      expect(aapl0930?.['High']).toBe(176.25)
      expect(aapl0930?.['Low']).toBe(175.10)
      expect(aapl0930?.['Close']).toBe(175.80)
      expect(aapl0930?.['Volume']).toBe(2500000)
    })

    test('should use first aggregation for Open prices', () => {
      const config: PivotConfig = {
        rowFields: ['symbol', 'timeBucket'],
        columnFields: [],
        valueFields: [
          {
            field: 'open',
            aggregation: 'first',
            displayName: 'Open',
          },
        ],
        options: {
          showRowTotals: false,
          showColumnTotals: false,
          showGrandTotal: false,
          expandedByDefault: false,
        },
      }

      const result = transformToPivot(marketData, config)

      // Verify each row has the correct Open price
      const aapl0945 = result.data.find(
        (row) => row.symbol === 'AAPL' && row.timeBucket === '09:45'
      )
      expect(aapl0945?.['Open']).toBe(175.80)

      const msft1000 = result.data.find(
        (row) => row.symbol === 'MSFT' && row.timeBucket === '10:00'
      )
      expect(msft1000?.['Open']).toBe(382.60)
    })

    test('should use max aggregation for High prices', () => {
      const config: PivotConfig = {
        rowFields: ['symbol', 'timeBucket'],
        columnFields: [],
        valueFields: [
          {
            field: 'high',
            aggregation: 'max',
            displayName: 'High',
          },
        ],
        options: {
          showRowTotals: false,
          showColumnTotals: false,
          showGrandTotal: false,
          expandedByDefault: false,
        },
      }

      const result = transformToPivot(marketData, config)

      // Verify High prices
      const googl1015 = result.data.find(
        (row) => row.symbol === 'GOOGL' && row.timeBucket === '10:15'
      )
      expect(googl1015?.['High']).toBe(144.30)

      const tsla0930 = result.data.find(
        (row) => row.symbol === 'TSLA' && row.timeBucket === '09:30'
      )
      expect(tsla0930?.['High']).toBe(251.20)
    })

    test('should use min aggregation for Low prices', () => {
      const config: PivotConfig = {
        rowFields: ['symbol', 'timeBucket'],
        columnFields: [],
        valueFields: [
          {
            field: 'low',
            aggregation: 'min',
            displayName: 'Low',
          },
        ],
        options: {
          showRowTotals: false,
          showColumnTotals: false,
          showGrandTotal: false,
          expandedByDefault: false,
        },
      }

      const result = transformToPivot(marketData, config)

      // Verify Low prices
      const amzn0945 = result.data.find(
        (row) => row.symbol === 'AMZN' && row.timeBucket === '09:45'
      )
      expect(amzn0945?.['Low']).toBe(166.10)
    })

    test('should use last aggregation for Close prices', () => {
      const config: PivotConfig = {
        rowFields: ['symbol', 'timeBucket'],
        columnFields: [],
        valueFields: [
          {
            field: 'close',
            aggregation: 'last',
            displayName: 'Close',
          },
        ],
        options: {
          showRowTotals: false,
          showColumnTotals: false,
          showGrandTotal: false,
          expandedByDefault: false,
        },
      }

      const result = transformToPivot(marketData, config)

      // Verify Close prices
      const aapl1015 = result.data.find(
        (row) => row.symbol === 'AAPL' && row.timeBucket === '10:15'
      )
      expect(aapl1015?.['Close']).toBe(176.90)
    })
  })

  describe('Scenario 2: Aggregated OHLC by Symbol (Daily Candle)', () => {
    test('should aggregate OHLC across all time periods for each symbol', () => {
      // ARRANGE: Configure pivot to create daily OHLC candle for each symbol
      const config: PivotConfig = {
        rowFields: ['symbol'],
        columnFields: [],
        valueFields: [
          {
            field: 'open',
            aggregation: 'first',
            displayName: 'Day Open',
          },
          {
            field: 'high',
            aggregation: 'max',
            displayName: 'Day High',
          },
          {
            field: 'low',
            aggregation: 'min',
            displayName: 'Day Low',
          },
          {
            field: 'close',
            aggregation: 'last',
            displayName: 'Day Close',
          },
          {
            field: 'volume',
            aggregation: 'sum',
            displayName: 'Total Volume',
          },
        ],
        options: {
          showRowTotals: false,
          showColumnTotals: false,
          showGrandTotal: false,
          expandedByDefault: false,
        },
      }

      // ACT: Transform raw market data into daily pivot table
      const result = transformToPivot(marketData, config)

      // ASSERT: Verify daily OHLC for each symbol
      expect(result.data).toBeDefined()
      expect(result.data.length).toBe(5) // 5 symbols

      // Verify AAPL daily candle
      const aaplDaily = result.data.find((row) => row.symbol === 'AAPL')
      expect(aaplDaily).toBeDefined()
      expect(aaplDaily?.['Day Open']).toBe(175.50) // First open
      expect(aaplDaily?.['Day High']).toBe(177.20) // Max of all highs
      expect(aaplDaily?.['Day Low']).toBe(175.10) // Min of all lows
      expect(aaplDaily?.['Day Close']).toBe(176.90) // Last close
      expect(aaplDaily?.['Total Volume']).toBe(8000000) // Sum of all volumes
    })

    test('should calculate MSFT daily OHLC correctly', () => {
      const config: PivotConfig = {
        rowFields: ['symbol'],
        columnFields: [],
        valueFields: [
          {
            field: 'open',
            aggregation: 'first',
            displayName: 'Day Open',
          },
          {
            field: 'high',
            aggregation: 'max',
            displayName: 'Day High',
          },
          {
            field: 'low',
            aggregation: 'min',
            displayName: 'Day Low',
          },
          {
            field: 'close',
            aggregation: 'last',
            displayName: 'Day Close',
          },
          {
            field: 'volume',
            aggregation: 'sum',
            displayName: 'Total Volume',
          },
        ],
        options: {
          showRowTotals: false,
          showColumnTotals: false,
          showGrandTotal: false,
          expandedByDefault: false,
        },
      }

      const result = transformToPivot(marketData, config)

      const msftDaily = result.data.find((row) => row.symbol === 'MSFT')
      expect(msftDaily).toBeDefined()
      expect(msftDaily?.['Day Open']).toBe(380.25)
      expect(msftDaily?.['Day High']).toBe(385.00)
      expect(msftDaily?.['Day Low']).toBe(379.80)
      expect(msftDaily?.['Day Close']).toBe(384.25)
      expect(msftDaily?.['Total Volume']).toBe(5200000)
    })

    test('should calculate TSLA daily OHLC correctly (highest volume)', () => {
      const config: PivotConfig = {
        rowFields: ['symbol'],
        columnFields: [],
        valueFields: [
          {
            field: 'open',
            aggregation: 'first',
            displayName: 'Day Open',
          },
          {
            field: 'high',
            aggregation: 'max',
            displayName: 'Day High',
          },
          {
            field: 'low',
            aggregation: 'min',
            displayName: 'Day Low',
          },
          {
            field: 'close',
            aggregation: 'last',
            displayName: 'Day Close',
          },
          {
            field: 'volume',
            aggregation: 'sum',
            displayName: 'Total Volume',
          },
        ],
        options: {
          showRowTotals: false,
          showColumnTotals: false,
          showGrandTotal: false,
          expandedByDefault: false,
        },
      }

      const result = transformToPivot(marketData, config)

      const tslaDaily = result.data.find((row) => row.symbol === 'TSLA')
      expect(tslaDaily).toBeDefined()
      expect(tslaDaily?.['Day Open']).toBe(248.50)
      expect(tslaDaily?.['Day High']).toBe(254.20)
      expect(tslaDaily?.['Day Low']).toBe(247.80)
      expect(tslaDaily?.['Day Close']).toBe(253.50)
      expect(tslaDaily?.['Total Volume']).toBe(28700000) // Highest volume
    })
  })

  describe('Scenario 3: Volume by Time Bucket and Symbol', () => {
    test('should pivot volume by time bucket with symbols as columns', () => {
      // ARRANGE: Configure pivot for Volume by Time Bucket × Symbol
      const config: PivotConfig = {
        rowFields: ['timeBucket'],
        columnFields: ['symbol'],
        valueFields: [
          {
            field: 'volume',
            aggregation: 'sum',
            displayName: 'Volume',
          },
        ],
        options: {
          showRowTotals: true,
          showColumnTotals: true,
          showGrandTotal: true,
          expandedByDefault: false,
        },
      }

      // ACT: Transform raw market data into pivot table
      const result = transformToPivot(marketData, config)

      // ASSERT: Verify pivot data was created
      expect(result.data).toBeDefined()
      expect(result.data.length).toBeGreaterThan(0)
    })

    test('should calculate volume for 09:30 time bucket across all symbols', () => {
      const config: PivotConfig = {
        rowFields: ['timeBucket'],
        columnFields: ['symbol'],
        valueFields: [
          {
            field: 'volume',
            aggregation: 'sum',
            displayName: 'Volume',
          },
        ],
        options: {
          showRowTotals: true,
          showColumnTotals: true,
          showGrandTotal: true,
          expandedByDefault: false,
        },
      }

      const result = transformToPivot(marketData, config)

      // Find 09:30 row
      const bucket0930 = result.data.find((row) => row.timeBucket === '09:30')
      expect(bucket0930).toBeDefined()

      // Verify individual symbol volumes
      expect(bucket0930?.['AAPL__Volume']).toBe(2500000)
      expect(bucket0930?.['MSFT__Volume']).toBe(1500000)
      expect(bucket0930?.['GOOGL__Volume']).toBe(3200000)
      expect(bucket0930?.['AMZN__Volume']).toBe(4500000)
      expect(bucket0930?.['TSLA__Volume']).toBe(8500000)

      // Row total should be 20.2M
      expect(bucket0930?.['__total_Volume']).toBe(20200000)
    })

    test('should calculate column totals for each symbol', () => {
      const config: PivotConfig = {
        rowFields: ['timeBucket'],
        columnFields: ['symbol'],
        valueFields: [
          {
            field: 'volume',
            aggregation: 'sum',
            displayName: 'Volume',
          },
        ],
        options: {
          showRowTotals: true,
          showColumnTotals: true,
          showGrandTotal: true,
          expandedByDefault: false,
        },
      }

      const result = transformToPivot(marketData, config)

      // Find column total row
      const columnTotalRow = result.data.find(
        (row) => row.timeBucket === '__COLUMN_TOTAL__'
      )
      expect(columnTotalRow).toBeDefined()

      // Verify each symbol's total volume
      expect(columnTotalRow?.['AAPL__Volume']).toBe(8000000)
      expect(columnTotalRow?.['MSFT__Volume']).toBe(5200000)
      expect(columnTotalRow?.['GOOGL__Volume']).toBe(10700000)
      expect(columnTotalRow?.['AMZN__Volume']).toBe(15000000)
      expect(columnTotalRow?.['TSLA__Volume']).toBe(28700000)

      // Grand total should be 67.6M
      expect(columnTotalRow?.['__total_Volume']).toBe(67600000)
    })

    test('should show decreasing volume pattern as morning progresses', () => {
      const config: PivotConfig = {
        rowFields: ['timeBucket'],
        columnFields: [],
        valueFields: [
          {
            field: 'volume',
            aggregation: 'sum',
            displayName: 'Total Volume',
          },
        ],
        options: {
          showRowTotals: false,
          showColumnTotals: false,
          showGrandTotal: false,
          expandedByDefault: false,
        },
      }

      const result = transformToPivot(marketData, config)

      // Extract total volumes for each time bucket
      const timeBuckets = ['09:30', '09:45', '10:00', '10:15']
      const volumes = timeBuckets.map((bucket) => {
        const row = result.data.find((r) => r.timeBucket === bucket)
        return row?.['Total Volume'] ?? 0
      })

      // Verify decreasing volume pattern (typical intraday pattern)
      expect(volumes[0]).toBe(20200000) // 09:30 - highest
      expect(volumes[1]).toBe(16800000) // 09:45
      expect(volumes[2]).toBe(16300000) // 10:00
      expect(volumes[3]).toBe(14300000) // 10:15 - lowest

      expect(volumes[0]).toBeGreaterThan(volumes[1])
      expect(volumes[1]).toBeGreaterThan(volumes[2])
      expect(volumes[2]).toBeGreaterThan(volumes[3])
    })
  })

  describe('Scenario 4: Price Range Analysis by Symbol', () => {
    test('should calculate intraday price range for each symbol', () => {
      const config: PivotConfig = {
        rowFields: ['symbol'],
        columnFields: [],
        valueFields: [
          {
            field: 'high',
            aggregation: 'max',
            displayName: 'Day High',
          },
          {
            field: 'low',
            aggregation: 'min',
            displayName: 'Day Low',
          },
        ],
        options: {
          showRowTotals: false,
          showColumnTotals: false,
          showGrandTotal: false,
          expandedByDefault: false,
        },
      }

      const result = transformToPivot(marketData, config)

      // Verify AAPL range
      const aaplRow = result.data.find((row) => row.symbol === 'AAPL')
      expect(aaplRow).toBeDefined()
      expect(aaplRow?.['Day High']).toBe(177.20)
      expect(aaplRow?.['Day Low']).toBe(175.10)
      // Range would be calculated as: 177.20 - 175.10 = 2.10

      // Verify TSLA range (highest volatility)
      const tslaRow = result.data.find((row) => row.symbol === 'TSLA')
      expect(tslaRow).toBeDefined()
      expect(tslaRow?.['Day High']).toBe(254.20)
      expect(tslaRow?.['Day Low']).toBe(247.80)
      // Range would be calculated as: 254.20 - 247.80 = 6.40 (largest range)
    })

    test('should identify TSLA as most volatile symbol', () => {
      const config: PivotConfig = {
        rowFields: ['symbol'],
        columnFields: [],
        valueFields: [
          {
            field: 'high',
            aggregation: 'max',
            displayName: 'Day High',
          },
          {
            field: 'low',
            aggregation: 'min',
            displayName: 'Day Low',
          },
        ],
        options: {
          showRowTotals: false,
          showColumnTotals: false,
          showGrandTotal: false,
          expandedByDefault: false,
        },
      }

      const result = transformToPivot(marketData, config)

      // Calculate range for each symbol
      const ranges = result.data.map((row) => {
        const high = row['Day High'] as number
        const low = row['Day Low'] as number
        return {
          symbol: row.symbol as string,
          range: high - low,
        }
      })

      // TSLA should have the largest range
      const tslaRange = ranges.find((r) => r.symbol === 'TSLA')
      expect(tslaRange?.range).toBeCloseTo(6.40, 2)

      // Verify TSLA has the largest range
      const maxRange = Math.max(...ranges.map((r) => r.range))
      expect(tslaRange?.range).toBe(maxRange)
    })
  })
})
