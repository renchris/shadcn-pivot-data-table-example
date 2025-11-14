/**
 * Options Portfolio Greeks - Test Data Fixture
 *
 * Scenario: Options trading desk managing various strategies
 * - 4 Strategies: Covered Call, Protective Put, Iron Condor, Straddle
 * - Multiple expiration dates
 * - Tracking Greeks: Delta, Gamma, Vega, Theta
 * - 20 total option positions
 */

export interface OptionsData {
  positionId: string
  strategy: string
  underlying: string
  optionType: 'Call' | 'Put'
  strike: number
  expiry: string
  expiryBucket: string
  contracts: number
  premium: number
  delta: number
  gamma: number
  vega: number
  theta: number
  impliedVol: number
}

export const optionsData: OptionsData[] = [
  // Covered Call Strategy - SPY
  {
    positionId: 'OPT001',
    strategy: 'Covered Call',
    underlying: 'SPY',
    optionType: 'Call',
    strike: 480,
    expiry: '2025-02-28',
    expiryBucket: '1M',
    contracts: 100,
    premium: 2.50,
    delta: -0.35,
    gamma: 0.015,
    vega: 0.08,
    theta: -0.05,
    impliedVol: 18.5,
  },
  {
    positionId: 'OPT002',
    strategy: 'Covered Call',
    underlying: 'QQQ',
    optionType: 'Call',
    strike: 420,
    expiry: '2025-02-28',
    expiryBucket: '1M',
    contracts: 50,
    premium: 3.20,
    delta: -0.42,
    gamma: 0.018,
    vega: 0.12,
    theta: -0.08,
    impliedVol: 22.3,
  },
  {
    positionId: 'OPT003',
    strategy: 'Covered Call',
    underlying: 'IWM',
    optionType: 'Call',
    strike: 220,
    expiry: '2025-03-31',
    expiryBucket: '2M',
    contracts: 75,
    premium: 1.80,
    delta: -0.28,
    gamma: 0.012,
    vega: 0.06,
    theta: -0.04,
    impliedVol: 20.1,
  },

  // Protective Put Strategy - Tech Stocks
  {
    positionId: 'OPT004',
    strategy: 'Protective Put',
    underlying: 'AAPL',
    optionType: 'Put',
    strike: 170,
    expiry: '2025-03-31',
    expiryBucket: '2M',
    contracts: 200,
    premium: 4.50,
    delta: 0.25,
    gamma: 0.020,
    vega: 0.15,
    theta: -0.06,
    impliedVol: 25.8,
  },
  {
    positionId: 'OPT005',
    strategy: 'Protective Put',
    underlying: 'MSFT',
    optionType: 'Put',
    strike: 400,
    expiry: '2025-04-30',
    expiryBucket: '3M',
    contracts: 150,
    premium: 6.75,
    delta: 0.30,
    gamma: 0.025,
    vega: 0.20,
    theta: -0.10,
    impliedVol: 28.4,
  },
  {
    positionId: 'OPT006',
    strategy: 'Protective Put',
    underlying: 'GOOGL',
    optionType: 'Put',
    strike: 140,
    expiry: '2025-03-31',
    expiryBucket: '2M',
    contracts: 100,
    premium: 3.25,
    delta: 0.22,
    gamma: 0.016,
    vega: 0.10,
    theta: -0.05,
    impliedVol: 23.7,
  },
  {
    positionId: 'OPT007',
    strategy: 'Protective Put',
    underlying: 'NVDA',
    optionType: 'Put',
    strike: 850,
    expiry: '2025-04-30',
    expiryBucket: '3M',
    contracts: 80,
    premium: 12.50,
    delta: 0.35,
    gamma: 0.030,
    vega: 0.25,
    theta: -0.15,
    impliedVol: 35.2,
  },

  // Iron Condor Strategy - Index Options
  {
    positionId: 'OPT008',
    strategy: 'Iron Condor',
    underlying: 'SPX',
    optionType: 'Put',
    strike: 4700,
    expiry: '2025-02-28',
    expiryBucket: '1M',
    contracts: 20,
    premium: 15.00,
    delta: 0.15,
    gamma: 0.008,
    vega: 0.12,
    theta: -0.25,
    impliedVol: 16.5,
  },
  {
    positionId: 'OPT009',
    strategy: 'Iron Condor',
    underlying: 'SPX',
    optionType: 'Put',
    strike: 4800,
    expiry: '2025-02-28',
    expiryBucket: '1M',
    contracts: -20,
    premium: -8.50,
    delta: -0.08,
    gamma: -0.005,
    vega: -0.08,
    theta: 0.18,
    impliedVol: 16.5,
  },
  {
    positionId: 'OPT010',
    strategy: 'Iron Condor',
    underlying: 'SPX',
    optionType: 'Call',
    strike: 5100,
    expiry: '2025-02-28',
    expiryBucket: '1M',
    contracts: -20,
    premium: -9.25,
    delta: 0.10,
    gamma: -0.006,
    vega: -0.09,
    theta: 0.20,
    impliedVol: 16.5,
  },
  {
    positionId: 'OPT011',
    strategy: 'Iron Condor',
    underlying: 'SPX',
    optionType: 'Call',
    strike: 5200,
    expiry: '2025-02-28',
    expiryBucket: '1M',
    contracts: 20,
    premium: 4.75,
    delta: -0.05,
    gamma: 0.003,
    vega: 0.05,
    theta: -0.12,
    impliedVol: 16.5,
  },

  // Straddle Strategy - Earnings Plays
  {
    positionId: 'OPT012',
    strategy: 'Straddle',
    underlying: 'TSLA',
    optionType: 'Call',
    strike: 250,
    expiry: '2025-03-31',
    expiryBucket: '2M',
    contracts: 50,
    premium: 18.50,
    delta: 0.50,
    gamma: 0.035,
    vega: 0.30,
    theta: -0.20,
    impliedVol: 45.8,
  },
  {
    positionId: 'OPT013',
    strategy: 'Straddle',
    underlying: 'TSLA',
    optionType: 'Put',
    strike: 250,
    expiry: '2025-03-31',
    expiryBucket: '2M',
    contracts: 50,
    premium: 17.25,
    delta: -0.50,
    gamma: 0.035,
    vega: 0.30,
    theta: -0.20,
    impliedVol: 45.8,
  },
  {
    positionId: 'OPT014',
    strategy: 'Straddle',
    underlying: 'NFLX',
    optionType: 'Call',
    strike: 650,
    expiry: '2025-04-30',
    expiryBucket: '3M',
    contracts: 30,
    premium: 25.00,
    delta: 0.52,
    gamma: 0.028,
    vega: 0.35,
    theta: -0.18,
    impliedVol: 38.6,
  },
  {
    positionId: 'OPT015',
    strategy: 'Straddle',
    underlying: 'NFLX',
    optionType: 'Put',
    strike: 650,
    expiry: '2025-04-30',
    expiryBucket: '3M',
    contracts: 30,
    premium: 24.50,
    delta: -0.48,
    gamma: 0.028,
    vega: 0.35,
    theta: -0.18,
    impliedVol: 38.6,
  },
  {
    positionId: 'OPT016',
    strategy: 'Straddle',
    underlying: 'AMD',
    optionType: 'Call',
    strike: 140,
    expiry: '2025-02-28',
    expiryBucket: '1M',
    contracts: 40,
    premium: 8.75,
    delta: 0.48,
    gamma: 0.032,
    vega: 0.22,
    theta: -0.15,
    impliedVol: 42.3,
  },
  {
    positionId: 'OPT017',
    strategy: 'Straddle',
    underlying: 'AMD',
    optionType: 'Put',
    strike: 140,
    expiry: '2025-02-28',
    expiryBucket: '1M',
    contracts: 40,
    premium: 8.25,
    delta: -0.52,
    gamma: 0.032,
    vega: 0.22,
    theta: -0.15,
    impliedVol: 42.3,
  },

  // Additional Covered Calls
  {
    positionId: 'OPT018',
    strategy: 'Covered Call',
    underlying: 'SPY',
    optionType: 'Call',
    strike: 485,
    expiry: '2025-04-30',
    expiryBucket: '3M',
    contracts: 120,
    premium: 4.50,
    delta: -0.40,
    gamma: 0.020,
    vega: 0.15,
    theta: -0.08,
    impliedVol: 19.2,
  },
  {
    positionId: 'OPT019',
    strategy: 'Covered Call',
    underlying: 'DIA',
    optionType: 'Call',
    strike: 430,
    expiry: '2025-03-31',
    expiryBucket: '2M',
    contracts: 60,
    premium: 2.80,
    delta: -0.32,
    gamma: 0.014,
    vega: 0.09,
    theta: -0.06,
    impliedVol: 17.8,
  },

  // Additional Iron Condor
  {
    positionId: 'OPT020',
    strategy: 'Iron Condor',
    underlying: 'NDX',
    optionType: 'Put',
    strike: 16000,
    expiry: '2025-03-31',
    expiryBucket: '2M',
    contracts: 10,
    premium: 20.00,
    delta: 0.12,
    gamma: 0.006,
    vega: 0.10,
    theta: -0.22,
    impliedVol: 18.9,
  },
]

/**
 * Expected Greeks by Strategy and Expiry (Sum aggregation)
 *
 * Pivot: Rows = [Strategy, Expiry Bucket], Values = [Delta, Gamma, Vega (sum)]
 */
export const expectedGreeksByStrategyExpiry = {
  rows: [
    {
      strategy: 'Covered Call',
      expiryBucket: '1M',
      totalDelta: -0.77, // OPT001 + OPT002
      totalGamma: 0.033,
      totalVega: 0.20,
      contracts: 150,
    },
    {
      strategy: 'Covered Call',
      expiryBucket: '2M',
      totalDelta: -0.60, // OPT003 + OPT019
      totalGamma: 0.026,
      totalVega: 0.15,
      contracts: 135,
    },
    {
      strategy: 'Covered Call',
      expiryBucket: '3M',
      totalDelta: -0.40, // OPT018
      totalGamma: 0.020,
      totalVega: 0.15,
      contracts: 120,
    },
    {
      strategy: 'Protective Put',
      expiryBucket: '2M',
      totalDelta: 0.47, // OPT004 + OPT006
      totalGamma: 0.036,
      totalVega: 0.25,
      contracts: 300,
    },
    {
      strategy: 'Protective Put',
      expiryBucket: '3M',
      totalDelta: 0.65, // OPT005 + OPT007
      totalGamma: 0.055,
      totalVega: 0.45,
      contracts: 230,
    },
  ],
}

/**
 * Expected Net Greeks by Underlying (Sum aggregation)
 *
 * Pivot: Rows = [Underlying], Values = [Delta, Gamma, Vega, Theta (sum)]
 */
export const expectedGreeksByUnderlying = {
  rows: [
    {
      underlying: 'SPY',
      netDelta: -0.75, // OPT001 + OPT018
      netGamma: 0.035,
      netVega: 0.23,
      netTheta: -0.13,
    },
    {
      underlying: 'TSLA',
      netDelta: 0.00, // OPT012 (0.50) + OPT013 (-0.50) = 0
      netGamma: 0.070,
      netVega: 0.60,
      netTheta: -0.40,
    },
    {
      underlying: 'SPX',
      netDelta: 0.12, // Iron Condor net
      netGamma: 0.000,
      netVega: 0.00,
      netTheta: 0.01, // Iron Condor has slight positive theta (time decay benefit)
    },
  ],
}

/**
 * Expected Contracts by Strategy and Option Type
 *
 * Pivot: Rows = [Strategy], Columns = [Option Type], Values = [Contracts (sum)]
 */
export const expectedContractsByStrategyType = {
  rows: [
    {
      strategy: 'Covered Call',
      Call: 405, // Sum of all covered call contracts
      Put: 0,
      total: 405,
    },
    {
      strategy: 'Protective Put',
      Call: 0,
      Put: 530, // Sum of all protective put contracts
      total: 530,
    },
    {
      strategy: 'Iron Condor',
      Call: 0, // Net of long and short
      Put: 10, // Net of long and short
      total: 10,
    },
    {
      strategy: 'Straddle',
      Call: 120, // OPT012 + OPT014 + OPT016
      Put: 120, // OPT013 + OPT015 + OPT017
      total: 240,
    },
  ],
}

/**
 * Expected Implied Volatility Statistics by Strategy
 *
 * Pivot: Rows = [Strategy], Values = [IV (min, max, avg)]
 */
export const expectedIVStatsByStrategy = {
  rows: [
    {
      strategy: 'Covered Call',
      minIV: 17.8,
      maxIV: 22.3,
      avgIV: 19.58, // Average of all covered call IVs
    },
    {
      strategy: 'Protective Put',
      minIV: 23.7,
      maxIV: 35.2,
      avgIV: 28.275, // Average of all protective put IVs
    },
    {
      strategy: 'Iron Condor',
      minIV: 16.5,
      maxIV: 18.9,
      avgIV: 17.18, // Average of all iron condor IVs
    },
    {
      strategy: 'Straddle',
      minIV: 38.6,
      maxIV: 45.8,
      avgIV: 42.23, // Average of all straddle IVs
    },
  ],
}
