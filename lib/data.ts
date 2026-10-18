import { DividendStock } from '@/types/stock';
import fs from 'fs';
import path from 'path';

let cachedStocks: DividendStock[] | null = null;

export async function getDividendStocks(): Promise<DividendStock[]> {
  if (cachedStocks) {
    return cachedStocks;
  }

  // 서버 사이드에서 로컬 파일 시스템에서 직접 읽기
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'dividend_stocks_500.json');
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf-8');
      cachedStocks = JSON.parse(fileData);
      return cachedStocks || [];
    }
  } catch (error) {
    console.warn('Local file read failed, falling back to fetch', error);
  }

  // 브라우저 또는 대체 방식
  try {
    const res = await fetch('/data/dividend_stocks_500.json');
    if (res.ok) {
      cachedStocks = await res.json();
      return cachedStocks || [];
    }
  } catch (error) {
    console.error('Failed to load dividend stocks data', error);
  }

  return [];
}

export async function getStockByTicker(ticker: string): Promise<DividendStock | undefined> {
  const stocks = await getDividendStocks();
  return stocks.find((s) => s.ticker.toLowerCase() === ticker.toLowerCase());
}

/**
 * 현재 종목과 동일한 배당주기 및 가장 근접한 배당수익률을 가진 유사 추천 종목 4선 추출
 */
export async function getRelatedStocks(
  currentStock: DividendStock,
  count = 4
): Promise<DividendStock[]> {
  const stocks = await getDividendStocks();
  const candidates = stocks.filter((s) => s.ticker !== currentStock.ticker);

  return candidates
    .map((stock) => {
      // 1. 시장 일치 점수 (동일 시장 100점)
      const marketScore = stock.market === currentStock.market ? 100 : 0;
      // 2. 배당주기 일치 점수 (동일 주기 150점)
      const cycleScore = stock.dividendCycle === currentStock.dividendCycle ? 150 : 0;
      // 3. 자산 유형 일치 점수 (ETF/일반주식 일치 50점)
      const assetScore = stock.assetType === currentStock.assetType ? 50 : 0;
      // 4. 배당률 격차 페널티 (격차 1%p당 10점 감점)
      const yieldDiff = Math.abs(stock.dividendYield - currentStock.dividendYield);
      const yieldScore = Math.max(0, 100 - yieldDiff * 10);

      const totalScore = marketScore + cycleScore + assetScore + yieldScore;
      return { stock, totalScore, yieldDiff };
    })
    .sort((a, b) => b.totalScore - a.totalScore || a.yieldDiff - b.yieldDiff)
    .slice(0, count)
    .map((item) => item.stock);
}

