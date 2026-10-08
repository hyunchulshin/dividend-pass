'use client';

import React, { useState, useMemo } from 'react';
import { DividendStock, CurationTab, MarketFilter } from '@/types/stock';
import StockCard from '@/components/StockCard';
import InfoTooltip from '@/components/InfoTooltip';
import { Search } from 'lucide-react';

interface StockExplorerProps {
  stocks: DividendStock[];
  portfolioTickers: Set<string>;
  onSelectStock: (stock: DividendStock) => void;
  onTogglePortfolio: (stock: DividendStock) => void;
}

export default function StockExplorer({
  stocks,
  portfolioTickers,
  onSelectStock,
  onTogglePortfolio,
}: StockExplorerProps) {
  const [activeTab, setActiveTab] = useState<CurationTab>('popular_monthly');
  const [marketFilter, setMarketFilter] = useState<MarketFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 탭 목록 정의
  const TABS = [
    {
      id: 'popular_monthly' as CurationTab,
      label: '🔥 인기 월배당 TOP 10',
      shortLabel: '월배당 TOP 10',
      tooltip: 'popularity' as const,
    },
    {
      id: 'high_yield' as CurationTab,
      label: '💰 고배당 알짜 (6%+)',
      shortLabel: '고배당 6%+',
      tooltip: 'ttm' as const,
    },
    {
      id: 'market_cap' as CurationTab,
      label: '🏛️ 대표 우량 배당 (시총순)',
      shortLabel: '시총순 대표주',
      tooltip: 'safety' as const,
    },
  ];

  // 필터링 및 정렬
  const filteredStocks = useMemo(() => {
    let result = [...stocks];

    // 1. 시장 필터
    if (marketFilter !== 'ALL') {
      result = result.filter((s) => s.market === marketFilter);
    }

    // 2. 검색어 필터
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.ticker.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q)
      );
    }

    // 3. 탭별 조건 및 정렬
    if (activeTab === 'popular_monthly') {
      // ETF 중 월배당 종목 기준 popularityScore 상위 10개
      result = result
        .filter((s) => s.assetType === 'ETF' && s.dividendCycle === 'MONTHLY')
        .sort((a, b) => b.popularityScore - a.popularityScore)
        .slice(0, 10);
    } else if (activeTab === 'high_yield') {
      // dividendYield >= 6.0 내림차순
      result = result
        .filter((s) => s.dividendYield >= 6.0)
        .sort((a, b) => b.dividendYield - a.dividendYield);
    } else if (activeTab === 'market_cap') {
      // marketCap 내림차순
      result = result.sort((a, b) => b.marketCap - a.marketCap);
    }

    return result;
  }, [stocks, activeTab, marketFilter, searchQuery]);

  return (
    <div className="space-y-4">
      {/* 1. 상단 3대 큐레이션 탭 */}
      <div className="bg-slate-200/70 p-1 rounded-2xl flex gap-1">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1 ${
                isActive
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. 시장 필터 & 검색창 */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-sm space-y-2.5">
        <div className="flex items-center gap-2">
          {/* 시장 토글 */}
          <div className="flex bg-slate-100 p-0.5 rounded-xl shrink-0">
            {(['ALL', 'KR', 'US'] as MarketFilter[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMarketFilter(m)}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                  marketFilter === m
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {m === 'ALL' ? '전체' : m === 'KR' ? '🇰🇷 한국' : '🇺🇸 미국'}
              </button>
            ))}
          </div>

          {/* 검색 인풋 */}
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="티커 또는 종목명 검색..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* 안내 텍스트 */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span>
            조회 종목:{' '}
            <strong className="text-slate-700 font-bold">
              {filteredStocks.length}
            </strong>
            개
          </span>
          <span className="text-[10px]">종목 클릭 시 상세 모달</span>
        </div>
      </div>

      {/* 3. 종목 카드 리스트 */}
      {filteredStocks.length === 0 ? (
        <div className="py-12 text-center rounded-2xl bg-white border border-slate-200/80 p-6 space-y-2">
          <p className="text-sm font-bold text-slate-700">
            조건에 맞는 종목이 없습니다
          </p>
          <p className="text-xs text-slate-400">
            검색어나 시장 필터를 변경해보세요.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredStocks.map((stock, idx) => {
            const inPortfolio = portfolioTickers.has(stock.ticker);
            return (
              <StockCard
                key={stock.ticker}
                stock={stock}
                rank={activeTab === 'popular_monthly' ? idx + 1 : undefined}
                isInPortfolio={inPortfolio}
                onTogglePortfolio={onTogglePortfolio}
                onSelectStock={onSelectStock}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
