/**
 * types/stock.ts
 * 배당패스 500개 종목 데이터 타입 정의
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

export type TooltipType = 'popularity' | 'ttm' | 'safety' | 'cycle' | 'risk';
