/**
 * Pivot Table Scenarios
 *
 * Configuration for pre-defined pivot table scenarios with finance examples
 */

import type { PivotConfig } from './schemas'

export interface ScenarioConfig {
  id: string
  title: string
  description: string
  category: 'finance' | 'general'
  businessValue?: string // Business value/use case for this configuration
  defaultConfig: PivotConfig
}

export const scenarios: Record<string, ScenarioConfig> = {
  'market-data': {
    id: 'market-data',
    title: 'Market Data OHLC Analysis',
    description: 'Intraday OHLC (Open, High, Low, Close) analysis for 5 major tech stocks across 4 time periods',
    category: 'finance',
    businessValue: 'Algorithmic Trading Timing Strategy - Identify optimal execution times by comparing all stocks side-by-side at each time bucket. Reveals liquidity patterns and enables VWAP execution calibration.',
    defaultConfig: {
      rowFields: [],
      columnFields: [],
      valueFields: [
        {
          field: 'volume',
          aggregation: 'sum',
          displayName: 'Volume',
        },
        {
          field: 'close',
          aggregation: 'last',
          displayName: 'Last Price',
        },
        {
          field: 'vwap',
          aggregation: 'avg',
          displayName: 'VWAP',
        },
      ],
      options: {
        expandedByDefault: false,
        showRowTotals: false,
        showColumnTotals: false,
        showGrandTotal: false,
      },
    },
  },

  'trading-pnl': {
    id: 'trading-pnl',
    title: 'Trading Desk P&L Analysis',
    description: 'Profit & Loss analysis across 3 trading desks (Equities, Fixed Income, FX) with 7 traders and 15 trades',
    category: 'finance',
    businessValue: 'Risk Management & Capital Allocation - Exposes instrument-level concentration risks across trading desks. Identifies which securities drive firm profitability and enables position limit optimization.',
    defaultConfig: {
      rowFields: [],
      columnFields: [],
      valueFields: [
        {
          field: 'pnl',
          aggregation: 'sum',
          displayName: 'Total P&L',
        },
        {
          field: 'pnl',
          aggregation: 'count',
          displayName: 'Trade Count',
        },
        {
          field: 'pnl',
          aggregation: 'avg',
          displayName: 'Avg P&L',
        },
      ],
      options: {
        expandedByDefault: false,
        showRowTotals: false,
        showColumnTotals: false,
        showGrandTotal: false,
      },
    },
  },

  'bond-portfolio': {
    id: 'bond-portfolio',
    title: 'Bond Portfolio Analysis',
    description: 'Fixed income portfolio analysis across 3 portfolios (Conservative, Balanced, Aggressive) with 12 bonds',
    category: 'finance',
    businessValue: 'Laddered Portfolio Rebalancing - Reveals duration/credit quality distribution through maturity×rating matrix. Identifies rating gaps and enables yield optimization while managing interest rate risk.',
    defaultConfig: {
      rowFields: [],
      columnFields: [],
      valueFields: [
        {
          field: 'marketValue',
          aggregation: 'sum',
          displayName: 'Market Value',
        },
        {
          field: 'bondId',
          aggregation: 'count',
          displayName: 'Bond Count',
        },
        {
          field: 'ytm',
          aggregation: 'avg',
          displayName: 'Avg YTM',
        },
      ],
      options: {
        expandedByDefault: false,
        showRowTotals: false,
        showColumnTotals: false,
        showGrandTotal: false,
      },
    },
  },

  'options-greeks': {
    id: 'options-greeks',
    title: 'Options Portfolio Greeks',
    description: 'Options portfolio risk analysis across 4 strategies with delta, gamma, vega, and theta exposure',
    category: 'finance',
    businessValue: 'Options Risk Management & Vega Hedging - Exposes underlying-specific Greek concentrations by strategy. Detects volatility clustering and enables targeted hedging of single-name exposure.',
    defaultConfig: {
      rowFields: [],
      columnFields: [],
      valueFields: [
        {
          field: 'delta',
          aggregation: 'sum',
          displayName: 'Net Delta',
        },
        {
          field: 'vega',
          aggregation: 'sum',
          displayName: 'Net Vega',
        },
        {
          field: 'impliedVol',
          aggregation: 'avg',
          displayName: 'Avg IV',
        },
        {
          field: 'contracts',
          aggregation: 'sum',
          displayName: 'Contracts',
        },
      ],
      options: {
        expandedByDefault: false,
        showRowTotals: false,
        showColumnTotals: false,
        showGrandTotal: false,
      },
    },
  },

  'risk-var': {
    id: 'risk-var',
    title: 'Risk Management (VaR)',
    description: 'Portfolio Value-at-Risk analysis across 4 asset classes and 3 regions with 15 positions',
    category: 'finance',
    businessValue: 'Portfolio Risk Optimization & Geographic Rebalancing - Creates risk heat map by asset class×region. Reveals geographic concentration and enables optimization of risk-adjusted allocations.',
    defaultConfig: {
      rowFields: [],
      columnFields: [],
      valueFields: [
        {
          field: 'marketValue',
          aggregation: 'sum',
          displayName: 'Market Value',
        },
        {
          field: 'var95',
          aggregation: 'sum',
          displayName: 'VaR 95%',
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
    },
  },
}

export const defaultScenario = 'market-data'

export function getScenario(id: string | null): ScenarioConfig {
  if (!id || !scenarios[id]) {
    return scenarios[defaultScenario]
  }
  return scenarios[id]
}

export function getAllScenarios(): ScenarioConfig[] {
  return Object.values(scenarios)
}
