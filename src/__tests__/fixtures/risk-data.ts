/**
 * Risk Management (VaR) - Test Data Fixture
 *
 * Scenario: Portfolio risk analysis with Value-at-Risk metrics
 * - 4 Asset Classes: Equities, Fixed Income, FX, Commodities
 * - 3 Regions: Americas, Europe, Asia
 * - VaR metrics at 95% confidence level
 * - 15 total positions
 *
 * IMPORTANT NOTE: Actual VaR aggregation requires correlation matrices.
 * This fixture uses simplified VaR values for testing purposes.
 * Real VaR calculation: Portfolio VaR ≠ Sum of individual VaRs
 */

export interface RiskData {
  positionId: string
  assetClass: string
  region: string
  subAssetClass: string
  notional: number
  marketValue: number
  var95: number // Value-at-Risk at 95% confidence (1-day)
  var99: number // Value-at-Risk at 99% confidence (1-day)
  expectedShortfall: number // Expected Shortfall (CVaR)
  volatility: number // Annualized volatility %
  beta: number // Market beta
}

export const riskData: RiskData[] = [
  // Equities - Americas
  {
    positionId: 'RISK001',
    assetClass: 'Equities',
    region: 'Americas',
    subAssetClass: 'US Large Cap',
    notional: 50000000,
    marketValue: 50000000,
    var95: 850000,
    var99: 1250000,
    expectedShortfall: 1500000,
    volatility: 18.5,
    beta: 0.95,
  },
  {
    positionId: 'RISK002',
    assetClass: 'Equities',
    region: 'Americas',
    subAssetClass: 'US Small Cap',
    notional: 20000000,
    marketValue: 20000000,
    var95: 520000,
    var99: 780000,
    expectedShortfall: 950000,
    volatility: 28.2,
    beta: 1.25,
  },
  {
    positionId: 'RISK003',
    assetClass: 'Equities',
    region: 'Americas',
    subAssetClass: 'Latin America',
    notional: 10000000,
    marketValue: 10000000,
    var95: 380000,
    var99: 580000,
    expectedShortfall: 720000,
    volatility: 42.5,
    beta: 1.45,
  },

  // Equities - Europe
  {
    positionId: 'RISK004',
    assetClass: 'Equities',
    region: 'Europe',
    subAssetClass: 'European Large Cap',
    notional: 30000000,
    marketValue: 30000000,
    var95: 480000,
    var99: 720000,
    expectedShortfall: 870000,
    volatility: 17.2,
    beta: 0.88,
  },
  {
    positionId: 'RISK005',
    assetClass: 'Equities',
    region: 'Europe',
    subAssetClass: 'UK Equities',
    notional: 15000000,
    marketValue: 15000000,
    var95: 225000,
    var99: 345000,
    expectedShortfall: 420000,
    volatility: 16.8,
    beta: 0.82,
  },

  // Equities - Asia
  {
    positionId: 'RISK006',
    assetClass: 'Equities',
    region: 'Asia',
    subAssetClass: 'Japanese Equities',
    notional: 25000000,
    marketValue: 25000000,
    var95: 350000,
    var99: 530000,
    expectedShortfall: 650000,
    volatility: 15.5,
    beta: 0.75,
  },
  {
    positionId: 'RISK007',
    assetClass: 'Equities',
    region: 'Asia',
    subAssetClass: 'Emerging Asia',
    notional: 12000000,
    marketValue: 12000000,
    var95: 420000,
    var99: 640000,
    expectedShortfall: 790000,
    volatility: 38.8,
    beta: 1.35,
  },

  // Fixed Income - Americas
  {
    positionId: 'RISK008',
    assetClass: 'Fixed Income',
    region: 'Americas',
    subAssetClass: 'US Treasuries',
    notional: 100000000,
    marketValue: 98500000,
    var95: 420000,
    var99: 650000,
    expectedShortfall: 800000,
    volatility: 4.8,
    beta: 0.15,
  },
  {
    positionId: 'RISK009',
    assetClass: 'Fixed Income',
    region: 'Americas',
    subAssetClass: 'US Corporate IG',
    notional: 50000000,
    marketValue: 49200000,
    var95: 285000,
    var99: 440000,
    expectedShortfall: 540000,
    volatility: 6.5,
    beta: 0.25,
  },

  // Fixed Income - Europe
  {
    positionId: 'RISK010',
    assetClass: 'Fixed Income',
    region: 'Europe',
    subAssetClass: 'European Sovereigns',
    notional: 60000000,
    marketValue: 59100000,
    var95: 310000,
    var99: 480000,
    expectedShortfall: 590000,
    volatility: 5.8,
    beta: 0.18,
  },

  // FX - Americas
  {
    positionId: 'RISK011',
    assetClass: 'FX',
    region: 'Americas',
    subAssetClass: 'USD Pairs',
    notional: 40000000,
    marketValue: 40000000,
    var95: 320000,
    var99: 490000,
    expectedShortfall: 600000,
    volatility: 8.9,
    beta: 0.32,
  },

  // FX - Europe
  {
    positionId: 'RISK012',
    assetClass: 'FX',
    region: 'Europe',
    subAssetClass: 'EUR Pairs',
    notional: 30000000,
    marketValue: 30000000,
    var95: 240000,
    var99: 370000,
    expectedShortfall: 450000,
    volatility: 8.8,
    beta: 0.28,
  },

  // FX - Asia
  {
    positionId: 'RISK013',
    assetClass: 'FX',
    region: 'Asia',
    subAssetClass: 'Asia FX',
    notional: 20000000,
    marketValue: 20000000,
    var95: 280000,
    var99: 430000,
    expectedShortfall: 530000,
    volatility: 15.2,
    beta: 0.45,
  },

  // Commodities
  {
    positionId: 'RISK014',
    assetClass: 'Commodities',
    region: 'Americas',
    subAssetClass: 'Energy',
    notional: 15000000,
    marketValue: 15000000,
    var95: 650000,
    var99: 1000000,
    expectedShortfall: 1250000,
    volatility: 48.5,
    beta: 0.65,
  },
  {
    positionId: 'RISK015',
    assetClass: 'Commodities',
    region: 'Europe',
    subAssetClass: 'Metals',
    notional: 10000000,
    marketValue: 10000000,
    var95: 380000,
    var99: 590000,
    expectedShortfall: 730000,
    volatility: 42.2,
    beta: 0.55,
  },
]

/**
 * Expected VaR by Asset Class and Region (Sum aggregation)
 *
 * Pivot: Rows = [Asset Class, Region], Values = [VaR95, VaR99, Market Value (sum)]
 *
 * NOTE: This uses naive sum aggregation for testing.
 * Real VaR aggregation requires correlation matrix and proper portfolio VaR calculation.
 */
export const expectedVaRByAssetClassRegion = {
  rows: [
    {
      assetClass: 'Equities',
      region: 'Americas',
      var95Sum: 1750000, // Sum: 850k + 520k + 380k
      var99Sum: 2610000,
      marketValue: 80000000,
    },
    {
      assetClass: 'Equities',
      region: 'Europe',
      var95Sum: 705000, // Sum: 480k + 225k
      var99Sum: 1065000,
      marketValue: 45000000,
    },
    {
      assetClass: 'Equities',
      region: 'Asia',
      var95Sum: 770000, // Sum: 350k + 420k
      var99Sum: 1170000,
      marketValue: 37000000,
    },
    {
      assetClass: 'Fixed Income',
      region: 'Americas',
      var95Sum: 705000, // Sum: 420k + 285k
      var99Sum: 1090000,
      marketValue: 147700000,
    },
    {
      assetClass: 'Fixed Income',
      region: 'Europe',
      var95Sum: 310000,
      var99Sum: 480000,
      marketValue: 59100000,
    },
    {
      assetClass: 'FX',
      region: 'Americas',
      var95Sum: 320000,
      var99Sum: 490000,
      marketValue: 40000000,
    },
    {
      assetClass: 'FX',
      region: 'Europe',
      var95Sum: 240000,
      var99Sum: 370000,
      marketValue: 30000000,
    },
    {
      assetClass: 'FX',
      region: 'Asia',
      var95Sum: 280000,
      var99Sum: 430000,
      marketValue: 20000000,
    },
    {
      assetClass: 'Commodities',
      region: 'Americas',
      var95Sum: 650000,
      var99Sum: 1000000,
      marketValue: 15000000,
    },
    {
      assetClass: 'Commodities',
      region: 'Europe',
      var95Sum: 380000,
      var99Sum: 590000,
      marketValue: 10000000,
    },
  ],
  totals: {
    equities: {
      var95Sum: 3225000,
      marketValue: 162000000,
    },
    fixedIncome: {
      var95Sum: 1015000,
      marketValue: 206800000,
    },
    fx: {
      var95Sum: 840000,
      marketValue: 90000000,
    },
    commodities: {
      var95Sum: 1030000,
      marketValue: 25000000,
    },
    grandTotal: {
      var95Sum: 6110000,
      marketValue: 483800000,
    },
  },
}

/**
 * Expected VaR Contribution by Region
 *
 * Pivot: Rows = [Region], Values = [VaR95 (sum), Market Value (sum), Count]
 */
export const expectedVaRByRegion = {
  rows: [
    {
      region: 'Americas',
      var95Sum: 3425000, // Equities + Fixed Income + FX + Commodities
      var99Sum: 5190000,
      marketValue: 282700000,
      positionCount: 7,
    },
    {
      region: 'Europe',
      var95Sum: 1635000,
      var99Sum: 2505000,
      marketValue: 144100000,
      positionCount: 5,
    },
    {
      region: 'Asia',
      var95Sum: 1050000,
      var99Sum: 1600000,
      marketValue: 57000000,
      positionCount: 3,
    },
  ],
  grandTotal: {
    var95Sum: 6110000,
    var99Sum: 9295000,
    marketValue: 483800000,
    positionCount: 15,
  },
}

/**
 * Expected Volatility and Beta Statistics by Asset Class
 *
 * Pivot: Rows = [Asset Class], Values = [Volatility (avg), Beta (avg), Market Value (sum)]
 */
export const expectedVolatilityStatsByAssetClass = {
  rows: [
    {
      assetClass: 'Equities',
      avgVolatility: 25.36, // Average of all equity positions
      avgBeta: 1.06,
      minVolatility: 15.5,
      maxVolatility: 42.5,
      marketValue: 162000000,
    },
    {
      assetClass: 'Fixed Income',
      avgVolatility: 5.7,
      avgBeta: 0.19,
      minVolatility: 4.8,
      maxVolatility: 6.5,
      marketValue: 206800000,
    },
    {
      assetClass: 'FX',
      avgVolatility: 10.97,
      avgBeta: 0.35,
      minVolatility: 8.8,
      maxVolatility: 15.2,
      marketValue: 90000000,
    },
    {
      assetClass: 'Commodities',
      avgVolatility: 45.35,
      avgBeta: 0.60,
      minVolatility: 42.2,
      maxVolatility: 48.5,
      marketValue: 25000000,
    },
  ],
}

/**
 * Expected VaR Efficiency Ratio
 *
 * VaR Efficiency = (VaR95 / Market Value) × 100
 * Higher ratio indicates higher risk per dollar invested
 */
export const expectedVaREfficiency = {
  rows: [
    {
      assetClass: 'Equities',
      var95Sum: 3225000,
      marketValue: 162000000,
      varEfficiency: 1.99, // (3225000 / 162000000) × 100
    },
    {
      assetClass: 'Fixed Income',
      var95Sum: 1015000,
      marketValue: 206800000,
      varEfficiency: 0.49, // Lowest risk per dollar
    },
    {
      assetClass: 'FX',
      var95Sum: 840000,
      marketValue: 90000000,
      varEfficiency: 0.93,
    },
    {
      assetClass: 'Commodities',
      var95Sum: 1030000,
      marketValue: 25000000,
      varEfficiency: 4.12, // Highest risk per dollar
    },
  ],
}
