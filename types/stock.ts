/**
 * types/stock.ts
 * 배당패스 500개 종목 데이터 타입 및 포트폴리오 타입 정의
 */

export type Market = 'KR' | 'US';
export type DividendCycle = 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
export type AssetType = 'ETF' | 'STOCK';
export type YieldBasis = 'TTM' | 'ANNUALIZED';

export interface DividendStock {
  ticker: string;
  name: string;
  market: Market;
  price: number;
  dpsTtm: number;
  dividendYield: number;
  dividendCycle: DividendCycle;
  marketCap: number;
  volume: number;
  popularityScore: number;
  isHighRisk: boolean;
  expenseRatio: number;
  topHoldings: string[];
  topHoldingsAvailable: boolean;
  isEtf: boolean;
  assetType: AssetType;
  isNewListing: boolean;
  yieldBasis: YieldBasis;
}

export type TooltipType = 'popularity' | 'ttm' | 'safety' | 'cycle' | 'risk' | 'tax' | 'fire';

export type CurationTab = 'popular_monthly' | 'high_yield' | 'market_cap';
export type MarketFilter = 'ALL' | 'KR' | 'US';

export interface PortfolioItem {
  stock: DividendStock;
  weight: number; // 0 ~ 100 (%)
}

export interface SimulationResult {
  targetMonthly: number;
  targetAnnual: number;
  totalRequiredCapital: number; // 원화
  actualMonthlyNet: number;     // 실제 세후 월 배당금 (원화)
  actualAnnualNet: number;      // 실제 세후 연 배당금 (원화)
  totalAnnualGross: number;     // 세전 연 배당금 (원화)
  isComprehensiveTaxTarget: boolean; // 금융소득종합과세 (2,000만원 초과)
  itemResults: {
    stock: DividendStock;
    shares: number;
    requiredCapital: number;     // 원화
    annualGrossDpsWon: number;   // 세전 연배당금(원)
    annualNetDpsWon: number;     // 세후 연배당금(원)
    taxRate: number;             // 0.154 or 0.150
  }[];
}
