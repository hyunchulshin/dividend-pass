'use client';

import React, { useState, useMemo } from 'react';
import { DividendStock, CurationTab, MarketFilter } from '@/types/stock';
import StockCard from '@/components/StockCard';
import InfoTooltip from '@/components/InfoTooltip';
import { Search, Flame, SlidersHorizontal, Sparkles } from 'lucide-react';

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
      description: '월배당 ETF 중 인기 점수 최상위 10개',
      tooltip: 'popularity' as const,
    },
    {
      id: 'high_yield' as CurationTab,
      label: '💰 고배당 알짜 (6%+)',
      shortLabel: '고배당 6%+',
      description: '연 6% 이상 높은 배당수익률 순',
      tooltip: 'ttm' as const,
    },
    {
      id: 'market_cap' as CurationTab,
      label: '🏛️ 대표 우량 배당 (시총순)',
      shortLabel: '시총순 대표주',
      description: '시가총액 규모 최상위 우량 배당주',
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
      result = result
        .filter((s) => s.assetType === 'ETF' && s.dividendCycle === 'MONTHLY')
        .sort((a, b) => b.popularityScore - a.popularityScore)
        .slice(0, 10);
    } else if (activeTab === 'high_yield') {
      result = result
        .filter((s) => s.dividendYield >= 6.0)
        .sort((a, b) => b.dividendYield - a.dividendYield);
    } else if (activeTab === 'market_cap') {
      result = result.sort((a, b) => b.marketCap - a.marketCap);
    }

    return result;
  }, [stocks, activeTab, marketFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* 1. 상단 3대 큐레이션 탭 & 툴바 (데스크탑 와이드 정렬) */}
      <div className="space-y-3.5">
        {/* 탭 버튼 그룹 (청약패스식 밝은 bg-slate-100 & 섬세한 보더) */}
        <div className="bg-slate-100 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row gap-1 border border-slate-200/60 shadow-xs">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2.5 sm:py-3 px-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-extrabold transition-all text-center flex items-center justify-center gap-1.5 ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 2. 시장 필터 & 검색창 툴바 (데스크탑 2열 와이드 배치 & 모바일 flex-wrap 패딩 완벽 안착) */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 sm:gap-3 max-w-full overflow-hidden">
          {/* 좌측: 시장 필터 토글 */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-500 hidden sm:inline">시장:</span>
            <div className="flex bg-slate-100 p-1 rounded-xl shrink-0 border border-slate-200/60">
              {(['ALL', 'KR', 'US'] as MarketFilter[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMarketFilter(m)}
                  className={`py-1.5 px-3 sm:px-4 rounded-lg text-xs font-bold transition-all ${
                    marketFilter === m
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {m === 'ALL' ? '전체 시장' : m === 'KR' ? '🇰🇷 한국' : '🇺🇸 미국'}
                </button>
              ))}
            </div>
          </div>

          {/* 우측: 검색 인풋 및 수량 표시 (모바일 375px 내 min-w-0 안전 수용) */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 md:max-w-md w-full min-w-0 max-w-full">
            <div className="relative flex-1 min-w-0">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="티커 또는 종목명 검색"
                className="w-full min-w-0 pl-8 pr-2.5 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all box-border"
              />
            </div>
            <div className="text-xs font-bold text-slate-500 shrink-0 whitespace-nowrap bg-slate-50 px-2 py-2 rounded-xl border border-slate-200/60 leading-none flex items-center">
              <span className="text-blue-600 font-black mr-0.5">{filteredStocks.length}</span>개
            </div>
          </div>
        </div>
      </div>

      {/* 3. 종목 카드 목록: 모바일 1열 -> 태블릿 2열 -> 데스크탑 3열 반응형 그리드 */}
      {filteredStocks.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-white border border-slate-200/80 p-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search size={22} />
          </div>
          <p className="text-base font-bold text-slate-800">
            조건에 일치하는 배당 종목이 없습니다
          </p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            검색어를 지우거나 시장 필터를 [전체 시장]으로 변경하여 탐색해보세요.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
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
