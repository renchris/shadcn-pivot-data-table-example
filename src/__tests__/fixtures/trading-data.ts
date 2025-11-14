/**
 * Trading Desk P&L Analysis - Test Data Fixture
 *
 * Scenario: Multi-desk trading operation tracking P&L and volumes
 * - 3 Trading Desks: Equities, Fixed Income, FX
 * - 2-3 Traders per desk
 * - 4 Instrument types
 * - 15 total trades
 */

export interface TradingData {
  tradeId: string
  desk: string
  trader: string
  instrument: string
  quantity: number
  price: number
  pnl: number
  timestamp: string
}

export const tradingData: TradingData[] = [
  // Equities Desk - Alice
  {
    tradeId: 'TRD001',
    desk: 'Equities',
    trader: 'Alice Chen',
    instrument: 'AAPL',
    quantity: 1000,
    price: 175.50,
    pnl: 12500,
    timestamp: '2024-01-15T09:30:00Z',
  },
  {
    tradeId: 'TRD002',
    desk: 'Equities',
    trader: 'Alice Chen',
    instrument: 'MSFT',
    quantity: 500,
    price: 380.25,
    pnl: 8750,
    timestamp: '2024-01-15T10:15:00Z',
  },
  {
    tradeId: 'TRD003',
    desk: 'Equities',
    trader: 'Alice Chen',
    instrument: 'GOOGL',
    quantity: 300,
    price: 142.80,
    pnl: -2300,
    timestamp: '2024-01-15T11:45:00Z',
  },

  // Equities Desk - Bob
  {
    tradeId: 'TRD004',
    desk: 'Equities',
    trader: 'Bob Smith',
    instrument: 'TSLA',
    quantity: 800,
    price: 248.50,
    pnl: 15600,
    timestamp: '2024-01-15T09:45:00Z',
  },
  {
    tradeId: 'TRD005',
    desk: 'Equities',
    trader: 'Bob Smith',
    instrument: 'NVDA',
    quantity: 400,
    price: 505.75,
    pnl: 22400,
    timestamp: '2024-01-15T14:20:00Z',
  },

  // Fixed Income Desk - Carol
  {
    tradeId: 'TRD006',
    desk: 'Fixed Income',
    trader: 'Carol Wong',
    instrument: 'US10Y',
    quantity: 10000000,
    price: 99.25,
    pnl: 45000,
    timestamp: '2024-01-15T10:00:00Z',
  },
  {
    tradeId: 'TRD007',
    desk: 'Fixed Income',
    trader: 'Carol Wong',
    instrument: 'CORP-AAA',
    quantity: 5000000,
    price: 98.75,
    pnl: 18500,
    timestamp: '2024-01-15T11:30:00Z',
  },
  {
    tradeId: 'TRD008',
    desk: 'Fixed Income',
    trader: 'Carol Wong',
    instrument: 'CORP-BBB',
    quantity: 3000000,
    price: 97.50,
    pnl: -5200,
    timestamp: '2024-01-15T13:15:00Z',
  },

  // Fixed Income Desk - David
  {
    tradeId: 'TRD009',
    desk: 'Fixed Income',
    trader: 'David Lee',
    instrument: 'US10Y',
    quantity: 8000000,
    price: 99.50,
    pnl: 32000,
    timestamp: '2024-01-15T09:15:00Z',
  },
  {
    tradeId: 'TRD010',
    desk: 'Fixed Income',
    trader: 'David Lee',
    instrument: 'MUNI-CA',
    quantity: 2000000,
    price: 96.25,
    pnl: 8900,
    timestamp: '2024-01-15T15:00:00Z',
  },

  // FX Desk - Emma
  {
    tradeId: 'TRD011',
    desk: 'FX',
    trader: 'Emma Johnson',
    instrument: 'EUR/USD',
    quantity: 5000000,
    price: 1.0875,
    pnl: 28000,
    timestamp: '2024-01-15T08:30:00Z',
  },
  {
    tradeId: 'TRD012',
    desk: 'FX',
    trader: 'Emma Johnson',
    instrument: 'GBP/USD',
    quantity: 3000000,
    price: 1.2650,
    pnl: 15500,
    timestamp: '2024-01-15T12:00:00Z',
  },

  // FX Desk - Frank
  {
    tradeId: 'TRD013',
    desk: 'FX',
    trader: 'Frank Martinez',
    instrument: 'USD/JPY',
    quantity: 4000000,
    price: 148.25,
    pnl: -8700,
    timestamp: '2024-01-15T10:30:00Z',
  },
  {
    tradeId: 'TRD014',
    desk: 'FX',
    trader: 'Frank Martinez',
    instrument: 'EUR/GBP',
    quantity: 2500000,
    price: 0.8590,
    pnl: 12300,
    timestamp: '2024-01-15T13:45:00Z',
  },

  // FX Desk - Grace
  {
    tradeId: 'TRD015',
    desk: 'FX',
    trader: 'Grace Kim',
    instrument: 'AUD/USD',
    quantity: 6000000,
    price: 0.6745,
    pnl: 19800,
    timestamp: '2024-01-15T11:00:00Z',
  },
]

/**
 * Expected P&L by Desk and Trader (Sum aggregation)
 *
 * Pivot: Rows = [Desk, Trader], Values = [PNL (sum)]
 */
export const expectedPnLByDeskTrader = {
  rows: [
    { desk: 'Equities', trader: 'Alice Chen', pnl: 18950 },
    { desk: 'Equities', trader: 'Bob Smith', pnl: 38000 },
    { desk: 'Fixed Income', trader: 'Carol Wong', pnl: 58300 },
    { desk: 'Fixed Income', trader: 'David Lee', pnl: 40900 },
    { desk: 'FX', trader: 'Emma Johnson', pnl: 43500 },
    { desk: 'FX', trader: 'Frank Martinez', pnl: 3600 },
    { desk: 'FX', trader: 'Grace Kim', pnl: 19800 },
  ],
  totals: {
    equities: 56950,
    fixedIncome: 99200,
    fx: 66900,
    grandTotal: 223050,
  },
}

/**
 * Expected Volume by Instrument and Trader (Sum aggregation)
 *
 * Pivot: Rows = [Instrument], Columns = [Trader], Values = [Quantity (sum)]
 */
export const expectedVolumeByInstrumentTrader = {
  // Columns: Alice Chen, Bob Smith, Carol Wong, David Lee, Emma Johnson, Frank Martinez, Grace Kim
  rows: [
    {
      instrument: 'AAPL',
      'Alice Chen': 1000,
      total: 1000
    },
    {
      instrument: 'MSFT',
      'Alice Chen': 500,
      total: 500
    },
    {
      instrument: 'GOOGL',
      'Alice Chen': 300,
      total: 300
    },
    {
      instrument: 'TSLA',
      'Bob Smith': 800,
      total: 800
    },
    {
      instrument: 'NVDA',
      'Bob Smith': 400,
      total: 400
    },
    {
      instrument: 'US10Y',
      'Carol Wong': 10000000,
      'David Lee': 8000000,
      total: 18000000
    },
    {
      instrument: 'CORP-AAA',
      'Carol Wong': 5000000,
      total: 5000000
    },
    {
      instrument: 'CORP-BBB',
      'Carol Wong': 3000000,
      total: 3000000
    },
    {
      instrument: 'MUNI-CA',
      'David Lee': 2000000,
      total: 2000000
    },
    {
      instrument: 'EUR/USD',
      'Emma Johnson': 5000000,
      total: 5000000
    },
    {
      instrument: 'GBP/USD',
      'Emma Johnson': 3000000,
      total: 3000000
    },
    {
      instrument: 'USD/JPY',
      'Frank Martinez': 4000000,
      total: 4000000
    },
    {
      instrument: 'EUR/GBP',
      'Frank Martinez': 2500000,
      total: 2500000
    },
    {
      instrument: 'AUD/USD',
      'Grace Kim': 6000000,
      total: 6000000
    },
  ],
}
