/**
 * Bond Portfolio Analysis - Test Data Fixture
 *
 * Scenario: Multi-portfolio fixed income analysis
 * - 3 Portfolios: Conservative, Balanced, Aggressive
 * - 2 Sectors: Government, Corporate
 * - Various credit ratings and maturities
 * - 12 total bond positions
 */

export interface BondData {
  bondId: string
  portfolio: string
  sector: string
  issuer: string
  rating: string
  maturityBucket: string
  maturityDate: string
  faceValue: number
  marketValue: number
  couponRate: number
  currentYield: number
  ytm: number
  duration: number
}

export const bondData: BondData[] = [
  // Conservative Portfolio - Government Bonds
  {
    bondId: 'BOND001',
    portfolio: 'Conservative',
    sector: 'Government',
    issuer: 'US Treasury',
    rating: 'AAA',
    maturityBucket: '5-10Y',
    maturityDate: '2032-05-15',
    faceValue: 10000000,
    marketValue: 9875000,
    couponRate: 3.5,
    currentYield: 3.54,
    ytm: 3.68,
    duration: 7.2,
  },
  {
    bondId: 'BOND002',
    portfolio: 'Conservative',
    sector: 'Government',
    issuer: 'US Treasury',
    rating: 'AAA',
    maturityBucket: '10Y+',
    maturityDate: '2044-02-15',
    faceValue: 5000000,
    marketValue: 4825000,
    couponRate: 4.0,
    currentYield: 4.15,
    ytm: 4.28,
    duration: 12.5,
  },

  // Conservative Portfolio - High Grade Corporate
  {
    bondId: 'BOND003',
    portfolio: 'Conservative',
    sector: 'Corporate',
    issuer: 'Apple Inc',
    rating: 'AA+',
    maturityBucket: '5-10Y',
    maturityDate: '2031-09-11',
    faceValue: 3000000,
    marketValue: 2985000,
    couponRate: 3.85,
    currentYield: 3.87,
    ytm: 3.92,
    duration: 6.8,
  },
  {
    bondId: 'BOND004',
    portfolio: 'Conservative',
    sector: 'Corporate',
    issuer: 'Microsoft Corp',
    rating: 'AAA',
    maturityBucket: '5-10Y',
    maturityDate: '2033-02-06',
    faceValue: 2000000,
    marketValue: 1975000,
    couponRate: 3.70,
    currentYield: 3.75,
    ytm: 3.85,
    duration: 7.5,
  },

  // Balanced Portfolio - Mix
  {
    bondId: 'BOND005',
    portfolio: 'Balanced',
    sector: 'Government',
    issuer: 'US Treasury',
    rating: 'AAA',
    maturityBucket: '2-5Y',
    maturityDate: '2028-11-30',
    faceValue: 5000000,
    marketValue: 4950000,
    couponRate: 3.25,
    currentYield: 3.28,
    ytm: 3.35,
    duration: 4.2,
  },
  {
    bondId: 'BOND006',
    portfolio: 'Balanced',
    sector: 'Corporate',
    issuer: 'JPMorgan Chase',
    rating: 'A+',
    maturityBucket: '5-10Y',
    maturityDate: '2032-04-22',
    faceValue: 4000000,
    marketValue: 3920000,
    couponRate: 4.25,
    currentYield: 4.34,
    ytm: 4.48,
    duration: 6.5,
  },
  {
    bondId: 'BOND007',
    portfolio: 'Balanced',
    sector: 'Corporate',
    issuer: 'Goldman Sachs',
    rating: 'A',
    maturityBucket: '2-5Y',
    maturityDate: '2029-07-15',
    faceValue: 3000000,
    marketValue: 2940000,
    couponRate: 4.50,
    currentYield: 4.59,
    ytm: 4.75,
    duration: 4.8,
  },
  {
    bondId: 'BOND008',
    portfolio: 'Balanced',
    sector: 'Corporate',
    issuer: 'Bank of America',
    rating: 'A-',
    maturityBucket: '5-10Y',
    maturityDate: '2031-12-10',
    faceValue: 2500000,
    marketValue: 2425000,
    couponRate: 4.75,
    currentYield: 4.90,
    ytm: 5.12,
    duration: 6.2,
  },

  // Aggressive Portfolio - Higher Yield Corporate
  {
    bondId: 'BOND009',
    portfolio: 'Aggressive',
    sector: 'Corporate',
    issuer: 'Tesla Inc',
    rating: 'BBB',
    maturityBucket: '2-5Y',
    maturityDate: '2027-08-15',
    faceValue: 3000000,
    marketValue: 2850000,
    couponRate: 5.30,
    currentYield: 5.58,
    ytm: 6.15,
    duration: 3.5,
  },
  {
    bondId: 'BOND010',
    portfolio: 'Aggressive',
    sector: 'Corporate',
    issuer: 'Ford Motor',
    rating: 'BBB-',
    maturityBucket: '5-10Y',
    maturityDate: '2030-11-22',
    faceValue: 2500000,
    marketValue: 2325000,
    couponRate: 5.75,
    currentYield: 6.18,
    ytm: 6.85,
    duration: 5.5,
  },
  {
    bondId: 'BOND011',
    portfolio: 'Aggressive',
    sector: 'Corporate',
    issuer: 'Delta Airlines',
    rating: 'BB+',
    maturityBucket: '2-5Y',
    maturityDate: '2028-05-01',
    faceValue: 2000000,
    marketValue: 1850000,
    couponRate: 6.50,
    currentYield: 7.03,
    ytm: 7.85,
    duration: 3.8,
  },
  {
    bondId: 'BOND012',
    portfolio: 'Aggressive',
    sector: 'Corporate',
    issuer: 'Carnival Corp',
    rating: 'BB',
    maturityBucket: '5-10Y',
    maturityDate: '2029-03-15',
    faceValue: 1500000,
    marketValue: 1350000,
    couponRate: 7.00,
    currentYield: 7.78,
    ytm: 8.95,
    duration: 4.5,
  },
]

/**
 * Expected Market Value by Portfolio and Sector (Sum aggregation)
 *
 * Pivot: Rows = [Portfolio, Sector], Values = [Market Value (sum)]
 */
export const expectedMarketValueByPortfolioSector = {
  rows: [
    { portfolio: 'Conservative', sector: 'Government', marketValue: 14700000 },
    { portfolio: 'Conservative', sector: 'Corporate', marketValue: 4960000 },
    { portfolio: 'Balanced', sector: 'Government', marketValue: 4950000 },
    { portfolio: 'Balanced', sector: 'Corporate', marketValue: 9285000 },
    { portfolio: 'Aggressive', sector: 'Corporate', marketValue: 8375000 },
  ],
  totals: {
    conservative: 19660000,
    balanced: 14235000,
    aggressive: 8375000,
    grandTotal: 42270000,
  },
}

/**
 * Expected Weighted Average Yield by Portfolio
 *
 * Pivot: Rows = [Portfolio], Values = [YTM (weighted avg by market value)]
 *
 * Note: This requires a weighted average aggregation function
 */
export const expectedWeightedYieldByPortfolio = {
  rows: [
    {
      portfolio: 'Conservative',
      weightedYTM: 3.89, // Weighted by market value
      totalMarketValue: 19660000,
    },
    {
      portfolio: 'Balanced',
      weightedYTM: 4.42, // Weighted by market value
      totalMarketValue: 14235000,
    },
    {
      portfolio: 'Aggressive',
      weightedYTM: 7.28, // Weighted by market value
      totalMarketValue: 8375000,
    },
  ],
  grandTotal: {
    weightedYTM: 4.86, // Overall weighted average
    totalMarketValue: 42270000,
  },
}

/**
 * Expected Count by Maturity Bucket and Rating
 *
 * Pivot: Rows = [Maturity Bucket], Columns = [Rating], Values = [Count]
 */
export const expectedCountByMaturityRating = {
  rows: [
    {
      maturityBucket: '2-5Y',
      AAA: 1,
      A: 1,
      BBB: 1,
      'BB+': 1,
      total: 4,
    },
    {
      maturityBucket: '5-10Y',
      AAA: 2,
      'AA+': 1,
      'A+': 1,
      'A-': 1,
      'BBB-': 1,
      BB: 1,
      total: 7,
    },
    {
      maturityBucket: '10Y+',
      AAA: 1,
      total: 1,
    },
  ],
  columnTotals: {
    AAA: 4,
    'AA+': 1,
    'A+': 1,
    A: 1,
    'A-': 1,
    BBB: 1,
    'BBB-': 1,
    'BB+': 1,
    BB: 1,
    grandTotal: 12,
  },
}

/**
 * Expected Duration Analysis by Portfolio
 *
 * Pivot: Rows = [Portfolio], Values = [Duration (avg), Market Value (sum)]
 */
export const expectedDurationByPortfolio = {
  rows: [
    {
      portfolio: 'Conservative',
      avgDuration: 8.5, // (7.2 + 12.5 + 6.8 + 7.5) / 4
      totalMarketValue: 19660000,
    },
    {
      portfolio: 'Balanced',
      avgDuration: 5.425, // (4.2 + 6.5 + 4.8 + 6.2) / 4
      totalMarketValue: 14235000,
    },
    {
      portfolio: 'Aggressive',
      avgDuration: 4.325, // (3.5 + 5.5 + 3.8 + 4.5) / 4
      totalMarketValue: 8375000,
    },
  ],
  overall: {
    avgDuration: 6.25, // Average of all durations
    totalMarketValue: 42270000,
  },
}
