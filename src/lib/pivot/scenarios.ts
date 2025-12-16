/**
 * Pivot Table Scenarios
 *
 * Configuration for pre-defined pivot table scenarios with finance examples
 */

import type { PivotConfig } from './schemas'

/**
 * Optimal configuration option for guided setup
 * Each scenario can have multiple recommended configurations
 */
export interface OptimalConfigOption {
  id: string                    // e.g., 'hierarchical', 'heatmap'
  label: string                 // e.g., 'Hierarchical Analysis', 'Volume Heatmap'
  rowFields: string[]
  columnFields: string[]
  description: string           // What this config reveals
  achievementMessage: string    // Shown when user matches this config
}

export interface ScenarioConfig {
  id: string
  title: string
  description: string
  category: 'finance' | 'general'
  businessValue?: string // Business value/use case for this configuration
  defaultConfig: PivotConfig
  optimalConfigs: OptimalConfigOption[] // Recommended configurations for guided setup
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
    optimalConfigs: [
      {
        id: 'hierarchical',
        label: 'Hierarchical Stock Analysis',
        rowFields: ['symbol', 'timeBucket'],
        columnFields: [],
        description: 'OHLC patterns by time period within each stock',
        achievementMessage: 'Identify optimal execution times to minimize market impact. AAPL has consistent 600K volume per period (stable liquidity).',
      },
      {
        id: 'heatmap',
        label: 'Volume Heatmap',
        rowFields: ['timeBucket'],
        columnFields: ['symbol'],
        description: 'Compare liquidity across all stocks side-by-side',
        achievementMessage: 'TSLA highest volume (most liquid) - best for large orders. GOOGL lowest volume (harder to execute without moving market).',
      },
    ],
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
    optimalConfigs: [
      {
        id: 'desk-analysis',
        label: 'Desk Performance Analysis',
        rowFields: ['desk', 'trader'],
        columnFields: [],
        description: 'P&L breakdown by desk and trader hierarchy',
        achievementMessage: 'Top performer: Carol Wong (Fixed Income) - $22.5K avg. Action: Increase position limits for proven efficiency.',
      },
      {
        id: 'concentration',
        label: 'Instrument Concentration Risk',
        rowFields: ['instrument'],
        columnFields: ['trader'],
        description: 'Reveals which traders trade which instruments',
        achievementMessage: 'EUR/USD concentration risk exposed (33% of FX desk). Action: Implement position limits per instrument per desk.',
      },
    ],
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
    optimalConfigs: [
      {
        id: 'allocation',
        label: 'Portfolio Allocation',
        rowFields: ['portfolio', 'sector'],
        columnFields: [],
        description: 'Sector allocation within each portfolio',
        achievementMessage: 'Sector allocation matches strategy. Conservative: 61% Government, Aggressive: 100% Corporate (maximum risk/return).',
      },
      {
        id: 'ladder-matrix',
        label: 'Maturity × Rating Ladder',
        rowFields: ['maturityBucket'],
        columnFields: ['rating'],
        description: 'Critical for rebalancing - shows duration/credit distribution',
        achievementMessage: 'Gap identified: No AAA/AA+ bonds in 10Y+ bucket. Duration/credit mismatch - sell BB-rated 10Y+ bonds, buy AAA 10Y+.',
      },
    ],
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
    optimalConfigs: [
      {
        id: 'single-name',
        label: 'Single-Name Risk Concentration',
        rowFields: ['underlying'],
        columnFields: [],
        description: 'Greek exposure per underlying stock',
        achievementMessage: 'TSLA concentration risk: +300 delta (61% of directional risk), 42.5% IV. Action: Buy SPY puts to hedge, sell TSLA calls.',
      },
      {
        id: 'calendar-risk',
        label: 'Strategy × Expiry Calendar',
        rowFields: ['strategy'],
        columnFields: ['expiryBucket'],
        description: 'Shows time-based risk by strategy',
        achievementMessage: 'Front-month heavy: 145 contracts expiring in 1 month (38.7%). Roll Protective Puts to maintain downside protection.',
      },
    ],
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
    optimalConfigs: [
      {
        id: 'breakdown',
        label: 'Asset Class Risk Breakdown',
        rowFields: ['assetClass', 'region'],
        columnFields: [],
        description: 'VaR by asset class and region hierarchy',
        achievementMessage: 'Americas concentration: 49.3% of total risk. Equities Americas = 25.8% VaR - single largest risk bucket needs rebalancing.',
      },
      {
        id: 'geo-heatmap',
        label: 'Geographic Risk Heatmap',
        rowFields: ['assetClass'],
        columnFields: ['region'],
        description: 'Risk heatmap reveals concentration hotspots',
        achievementMessage: 'Americas Equities hotspot identified ($1.58M VaR). Increase Asia allocation for diversification benefit.',
      },
    ],
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
