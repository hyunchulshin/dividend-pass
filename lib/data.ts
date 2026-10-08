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
