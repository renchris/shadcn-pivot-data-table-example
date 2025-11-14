/**
 * Market Data Analysis - Test Data Fixture
 *
 * Scenario: Intraday OHLC market data analysis
 * - 5 Symbols: AAPL, MSFT, GOOGL, AMZN, TSLA
 * - 4 Time Periods per symbol (15-minute intervals)
 * - OHLC (Open, High, Low, Close) prices
 * - Volume data
 * - 20 total market data points
 */

export interface MarketData {
  tickId: string
  symbol: string
  timestamp: string
  timeBucket: string
  open: number
  high: number
  low: number
  close: number
  volume: number
  vwap: number
}

export const marketData: MarketData[] = [
  // AAPL - 4 time periods
  {
    tickId: 'TICK001',
    symbol: 'AAPL',
    timestamp: '2025-01-15T09:30:00Z',
    timeBucket: '09:30',
    open: 175.50,
    high: 176.25,
    low: 175.10,
    close: 175.80,
    volume: 2500000,
    vwap: 175.65,
  },
  {
    tickId: 'TICK002',
    symbol: 'AAPL',
    timestamp: '2025-01-15T09:45:00Z',
    timeBucket: '09:45',
    open: 175.80,
    high: 176.50,
    low: 175.60,
    close: 176.30,
    volume: 1800000,
    vwap: 176.10,
  },
  {
    tickId: 'TICK003',
    symbol: 'AAPL',
    timestamp: '2025-01-15T10:00:00Z',
    timeBucket: '10:00',
    open: 176.30,
    high: 177.00,
    low: 176.15,
    close: 176.85,
    volume: 2100000,
    vwap: 176.60,
  },
  {
    tickId: 'TICK004',
    symbol: 'AAPL',
    timestamp: '2025-01-15T10:15:00Z',
    timeBucket: '10:15',
    open: 176.85,
    high: 177.20,
    low: 176.50,
    close: 176.90,
    volume: 1600000,
    vwap: 176.85,
  },

  // MSFT - 4 time periods
  {
    tickId: 'TICK005',
    symbol: 'MSFT',
    timestamp: '2025-01-15T09:30:00Z',
    timeBucket: '09:30',
    open: 380.25,
    high: 382.50,
    low: 379.80,
    close: 381.75,
    volume: 1500000,
    vwap: 381.10,
  },
  {
    tickId: 'TICK006',
    symbol: 'MSFT',
    timestamp: '2025-01-15T09:45:00Z',
    timeBucket: '09:45',
    open: 381.75,
    high: 383.00,
    low: 381.50,
    close: 382.60,
    volume: 1200000,
    vwap: 382.20,
  },
  {
    tickId: 'TICK007',
    symbol: 'MSFT',
    timestamp: '2025-01-15T10:00:00Z',
    timeBucket: '10:00',
    open: 382.60,
    high: 384.20,
    low: 382.40,
    close: 383.90,
    volume: 1400000,
    vwap: 383.30,
  },
  {
    tickId: 'TICK008',
    symbol: 'MSFT',
    timestamp: '2025-01-15T10:15:00Z',
    timeBucket: '10:15',
    open: 383.90,
    high: 385.00,
    low: 383.50,
    close: 384.25,
    volume: 1100000,
    vwap: 384.10,
  },

  // GOOGL - 4 time periods
  {
    tickId: 'TICK009',
    symbol: 'GOOGL',
    timestamp: '2025-01-15T09:30:00Z',
    timeBucket: '09:30',
    open: 142.80,
    high: 143.50,
    low: 142.60,
    close: 143.20,
    volume: 3200000,
    vwap: 143.05,
  },
  {
    tickId: 'TICK010',
    symbol: 'GOOGL',
    timestamp: '2025-01-15T09:45:00Z',
    timeBucket: '09:45',
    open: 143.20,
    high: 143.80,
    low: 143.00,
    close: 143.60,
    volume: 2800000,
    vwap: 143.40,
  },
  {
    tickId: 'TICK011',
    symbol: 'GOOGL',
    timestamp: '2025-01-15T10:00:00Z',
    timeBucket: '10:00',
    open: 143.60,
    high: 144.10,
    low: 143.40,
    close: 143.85,
    volume: 2500000,
    vwap: 143.75,
  },
  {
    tickId: 'TICK012',
    symbol: 'GOOGL',
    timestamp: '2025-01-15T10:15:00Z',
    timeBucket: '10:15',
    open: 143.85,
    high: 144.30,
    low: 143.70,
    close: 144.00,
    volume: 2200000,
    vwap: 144.00,
  },

  // AMZN - 4 time periods
  {
    tickId: 'TICK013',
    symbol: 'AMZN',
    timestamp: '2025-01-15T09:30:00Z',
    timeBucket: '09:30',
    open: 165.50,
    high: 166.80,
    low: 165.20,
    close: 166.40,
    volume: 4500000,
    vwap: 166.10,
  },
  {
    tickId: 'TICK014',
    symbol: 'AMZN',
    timestamp: '2025-01-15T09:45:00Z',
    timeBucket: '09:45',
    open: 166.40,
    high: 167.20,
    low: 166.10,
    close: 166.90,
    volume: 3800000,
    vwap: 166.65,
  },
  {
    tickId: 'TICK015',
    symbol: 'AMZN',
    timestamp: '2025-01-15T10:00:00Z',
    timeBucket: '10:00',
    open: 166.90,
    high: 167.60,
    low: 166.70,
    close: 167.35,
    volume: 3500000,
    vwap: 167.15,
  },
  {
    tickId: 'TICK016',
    symbol: 'AMZN',
    timestamp: '2025-01-15T10:15:00Z',
    timeBucket: '10:15',
    open: 167.35,
    high: 168.00,
    low: 167.20,
    close: 167.75,
    volume: 3200000,
    vwap: 167.60,
  },

  // TSLA - 4 time periods
  {
    tickId: 'TICK017',
    symbol: 'TSLA',
    timestamp: '2025-01-15T09:30:00Z',
    timeBucket: '09:30',
    open: 248.50,
    high: 251.20,
    low: 247.80,
    close: 250.60,
    volume: 8500000,
    vwap: 249.80,
  },
  {
    tickId: 'TICK018',
    symbol: 'TSLA',
    timestamp: '2025-01-15T09:45:00Z',
    timeBucket: '09:45',
    open: 250.60,
    high: 252.40,
    low: 250.20,
    close: 251.80,
    volume: 7200000,
    vwap: 251.20,
  },
  {
    tickId: 'TICK019',
    symbol: 'TSLA',
    timestamp: '2025-01-15T10:00:00Z',
    timeBucket: '10:00',
    open: 251.80,
    high: 253.50,
    low: 251.50,
    close: 252.90,
    volume: 6800000,
    vwap: 252.45,
  },
  {
    tickId: 'TICK020',
    symbol: 'TSLA',
    timestamp: '2025-01-15T10:15:00Z',
    timeBucket: '10:15',
    open: 252.90,
    high: 254.20,
    low: 252.60,
    close: 253.50,
    volume: 6200000,
    vwap: 253.30,
  },
]

/**
 * Expected OHLC by Symbol and Time Bucket
 *
 * Pivot: Rows = [Symbol, Time Bucket], Values = [Open (first), High (max), Low (min), Close (last)]
 */
export const expectedOHLCBySymbolTime = {
  rows: [
    {
      symbol: 'AAPL',
      timeBucket: '09:30',
      open: 175.50,
      high: 176.25,
      low: 175.10,
      close: 175.80,
      volume: 2500000,
    },
    {
      symbol: 'AAPL',
      timeBucket: '09:45',
      open: 175.80,
      high: 176.50,
      low: 175.60,
      close: 176.30,
      volume: 1800000,
    },
    {
      symbol: 'AAPL',
      timeBucket: '10:00',
      open: 176.30,
      high: 177.00,
      low: 176.15,
      close: 176.85,
      volume: 2100000,
    },
    {
      symbol: 'AAPL',
      timeBucket: '10:15',
      open: 176.85,
      high: 177.20,
      low: 176.50,
      close: 176.90,
      volume: 1600000,
    },
  ],
}

/**
 * Expected Aggregated OHLC by Symbol (across all time periods)
 *
 * Pivot: Rows = [Symbol], Values = [Open (first), High (max), Low (min), Close (last), Volume (sum)]
 */
export const expectedAggregatedOHLCBySymbol = {
  rows: [
    {
      symbol: 'AAPL',
      open: 175.50, // First open of the day
      high: 177.20, // Max of all highs
      low: 175.10, // Min of all lows
      close: 176.90, // Last close
      totalVolume: 8000000, // Sum: 2.5M + 1.8M + 2.1M + 1.6M
    },
    {
      symbol: 'MSFT',
      open: 380.25,
      high: 385.00,
      low: 379.80,
      close: 384.25,
      totalVolume: 5200000, // Sum: 1.5M + 1.2M + 1.4M + 1.1M
    },
    {
      symbol: 'GOOGL',
      open: 142.80,
      high: 144.30,
      low: 142.60,
      close: 144.00,
      totalVolume: 10700000, // Sum: 3.2M + 2.8M + 2.5M + 2.2M
    },
    {
      symbol: 'AMZN',
      open: 165.50,
      high: 168.00,
      low: 165.20,
      close: 167.75,
      totalVolume: 15000000, // Sum: 4.5M + 3.8M + 3.5M + 3.2M
    },
    {
      symbol: 'TSLA',
      open: 248.50,
      high: 254.20,
      low: 247.80,
      close: 253.50,
      totalVolume: 28700000, // Sum: 8.5M + 7.2M + 6.8M + 6.2M
    },
  ],
}

/**
 * Expected Volume by Time Bucket and Symbol
 *
 * Pivot: Rows = [Time Bucket], Columns = [Symbol], Values = [Volume (sum)]
 */
export const expectedVolumeByTimeBucketSymbol = {
  rows: [
    {
      timeBucket: '09:30',
      AAPL: 2500000,
      MSFT: 1500000,
      GOOGL: 3200000,
      AMZN: 4500000,
      TSLA: 8500000,
      total: 20200000,
    },
    {
      timeBucket: '09:45',
      AAPL: 1800000,
      MSFT: 1200000,
      GOOGL: 2800000,
      AMZN: 3800000,
      TSLA: 7200000,
      total: 16800000,
    },
    {
      timeBucket: '10:00',
      AAPL: 2100000,
      MSFT: 1400000,
      GOOGL: 2500000,
      AMZN: 3500000,
      TSLA: 6800000,
      total: 16300000,
    },
    {
      timeBucket: '10:15',
      AAPL: 1600000,
      MSFT: 1100000,
      GOOGL: 2200000,
      AMZN: 3200000,
      TSLA: 6200000,
      total: 14300000,
    },
  ],
  columnTotals: {
    AAPL: 8000000,
    MSFT: 5200000,
    GOOGL: 10700000,
    AMZN: 15000000,
    TSLA: 28700000,
    grandTotal: 67600000,
  },
}

/**
 * Expected Price Range Analysis by Symbol
 *
 * Pivot: Rows = [Symbol], Values = [High (max), Low (min), Range (calculated)]
 */
export const expectedPriceRangeBySymbol = {
  rows: [
    {
      symbol: 'AAPL',
      dayHigh: 177.20,
      dayLow: 175.10,
      range: 2.10,
      rangePercent: 1.20,
    },
    {
      symbol: 'MSFT',
      dayHigh: 385.00,
      dayLow: 379.80,
      range: 5.20,
      rangePercent: 1.37,
    },
    {
      symbol: 'GOOGL',
      dayHigh: 144.30,
      dayLow: 142.60,
      range: 1.70,
      rangePercent: 1.19,
    },
    {
      symbol: 'AMZN',
      dayHigh: 168.00,
      dayLow: 165.20,
      range: 2.80,
      rangePercent: 1.69,
    },
    {
      symbol: 'TSLA',
      dayHigh: 254.20,
      dayLow: 247.80,
      range: 6.40,
      rangePercent: 2.58,
    },
  ],
}
