'use client';

import React, { useState } from 'react';
import { DividendStock, PortfolioItem } from '@/types/stock';
import Header from '@/components/Header';
import StockExplorer from '@/components/StockExplorer';
import EtfModal from '@/components/EtfModal';
import FireCalculator from '@/components/FireCalculator';
import InfoTooltip from '@/components/InfoTooltip';
import { Sparkles, ShieldCheck, Flame, PieChart, Calendar, Calculator, Compass, ShoppingBag } from 'lucide-react';

interface MainAppProps {
  initialStocks: DividendStock[];
}

export default function MainApp({ initialStocks }: MainAppProps) {
  // 메인 네비게이션 탭 (탐색 vs 파이어 역산기)
  const [navTab, setNavTab] = useState<'explorer' | 'calculator'>('explorer');

  // 포트폴리오 상태 (기본적으로 대표 종목 4개 사전 탑재)
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => {
    const defaultTickers = ['458730', 'JEPI', 'SCHD', '088980']; // TIGER 배당다우존스, JEPI, SCHD, 맥쿼리인프라
    const matched = initialStocks.filter((s) => defaultTickers.includes(s.ticker));
    const equalWeight = matched.length > 0 ? 100 / matched.length : 100;
    return matched.map((stock) => ({
      stock,
      weight: equalWeight,
    }));
  });

  // 상세 모달 상태
  const [selectedStock, setSelectedStock] = useState<DividendStock | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // 포트폴리오 티커 Set
  const portfolioTickers = new Set(portfolio.map((p) => p.stock.ticker));

  // 포트폴리오 토글 함수
  const handleTogglePortfolio = (stock: DividendStock) => {
    if (portfolioTickers.has(stock.ticker)) {
      setPortfolio((prev) => prev.filter((p) => p.stock.ticker !== stock.ticker));
    } else {
      const newLen = portfolio.length + 1;
      const equalWeight = 100 / newLen;
      const updated = [...portfolio.map((p) => ({ ...p, weight: equalWeight })), { stock, weight: equalWeight }];
      setPortfolio(updated);
    }
  };

  const handleRemoveFromPortfolio = (ticker: string) => {
    setPortfolio((prev) => prev.filter((p) => p.stock.ticker !== ticker));
  };

  const handleOpenModal = (stock: DividendStock) => {
    setSelectedStock(stock);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const krCount = initialStocks.filter((s) => s.market === 'KR').length;
  const usCount = initialStocks.filter((s) => s.market === 'US').length;

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 px-4 py-4 space-y-4">
        {/* 상단 핀테크 히어로 배너 */}
        <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 rounded-3xl p-5 text-white shadow-lg shadow-blue-500/15 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 flex-wrap mb-2.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-semibold text-blue-100 border border-white/20">
                <Sparkles size={12} className="text-amber-300" />
                <span>검증된 고배당 500 데이터</span>
              </div>
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200/60 shadow-xs">
                <ShieldCheck size={12} className="stroke-[2.5]" />
                <span>실측 데이터 100% 검증</span>
              </div>
            </div>

            <h2 className="text-xl font-bold tracking-tight leading-snug">
              매달 들어오는 배당금,<br />
              <span className="text-blue-200">배당패스</span>로 투명하게 설계하세요
            </h2>

            <p className="mt-1.5 text-xs text-blue-100/90 leading-relaxed font-normal">
              위조 없는 순수 실측치 500개 종목을 기반으로, 인기 순위와 배당률을 한눈에 비교하고 목표 은퇴 자본을 역산합니다.
            </p>

            {/* 메트릭 요약 바 */}
            <div className="grid grid-cols-3 gap-2 mt-3.5 pt-3 border-t border-white/15 text-center">
              <div>
                <div className="text-[10px] text-blue-200">총 검증 종목</div>
                <div className="text-sm font-extrabold text-white mt-0.5">{initialStocks.length}개</div>
              </div>
              <div>
                <div className="text-[10px] text-blue-200">국내 / 미국</div>
                <div className="text-sm font-extrabold text-white mt-0.5">{krCount} / {usCount}</div>
              </div>
              <div>
                <div className="text-[10px] text-blue-200">월배당 ETF 풀</div>
                <div className="text-sm font-extrabold text-white mt-0.5">
                  {initialStocks.filter((s) => s.assetType === 'ETF' && s.dividendCycle === 'MONTHLY').length}개
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 툴팁 & 투명성 가이드 카드 */}
        <section className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-sm">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-xs font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600 stroke-[2.5]" />
              배당패스 3대 산출 기준
            </h3>
            <span className="text-[10px] font-medium text-slate-400">물음표 터치/호버</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-slate-50 rounded-xl p-2 border border-slate-100 flex flex-col items-center justify-center">
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
                <Flame size={12} className="text-orange-500" />
                인기 점수
                <InfoTooltip type="popularity" />
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">AUM60% + 대금40%</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-2 border border-slate-100 flex flex-col items-center justify-center">
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
                <PieChart size={12} className="text-blue-500" />
                TTM 배당률
                <InfoTooltip type="ttm" />
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">12개월 실지급 기준</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-2 border border-slate-100 flex flex-col items-center justify-center">
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
                <Calendar size={12} className="text-rose-500" />
                안전 필터
                <InfoTooltip type="safety" />
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">시총하한 + 고위험</p>
            </div>
          </div>
        </section>

        {/* 메인 2대 기능 탭 전환 네비게이션 */}
        <section className="sticky top-[57px] z-30 bg-slate-50/95 backdrop-blur-md pt-1 pb-1">
          <div className="bg-slate-200/80 p-1 rounded-2xl flex gap-1 shadow-xs">
            <button
              type="button"
              onClick={() => setNavTab('explorer')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                navTab === 'explorer'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Compass size={15} />
              <span>3대 큐레이션 탐색</span>
            </button>

            <button
              type="button"
              onClick={() => setNavTab('calculator')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 relative ${
                navTab === 'calculator'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Calculator size={15} />
              <span>파이어 역산 시뮬레이터</span>
              {portfolio.length > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-blue-600 text-white text-[10px] font-mono leading-none">
                  {portfolio.length}
                </span>
              )}
            </button>
          </div>
        </section>

        {/* 탭 콘텐츠 렌더링 */}
        {navTab === 'explorer' ? (
          <StockExplorer
            stocks={initialStocks}
            portfolioTickers={portfolioTickers}
            onSelectStock={handleOpenModal}
            onTogglePortfolio={handleTogglePortfolio}
          />
        ) : (
          <FireCalculator
            portfolio={portfolio}
            allStocks={initialStocks}
            onRemoveFromPortfolio={handleRemoveFromPortfolio}
            onSetPortfolio={setPortfolio}
            onSelectStock={handleOpenModal}
          />
        )}
      </main>

      {/* ETF/주식 상세 모달 */}
      <EtfModal
        stock={selectedStock}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isInPortfolio={selectedStock ? portfolioTickers.has(selectedStock.ticker) : false}
        onTogglePortfolio={(stk) => {
          handleTogglePortfolio(stk);
        }}
      />

      {/* 푸터 */}
      <footer className="mt-8 border-t border-slate-200/80 bg-slate-50 px-4 py-6 text-center text-xs text-slate-400 space-y-1.5">
        <p className="font-semibold text-slate-500">배당패스 (Dividend Pass)</p>
        <p className="text-[11px] leading-relaxed">
          본 서비스에서 제공하는 배당수익률 및 지표는 과거 TTM 실측치 기반이며, 미래 수익을 보장하지 않습니다.
        </p>
        <p className="text-[10px] text-slate-400">© 2026 Dividend Pass. All rights reserved.</p>
      </footer>
    </div>
  );
}
