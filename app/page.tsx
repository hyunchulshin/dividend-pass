import type { Metadata } from 'next';
import { getDividendStocks, getDatasetUpdatedDate } from '@/lib/data';
import MainApp from '@/components/MainApp';

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
};

export const dynamic = 'force-static';

const DEFAULT_PORTFOLIO_TICKERS = new Set(['458730', 'JEPI', 'SCHD', '088980']);

export default async function Home() {
  const allStocks = await getDividendStocks();
  const dataUpdatedAt = getDatasetUpdatedDate();

  const marketStats = {
    totalCount: allStocks.length,
    krCount: allStocks.filter((s) => s.market === 'KR').length,
    usCount: allStocks.filter((s) => s.market === 'US').length,
    monthlyCount: allStocks.filter((s) => s.assetType === 'ETF' && s.dividendCycle === 'MONTHLY').length,
  };

  // 초기 HTML/RSC 페이로드 다이어트: 기본 포트폴리오 + 인기 상위 48종목만 SSR 직렬화,
  // 나머지 전체 500개 데이터셋은 클라이언트 마운트 시 /data/dividend_stocks_500.json에서 즉시 로드
  const sortedByPopularity = [...allStocks].sort((a, b) => b.popularityScore - a.popularityScore);
  const picked = new Map<string, (typeof allStocks)[number]>();
  for (const s of allStocks) {
    if (DEFAULT_PORTFOLIO_TICKERS.has(s.ticker)) {
      picked.set(s.ticker, s);
    }
  }
  for (const s of sortedByPopularity) {
    if (picked.size >= 48) break;
    if (!picked.has(s.ticker)) {
      picked.set(s.ticker, s);
    }
  }

  return <MainApp initialStocks={Array.from(picked.values())} marketStats={marketStats} dataUpdatedAt={dataUpdatedAt} />;
}
