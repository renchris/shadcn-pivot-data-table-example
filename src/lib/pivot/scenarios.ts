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
  defaultConfig: PivotConfig
}

export const scenarios: Record<string, ScenarioConfig> = {
  'market-data': {
    id: 'market-data',
    title: 'Market Data OHLC Analysis',
    description: 'Intraday OHLC (Open, High, Low, Close) analysis for 5 major tech stocks across 4 time periods',
    category: 'finance',
    defaultConfig: {
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
      },
    },
  },

  'trading-pnl': {
    id: 'trading-pnl',
    title: 'Trading Desk P&L Analysis',
    description: 'Profit & Loss analysis across 3 trading desks (Equities, Fixed Income, FX) with 7 traders and 15 trades',
    category: 'finance',
    defaultConfig: {
      rowFields: ['desk', 'trader'],
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
        showRowTotals: true,
        showColumnTotals: false,
        showGrandTotal: true,
      },
    },
  },

  'bond-portfolio': {
    id: 'bond-portfolio',
    title: 'Bond Portfolio Analysis',
    description: 'Fixed income portfolio analysis across 3 portfolios (Conservative, Balanced, Aggressive) with 12 bonds',
    category: 'finance',
    defaultConfig: {
      rowFields: ['portfolio', 'sector'],
      columnFields: [],
      valueFields: [
        {
          field: 'marketValue',
          aggregation: 'sum',
          displayName: 'Total Market Value',
        },
        {
          field: 'duration',
          aggregation: 'avg',
          displayName: 'Avg Duration',
        },
        {
          field: 'ytm',
          aggregation: 'avg',
          displayName: 'Avg YTM',
        },
      ],
      options: {
        showRowTotals: true,
        showColumnTotals: false,
        showGrandTotal: true,
      },
    },
  },

  'options-greeks': {
    id: 'options-greeks',
    title: 'Options Portfolio Greeks',
    description: 'Options portfolio risk analysis across 4 strategies with delta, gamma, vega, and theta exposure',
    category: 'finance',
    defaultConfig: {
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
          field: 'theta',
          aggregation: 'sum',
          displayName: 'Total Theta',
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
      },
    },
  },

  'risk-var': {
    id: 'risk-var',
    title: 'Risk Management (VaR)',
    description: 'Portfolio Value-at-Risk analysis across 4 asset classes and 3 regions with 15 positions',
    category: 'finance',
    defaultConfig: {
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
        {
          field: 'volatility',
          aggregation: 'avg',
          displayName: 'Avg Volatility',
        },
      ],
      options: {
        showRowTotals: true,
        showColumnTotals: false,
        showGrandTotal: true,
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
