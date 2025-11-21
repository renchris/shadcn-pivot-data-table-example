# Pivot Table Configuration Guide

**Complete step-by-step guide showing optimal field placements for meaningful business insights**

---

## Table of Contents

1. [Understanding Pivot Tables](#understanding-pivot-tables)
2. [Scenario 1: Market Data OHLC Analysis](#scenario-1-market-data-ohlc-analysis)
3. [Scenario 2: Trading Desk P&L Analysis](#scenario-2-trading-desk-pl-analysis)
4. [Scenario 3: Bond Portfolio Analysis](#scenario-3-bond-portfolio-analysis)
5. [Scenario 4: Options Portfolio Greeks](#scenario-4-options-portfolio-greeks)
6. [Scenario 5: Risk Management (VaR)](#scenario-5-risk-management-var)
7. [Quick Reference Guide](#quick-reference-guide)
8. [Key Takeaways](#key-takeaways)

---

## Understanding Pivot Tables

### Core Concepts

**Row Groups (Dimensions)** - Categories to group by
- Create hierarchical row structure
- Enable drill-down analysis
- Show subtotals at each level
- Best for: Categorical fields (Symbol, Desk, Portfolio, Region)

**Pivot Columns** - Cross-tabulation
- Create multi-level column headers
- Enable side-by-side comparison
- Show column totals
- Best for: Categorical fields with limited distinct values

**Value Fields (Measures)** - Metrics to aggregate
- Numbers displayed in table cells
- Support multiple aggregation functions (sum, avg, count, min, max, median, first, last)
- Best for: Numeric fields (Volume, P&L, VaR, Greeks)

### Business Logic: Dimensions vs. Measures

**Why VWAP shouldn't usually be a Row Group:**
- Numeric fields have too many distinct values → creates thousands of rows
- No meaningful aggregation occurs
- Use numeric fields as Value Fields instead
- Exception: Bucketed/binned numeric fields (e.g., "Price Range: $100-$150")

---

## Scenario 1: Market Data OHLC Analysis

### Business Objective
**"Algorithmic Trading Timing Strategy"** - Identify optimal execution times by comparing all stocks side-by-side at each time bucket. Reveals liquidity patterns and enables VWAP execution calibration.

### Available Fields
- **Tick Id** (number) - Unique trade identifier
- **Symbol** (string) - Stock ticker (AAPL, MSFT, GOOGL, AMZN, TSLA)
- **Timestamp** (string) - Trade execution time
- **Time Bucket** (string) - Time period (09:30, 09:45, 10:00, 10:15)
- **Open, High, Low, Close** (numbers) - OHLC prices
- **Volume** (number) - Trading volume
- **Vwap** (number) - Volume-weighted average price

### Starting State (Default Configuration)
```typescript
{
  rowFields: [],
  columnFields: [],
  valueFields: [
    { field: 'volume', aggregation: 'sum', displayName: 'Volume' },
    { field: 'close', aggregation: 'last', displayName: 'Last Price' },
    { field: 'vwap', aggregation: 'avg', displayName: 'VWAP' },
  ]
}
```

**Result:** Flat 20-row table showing all raw OHLC data (5 symbols × 4 time periods)

---

### Optimal Configuration #1: Hierarchical Stock Analysis

**Step 1:** Drag **"Symbol"** → Drop in **"Row Groups"**

**Result Table:**
```
Symbol ▼         | Volume (SUM) | Last Price (LAST) | VWAP (AVG)
─────────────────┼──────────────┼───────────────────┼────────────
AAPL             | 2,400,000    | 175.1             | 175.3
AMZN             | 2,100,000    | 143.4             | 143.25
GOOGL            | 1,800,000    | 142.3             | 142.5
MSFT             | 2,000,000    | 378.9             | 378.75
TSLA             | 3,200,000    | 244.3             | 244.1
```

**Business Insight:**
- Aggregated metrics per stock across all time periods
- Total volume and final price for each symbol
- TSLA has highest liquidity (3.2M volume)

---

**Step 2:** Drag **"Time Bucket"** → Drop in **"Row Groups"** (below Symbol)

**Result Table:**
```
Symbol ▼         | Time Bucket ▼ | Volume (SUM) | Last Price (LAST) | VWAP (AVG)
─────────────────┼───────────────┼──────────────┼───────────────────┼────────────
▶ AAPL           |               | 2,400,000    | 175.1             | 175.3
  ├─ 09:30       |               | 600,000      | 175.0             | 175.2
  ├─ 09:45       |               | 600,000      | 175.1             | 175.3
  ├─ 10:00       |               | 600,000      | 175.2             | 175.4
  └─ 10:15       |               | 600,000      | 175.1             | 175.3
▶ AMZN           |               | 2,100,000    | 143.4             | 143.25
  ├─ 09:30       |               | 525,000      | 143.1             | 143.15
  ├─ 09:45       |               | 525,000      | 143.3             | 143.25
  ├─ 10:00       |               | 525,000      | 143.5             | 143.35
  └─ 10:15       |               | 525,000      | 143.4             | 143.25
▶ GOOGL          |               | 1,800,000    | 142.3             | 142.5
  ├─ 09:30       |               | 450,000      | 142.2             | 142.4
  ├─ 09:45       |               | 450,000      | 142.3             | 142.5
  ├─ 10:00       |               | 450,000      | 142.4             | 142.6
  └─ 10:15       |               | 450,000      | 142.3             | 142.5
▶ MSFT           |               | 2,000,000    | 378.9             | 378.75
  ├─ 09:30       |               | 500,000      | 378.5             | 378.6
  ├─ 09:45       |               | 500,000      | 378.7             | 378.75
  ├─ 10:00       |               | 500,000      | 379.0             | 379.0
  └─ 10:15       |               | 500,000      | 378.9             | 378.75
▶ TSLA           |               | 3,200,000    | 244.3             | 244.1
  ├─ 09:30       |               | 800,000      | 244.0             | 244.0
  ├─ 09:45       |               | 800,000      | 244.2             | 244.1
  ├─ 10:00       |               | 800,000      | 244.5             | 244.2
  └─ 10:15       |               | 800,000      | 244.3             | 244.1
```

**Business Insight:**
- OHLC patterns by time period within each stock
- Algorithmic traders can identify:
  - Which time buckets have highest volume (liquidity)
  - Price movements within the trading window
  - Optimal execution times to minimize market impact
- AAPL has consistent 600K volume per period (stable liquidity)

---

### Alternative Configuration: Volume Heatmap

**Action:**
- Drag **"Time Bucket"** → **"Row Groups"**
- Drag **"Symbol"** → **"Pivot Columns"**

**Result Table:**
```
Time Bucket ▼ | AAPL Volume | AMZN Volume | GOOGL Volume | MSFT Volume | TSLA Volume | TOTALS
──────────────┼─────────────┼─────────────┼──────────────┼─────────────┼─────────────┼─────────
09:30         | 600,000     | 525,000     | 450,000      | 500,000     | 800,000     | 2,875,000
09:45         | 600,000     | 525,000     | 450,000      | 500,000     | 800,000     | 2,875,000
10:00         | 600,000     | 525,000     | 450,000      | 500,000     | 800,000     | 2,875,000
10:15         | 600,000     | 525,000     | 450,000      | 500,000     | 800,000     | 2,875,000
──────────────┼─────────────┼─────────────┼──────────────┼─────────────┼─────────────┼─────────
TOTALS        | 2,400,000   | 2,100,000   | 1,800,000    | 2,000,000   | 3,200,000   | 11,500,000
```

**Business Insight:**
- Compare liquidity across all stocks side-by-side at each time
- TSLA has highest volume (most liquid) - best for large orders
- GOOGL lowest volume (harder to execute large orders without moving market)
- Volume is evenly distributed across time periods (no concentration risk)

---

## Scenario 2: Trading Desk P&L Analysis

### Business Objective
**"Risk Management & Capital Allocation"** - Exposes instrument-level concentration risks across trading desks. Identifies which securities drive firm profitability and enables position limit optimization.

### Available Fields
- **Desk** (string) - Trading desk (Equities, Fixed Income, FX)
- **Trader** (string) - Individual trader name
- **Instrument** (string) - Security traded (AAPL, MSFT, US10Y, EUR/USD, etc.)
- **Quantity** (number) - Trade size
- **Price** (number) - Execution price
- **PnL** (number) - Profit & Loss
- **Timestamp** (string) - Trade time

### Starting State
```typescript
{
  rowFields: [],
  columnFields: [],
  valueFields: [
    { field: 'pnl', aggregation: 'sum', displayName: 'Total P&L' },
    { field: 'pnl', aggregation: 'count', displayName: 'Trade Count' },
    { field: 'pnl', aggregation: 'avg', displayName: 'Avg P&L' },
  ]
}
```

**Result:** Flat 15-row table showing all trades

---

### Optimal Configuration: Desk Performance Analysis

**Step 1:** Drag **"Desk"** → Drop in **"Row Groups"**

**Result Table:**
```
Desk ▼           | Total P&L (SUM) | Trade Count | Avg P&L per Trade
─────────────────┼─────────────────┼─────────────┼──────────────────
Equities         | $56,950         | 5           | $11,390
Fixed Income     | $99,200         | 5           | $19,840
FX               | $66,900         | 5           | $13,380
─────────────────┼─────────────────┼─────────────┼──────────────────
GRAND TOTAL      | $223,050        | 15          | $14,870
```

**Business Insight:**
- Fixed Income desk is most profitable ($99.2K total)
- Fixed Income has highest per-trade efficiency ($19.8K avg)
- Equities desk needs review ($11.4K avg, below firm average)
- All desks have equal trade count (5 trades each)

---

**Step 2:** Drag **"Trader"** → Drop in **"Row Groups"** (below Desk)

**Result Table:**
```
Desk ▼           | Trader ▼          | Total P&L | Trade Count | Avg P&L
─────────────────┼───────────────────┼───────────┼─────────────┼─────────
▶ Equities       |                   | $56,950   | 5           | $11,390
  ├─ Alice Chen  |                   | $25,000   | 2           | $12,500
  └─ Bob Smith   |                   | $31,950   | 3           | $10,650
▶ Fixed Income   |                   | $99,200   | 5           | $19,840
  ├─ Carol Wong  |                   | $45,000   | 2           | $22,500
  └─ David Lee   |                   | $54,200   | 3           | $18,067
▶ FX             |                   | $66,900   | 5           | $13,380
  ├─ Emma Johnson|                   | $35,000   | 2           | $17,500
  ├─ Frank Martinez|                 | $20,000   | 2           | $10,000
  └─ Grace Kim   |                   | $11,900   | 1           | $11,900
─────────────────┼───────────────────┼───────────┼─────────────┼─────────
GRAND TOTAL      |                   | $223,050  | 15          | $14,870
```

**Business Insight:**
- **Top performer:** Carol Wong (Fixed Income) - $22.5K avg per trade
- **Underperformer:** Frank Martinez (FX) - $10K avg (below desk average of $13.4K)
- **Action items:**
  - Increase Carol Wong's position limits (proven efficiency)
  - Review Frank Martinez's strategy (dragging down FX desk performance)
  - Alice Chen outperforming Bob Smith on Equities desk

---

### Alternative Configuration: Instrument Concentration Risk

**Action:**
- Drag **"Instrument"** → **"Row Groups"**
- Drag **"Trader"** → **"Pivot Columns"**

**Result Table:**
```
Instrument ▼ | Alice | Bob  | Carol | David | Emma | Frank | Grace | TOTAL Qty
─────────────┼───────┼──────┼───────┼───────┼──────┼───────┼───────┼───────
AAPL         | 2000  | -    | -     | -     | -    | -     | -     | 2000
MSFT         | -     | 1500 | -     | -     | -    | -     | -     | 1500
GOOGL        | -     | 800  | -     | -     | -    | -     | -     | 800
TSLA         | -     | 1200 | -     | -     | -    | -     | -     | 1200
US10Y        | -     | -    | 3000  | -     | -    | -     | -     | 3000
CORP-AAA     | -     | -    | -     | 2500  | -    | -     | -     | 2500
CORP-BBB     | -     | -    | 1000  | -     | -    | -     | -     | 1000
MUNI-CA      | -     | -    | -     | 1500  | -    | -     | -     | 1500
EUR/USD      | -     | -    | -     | -     | 3000 | 2000  | -     | 5000
GBP/USD      | -     | -    | -     | -     | -    | -     | 1500  | 1500
USD/JPY      | -     | -    | -     | -     | 1000 | -     | -     | 1000
EUR/GBP      | -     | -    | -     | -     | -    | 1500  | -     | 1500
```

**Business Insight:**
- **EUR/USD concentration risk:** Traded by 3 FX traders (Emma, Frank, Grace)
- Total EUR/USD notional = 5000 (33% of FX desk exposure)
- If EUR/USD moves against them, entire FX desk suffers
- **Action:** Implement position limits per instrument per desk

---

## Scenario 3: Bond Portfolio Analysis

### Business Objective
**"Laddered Portfolio Rebalancing"** - Reveals duration/credit quality distribution through maturity×rating matrix. Identifies rating gaps and enables yield optimization while managing interest rate risk.

### Available Fields
- **Portfolio** (string) - Conservative, Balanced, Aggressive
- **Sector** (string) - Government, Corporate
- **Issuer** (string) - Bond issuer name
- **Rating** (string) - Credit rating (AAA, AA+, A+, A, BBB, BB, etc.)
- **Maturity Bucket** (string) - Time to maturity (2-5Y, 5-10Y, 10Y+)
- **Market Value** (number) - Current bond value
- **YTM** (number) - Yield to Maturity (%)
- **Duration** (number) - Interest rate sensitivity (years)
- **Coupon Rate** (number) - Annual coupon (%)

### Starting State
```typescript
{
  rowFields: [],
  columnFields: [],
  valueFields: [
    { field: 'marketValue', aggregation: 'sum', displayName: 'Market Value' },
    { field: 'bondId', aggregation: 'count', displayName: 'Bond Count' },
    { field: 'ytm', aggregation: 'avg', displayName: 'Avg YTM' },
  ]
}
```

**Result:** Flat 12-row table showing all bonds

---

### Optimal Configuration: Portfolio Allocation Analysis

**Step 1:** Drag **"Portfolio"** → Drop in **"Row Groups"**

**Result Table:**
```
Portfolio ▼     | Market Value (SUM) | Bond Count | Avg YTM | Avg Duration
────────────────┼────────────────────┼────────────┼─────────┼──────────────
Conservative    | $19,660,000        | 5          | 2.85%   | 4.2 years
Balanced        | $14,240,000        | 4          | 3.45%   | 6.8 years
Aggressive      | $8,380,000         | 3          | 4.20%   | 8.5 years
────────────────┼────────────────────┼────────────┼─────────┼──────────────
GRAND TOTAL     | $42,280,000        | 12         | 3.40%   | 6.2 years
```

**Business Insight:**
- Conservative portfolio: Largest allocation ($19.66M, 46.5% of total)
- Risk/return trade-off visible:
  - Conservative: Low yield (2.85%), low duration (4.2 years) = low risk
  - Aggressive: High yield (4.20%), high duration (8.5 years) = high risk
- Portfolio matches investor risk profiles

---

**Step 2:** Drag **"Sector"** → Drop in **"Row Groups"** (below Portfolio)

**Result Table:**
```
Portfolio ▼     | Sector ▼        | Market Value | Bond Count | Avg YTM | Avg Duration
────────────────┼─────────────────┼──────────────┼────────────┼─────────┼──────────────
▶ Conservative  |                 | $19,660,000  | 5          | 2.85%   | 4.2 years
  ├─ Government |                 | $12,000,000  | 2          | 2.50%   | 3.5 years
  └─ Corporate  |                 | $7,660,000   | 3          | 3.40%   | 5.2 years
▶ Balanced      |                 | $14,240,000  | 4          | 3.45%   | 6.8 years
  ├─ Government |                 | $5,000,000   | 1          | 2.80%   | 5.0 years
  └─ Corporate  |                 | $9,240,000   | 3          | 3.75%   | 7.6 years
▶ Aggressive    |                 | $8,380,000   | 3          | 4.20%   | 8.5 years
  └─ Corporate  |                 | $8,380,000   | 3          | 4.20%   | 8.5 years
────────────────┼─────────────────┼──────────────┼────────────┼─────────┼──────────────
GRAND TOTAL     |                 | $42,280,000  | 12         | 3.40%   | 6.2 years
```

**Business Insight:**
- **Conservative:** 61% Government bonds ($12M), 39% Corporate ($7.66M)
- **Balanced:** 35% Government, 65% Corporate (moderate risk)
- **Aggressive:** 100% Corporate (maximum risk/return)
- **Sector allocation matches portfolio strategy perfectly**

---

### Alternative Configuration: Maturity × Rating Ladder Matrix (CRITICAL)

**Action:**
- Drag **"Maturity Bucket"** → **"Row Groups"**
- Drag **"Rating"** → **"Pivot Columns"**

**Result Table:**
```
Maturity ▼ | AAA | AA+ | A+ | A | A- | BBB | BBB- | BB+ | BB | TOTAL
───────────┼─────┼─────┼────┼───┼────┼─────┼──────┼─────┼────┼───────
2-5Y       | 2   | 1   | -  | 1 | -  | -   | -    | -   | -  | 4
5-10Y      | 1   | -   | 1  | 1 | 1  | -   | -    | -   | -  | 4
10Y+       | -   | -   | -  | -  | -  | 1   | 1    | 1   | 1  | 4
───────────┼─────┼─────┼────┼───┼────┼─────┼──────┼─────┼────┼───────
TOTAL      | 3   | 1   | 1  | 2 | 1  | 1   | 1    | 1   | 1  | 12
```

**Business Insight (CRITICAL FOR REBALANCING):**
- **Gap identified:** No AAA or AA+ bonds in 10Y+ maturity bucket
- **Concentration risk:** All low-rated bonds (BBB, BB) are concentrated in 10Y+ bucket
- **Duration/credit risk mismatch:** Long-term bonds should have higher credit quality
- **Rebalancing action needed:**
  - Sell BB-rated 10Y+ bonds (high credit risk + long duration = dangerous)
  - Buy AAA-rated 10Y+ bonds to improve long-term credit quality
- **Ladder structure:** Good distribution across maturities (4 bonds each bucket)

---

## Scenario 4: Options Portfolio Greeks

### Business Objective
**"Options Risk Management & Vega Hedging"** - Exposes underlying-specific Greek concentrations by strategy. Detects volatility clustering and enables targeted hedging of single-name exposure.

### Available Fields
- **Strategy** (string) - Covered Call, Protective Put, Iron Condor, Straddle
- **Underlying** (string) - Stock symbol (SPY, QQQ, IWM, AAPL, MSFT, etc.)
- **Option Type** (string) - Call, Put
- **Strike** (number) - Strike price
- **Expiry Bucket** (string) - Time to expiration (1M, 2M, 3M+)
- **Contracts** (number) - Number of option contracts
- **Premium** (number) - Option premium paid/received
- **Delta, Gamma, Vega, Theta** (numbers) - Greek risk metrics
- **Implied Vol** (number) - Implied volatility (%)

### Starting State
```typescript
{
  rowFields: [],
  columnFields: [],
  valueFields: [
    { field: 'delta', aggregation: 'sum', displayName: 'Net Delta' },
    { field: 'vega', aggregation: 'sum', displayName: 'Net Vega' },
    { field: 'impliedVol', aggregation: 'avg', displayName: 'Avg IV' },
    { field: 'contracts', aggregation: 'sum', displayName: 'Contracts' },
  ]
}
```

**Result:** Flat 20-row table showing all option positions

---

### Optimal Configuration: Single-Name Risk Concentration

**Step 1:** Drag **"Underlying"** → Drop in **"Row Groups"**

**Result Table:**
```
Underlying ▼ | Net Delta | Net Gamma | Net Vega | Net Theta | Contracts | Avg IV
─────────────┼───────────┼───────────┼──────────┼───────────┼───────────┼────────
AAPL         | +125      | +12       | +450     | -85       | 50        | 28.5%
AMZN         | -80       | +8        | +320     | -60       | 40        | 31.2%
GOOGL        | +200      | +15       | +550     | -95       | 60        | 26.8%
IWM          | +50       | +6        | +220     | -45       | 35        | 24.5%
MSFT         | -50       | +5        | +200     | -40       | 30        | 25.0%
QQQ          | +100      | +10       | +380     | -70       | 45        | 27.3%
SPY          | -150      | +18       | +600     | -110      | 70        | 22.8%
TSLA         | +300      | +25       | +800     | -140      | 80        | 42.5%
─────────────┼───────────┼───────────┼──────────┼───────────┼───────────┼────────
PORTFOLIO    | +495      | +99       | +3,520   | -645      | 410       | 28.6%
```

**Business Insight:**
- **Net Delta = +495:** Portfolio is NET BULLISH (profits if market goes up)
- **TSLA concentration risk:**
  - +300 delta (61% of total directional risk on one stock)
  - +800 vega (23% of volatility exposure)
  - 42.5% IV (highest volatility - most risky position)
- **Hedging action needed:**
  - Buy SPY puts to reduce net delta from +495 to neutral (~0)
  - Sell TSLA covered calls to reduce single-name concentration
- **Vega exposure:** +3,520 means profit if implied volatility expands
- **Theta decay:** -645 per day (losing $645/day from time decay)

---

### Alternative Configuration: Strategy × Expiry Calendar Risk

**Action:**
- Drag **"Strategy"** → **"Row Groups"**
- Drag **"Expiry Bucket"** → **"Pivot Columns"**

**Result Table:**
```
Strategy ▼       | 1M Contracts | 2M Contracts | 3M+ Contracts | TOTAL | 1M Delta | 2M Delta | 3M+ Delta
─────────────────┼──────────────┼──────────────┼───────────────┼───────┼──────────┼──────────┼───────────
Covered Call     | 30           | 25           | 20            | 75    | -45      | -38      | -30
Protective Put   | 40           | 35           | 30            | 105   | -60      | -53      | -45
Iron Condor      | 25           | 20           | 15            | 60    | +5       | +4       | +3
Straddle         | 50           | 45           | 40            | 135   | +200     | +180     | +160
─────────────────┼──────────────┼──────────────┼───────────────┼───────┼──────────┼──────────┼───────────
TOTAL            | 145          | 125          | 105           | 375   | +100     | +93      | +88
```

**Business Insight:**
- **Front-month heavy:** 145 contracts expiring in 1 month (38.7% of portfolio)
- **Theta decay concentration:** Front-month options lose value fastest
- **Straddles dominate:** 135 contracts (36% of portfolio)
  - High vega (profit from volatility expansion)
  - High theta decay (expensive to hold)
- **Rolling calendar:**
  - 145 contracts expiring soon need action (close or roll to next month)
  - Protective Puts should be rolled to maintain downside protection
- **Strategy insights:**
  - Covered Calls = negative delta (income strategy, bearish bias)
  - Straddles = positive delta overall (volatility trades with bullish skew)

---

## Scenario 5: Risk Management (Value at Risk)

### Business Objective
**"Portfolio Risk Optimization & Geographic Rebalancing"** - Creates risk heat map by asset class×region. Reveals geographic concentration and enables optimization of risk-adjusted allocations.

### Available Fields
- **Asset Class** (string) - Equities, Fixed Income, FX, Commodities
- **Region** (string) - Americas, Europe, Asia
- **Sub Asset Class** (string) - Specific asset categories
- **Market Value** (number) - Position size ($)
- **VaR 95%** (number) - 1-day Value at Risk at 95% confidence
- **VaR 99%** (number) - 1-day Value at Risk at 99% confidence
- **Volatility** (number) - Annualized volatility (%)
- **Beta** (number) - Market correlation
- **Notional** (number) - Total exposure ($)

### Starting State
```typescript
{
  rowFields: [],
  columnFields: [],
  valueFields: [
    { field: 'marketValue', aggregation: 'sum', displayName: 'Market Value' },
    { field: 'var95', aggregation: 'sum', displayName: 'VaR 95%' },
    { field: 'beta', aggregation: 'avg', displayName: 'Avg Beta' },
  ]
}
```

**Result:** Flat 15-row table showing all positions

---

### Optimal Configuration: Asset Class Risk Breakdown

**Step 1:** Drag **"Asset Class"** → Drop in **"Row Groups"**

**Result Table:**
```
Asset Class ▼   | Market Value (SUM) | VaR 95% (SUM) | VaR 99% (SUM) | Avg Beta | Avg Volatility
────────────────┼────────────────────┼───────────────┼───────────────┼──────────┼────────────────
Equities        | $8,500,000         | $3,230,000    | $4,680,000    | 1.15     | 22.5%
Fixed Income    | $6,200,000         | $1,020,000    | $1,450,000    | 0.35     | 8.2%
FX              | $3,800,000         | $840,000      | $1,200,000    | 0.60     | 12.5%
Commodities     | $4,100,000         | $1,030,000    | $1,490,000    | 0.85     | 18.3%
────────────────┼────────────────────┼───────────────┼───────────────┼──────────┼────────────────
PORTFOLIO       | $22,600,000        | $6,120,000    | $8,820,000    | 0.74     | 15.4%
```

**Business Insight:**
- **Equities = 53% of VaR** ($3.23M) but only 38% of capital ($8.5M)
  - High volatility (22.5%) drives risk
  - High beta (1.15) = more volatile than market
- **Fixed Income = 17% of VaR** but 27% of capital
  - Low volatility (8.2%) = stable returns
  - Low beta (0.35) = market-neutral
- **VaR 95% = $6.12M:** 95% confident we won't lose more than $6.12M in one day
- **VaR 99% = $8.82M:** 99% confident (stressed scenario, 44% higher)
- **Portfolio Beta = 0.74:** Portfolio is 26% less volatile than market

---

**Step 2:** Drag **"Region"** → Drop in **"Row Groups"** (below Asset Class)

**Result Table:**
```
Asset Class ▼   | Region ▼   | Market Value | VaR 95%   | % of Total VaR
────────────────┼────────────┼──────────────┼───────────┼────────────────
▶ Equities      |            | $8,500,000   | $3,230,000| 52.8%
  ├─ Americas   |            | $4,000,000   | $1,580,000| 25.8%
  ├─ Europe     |            | $2,500,000   | $980,000  | 16.0%
  └─ Asia       |            | $2,000,000   | $670,000  | 10.9%
▶ Fixed Income  |            | $6,200,000   | $1,020,000| 16.7%
  ├─ Americas   |            | $3,500,000   | $580,000  | 9.5%
  ├─ Europe     |            | $1,800,000   | $290,000  | 4.7%
  └─ Asia       |            | $900,000     | $150,000  | 2.5%
▶ FX            |            | $3,800,000   | $840,000  | 13.7%
  ├─ Americas   |            | $1,500,000   | $340,000  | 5.6%
  ├─ Europe     |            | $1,200,000   | $280,000  | 4.6%
  └─ Asia       |            | $1,100,000   | $220,000  | 3.6%
▶ Commodities   |            | $4,100,000   | $1,030,000| 16.8%
  ├─ Americas   |            | $2,000,000   | $520,000  | 8.5%
  ├─ Europe     |            | $1,100,000   | $280,000  | 4.6%
  └─ Asia       |            | $1,000,000   | $230,000  | 3.8%
────────────────┼────────────┼──────────────┼───────────┼────────────────
PORTFOLIO       |            | $22,600,000  | $6,120,000| 100%
```

**Business Insight:**
- **Americas concentration:** $11M market value, $3.02M VaR (49.3% of total risk)
- **Hotspot identified:** Equities Americas = $1.58M VaR
  - Single largest risk bucket (25.8% of portfolio VaR)
  - Needs rebalancing to reduce geographic concentration
- **Rebalancing recommendation:**
  - Reduce Americas Equities from $4M to $3M (-25%)
  - Increase Asia Equities from $2M to $3M (+50%)
  - Expected outcome: Reduce Americas concentration from 49.3% to ~42%
- **Diversification opportunity:** Asia only 17.7% of VaR (underweight)

---

### Alternative Configuration: Geographic Risk Heatmap (OPTIMAL)

**Action:**
- Drag **"Asset Class"** → **"Row Groups"**
- Drag **"Region"** → **"Pivot Columns"**

**Result Table:**
```
Asset Class ▼   | Americas VaR | Europe VaR | Asia VaR | TOTAL VaR | % of Total
────────────────┼──────────────┼────────────┼──────────┼───────────┼───────────
Equities        | $1,580,000   | $980,000   | $670,000 | $3,230,000| 52.8%
Fixed Income    | $580,000     | $290,000   | $150,000 | $1,020,000| 16.7%
FX              | $340,000     | $280,000   | $220,000 | $840,000  | 13.7%
Commodities     | $520,000     | $280,000   | $230,000 | $1,030,000| 16.8%
────────────────┼──────────────┼────────────┼──────────┼───────────┼───────────
TOTAL VaR       | $3,020,000   | $1,830,000 | $1,270,000| $6,120,000| 100%
% of Total      | 49.3%        | 29.9%      | 20.8%    | 100%      |
```

**Business Insight (RISK HEATMAP):**
- **Hottest cell:** Americas Equities = $1.58M VaR
  - 25.8% of total portfolio risk in one cell
  - Requires immediate attention
- **Rebalancing actions:**
  1. Reduce Americas Equities from $4M to $3M → VaR drops from $1.58M to ~$1.2M
  2. Increase Asia Equities from $2M to $3M → VaR increases from $670K to ~$1M
  3. Net result: Better geographic diversification
- **Correlation benefit:**
  - Asia has lower correlation with Americas/Europe during crises
  - Diversification reduces portfolio VaR (sum of individual VaRs > portfolio VaR)
- **Heat map visualization:**
  - Color cells by VaR magnitude
  - Red (high risk): Americas Equities
  - Yellow (medium risk): Americas Commodities, Europe Equities
  - Green (low risk): Asia Fixed Income, Asia FX

---

## Quick Reference Guide

### Optimal Configurations Summary

| Scenario | Optimal Row Fields | Pivot Columns | Key Metrics | Business Question Answered |
|----------|-------------------|---------------|-------------|---------------------------|
| **Market Data** | symbol, timeBucket | None (alt: timeBucket×symbol) | OHLC, Volume | When can we execute trades with best liquidity? |
| **Trading P&L** | desk, trader | None (alt: instrument×trader) | P&L, Trade Count, Avg P&L | Which traders/desks are profitable and efficient? |
| **Bond Portfolio** | portfolio, sector | None (alt: maturityBucket×rating) | Market Value, Duration, YTM | Is the bond ladder properly balanced by risk? |
| **Options Greeks** | underlying | None (alt: strategy×expiryBucket) | Delta, Vega, Theta, Contracts | Which stocks have concentrated Greek exposure? |
| **Risk VaR** | assetClass, region | None (alt: assetClass×region) | VaR 95%, Volatility, Beta | Where in the portfolio is risk concentrated? |

---

## Key Takeaways

### 1. Field Type Determines Placement

| Field Type | Best Used In | Why |
|------------|--------------|-----|
| **Categorical** (Symbol, Desk, Portfolio) | Row Groups or Pivot Columns | Limited distinct values create meaningful groups |
| **Numeric** (Volume, VaR, Greeks) | Value Fields | Continuous values need aggregation |
| **Bucketed Numeric** (Price Range: $0-$50) | Row Groups or Pivot Columns | Binning makes numeric fields categorical |

### 2. Row Groups vs. Pivot Columns

**Use Row Groups when:**
- You want hierarchical drill-down (Desk → Trader → Instrument)
- You have many distinct values (20+ symbols, 100+ traders)
- You want subtotals at each level
- Example: Portfolio → Sector shows allocation breakdown

**Use Pivot Columns when:**
- You want side-by-side comparison
- You have few distinct values (3-10 categories)
- You want to create a heatmap/matrix
- Example: Asset Class × Region shows risk concentration

**Use both together for:**
- Cross-tabulation analysis (Maturity Bucket × Rating)
- Risk heatmaps (Time Bucket × Symbol)
- Concentration matrices (Instrument × Trader)

### 3. Aggregation Function Selection

| Metric | Aggregation | Business Logic |
|--------|-------------|----------------|
| **OHLC prices** | first, max, min, last | Preserve candlestick properties |
| **Volume, P&L** | sum | Total across groups |
| **Greeks (Delta, Vega)** | sum | Net exposure matters for hedging |
| **Performance metrics** | avg | Efficiency comparison (avg P&L per trade) |
| **Diversity metrics** | count | Number of positions/trades |
| **VaR** | sum* | *Naive sum; production needs correlation matrices |

### 4. Common Pitfalls to Avoid

**❌ Don't drag numeric fields to Row Groups (unless bucketed)**
- Example: Dragging VWAP creates thousands of rows with unique values
- Solution: Use VWAP as a Value Field with avg aggregation

**❌ Don't use too many levels of row grouping**
- Example: Portfolio → Sector → Issuer → Rating (4 levels)
- Result: Hard to navigate, defeats purpose of aggregation
- Solution: Use 1-2 levels in rows, additional dimensions in columns

**❌ Don't pivot on high-cardinality fields**
- Example: Timestamp as Pivot Column (creates hundreds of columns)
- Solution: Use bucketed fields like "Time Bucket" or "Expiry Bucket"

### 5. When to Use Alternative Configurations

**Primary Configuration (Rows only):**
- Initial exploration
- Hierarchical drill-down
- When you need subtotals

**Alternative Configuration (Rows × Columns):**
- Comparative analysis
- Risk heatmaps
- Identifying concentration
- Side-by-side comparison

**Example Decision Tree:**
- Need to see trader performance by desk? → Use desk, trader in Rows
- Need to see instrument concentration across traders? → Use instrument in Rows, trader in Columns
- Need to see risk by geography? → Use assetClass in Rows, region in Columns

---

## Additional Resources

- **Scenarios Configuration:** `src/lib/pivot/scenarios.ts`
- **Test Fixtures:** `src/__tests__/fixtures/*.ts`
- **Component Source:** `src/components/pivot-table/`
- **Transformation Engine:** `src/lib/pivot/transformer.ts`

---

**Generated:** 2025-11-20
**Version:** 1.0
**License:** See project LICENSE