'use client';

import React, { useState, useEffect } from 'react';
import { DividendStock, PortfolioItem } from '@/types/stock';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StockExplorer from '@/components/StockExplorer';
import EtfModal from '@/components/EtfModal';
import FireCalculator from '@/components/FireCalculator';
import InfoTooltip from '@/components/InfoTooltip';
import { Sparkles, ShieldCheck, Flame, PieChart, Calendar, Calculator, Compass, ArrowRight } from 'lucide-react';

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

  // URL 쿼리 파라미터(?select=TICKER) 처리
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const selectTicker = params.get('select');
    if (selectTicker) {
      const target = initialStocks.find((s) => s.ticker.toLowerCase() === selectTicker.toLowerCase());
      if (target) {
        setPortfolio((prev) => {
          if (prev.some((p) => p.stock.ticker === target.ticker)) return prev;
          const newLen = prev.length + 1;
          const equalWeight = 100 / newLen;
          return [...prev.map((p) => ({ ...p, weight: equalWeight })), { stock: target, weight: equalWeight }];
        });
        if (window.location.hash.includes('fire-simulator')) {
          setNavTab('calculator');
        }
      }
    }
  }, [initialStocks]);

  // 포트폴리오 티커 Set
  const portfolioTickers = new Set(portfolio.map((p) => p.stock.ticker));

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
  const monthlyCount = initialStocks.filter((s) => s.assetType === 'ETF' && s.dividendCycle === 'MONTHLY').length;

  return (
    <div className="flex-1 flex flex-col bg-white min-h-screen">
      <Header />

      {/* 전체 풀 반응형 메인 컨테이너 (모바일 375px ~ 데스크탑 1280px+ max-w-7xl) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-5 space-y-3.5 sm:space-y-4">
        {/* 청약패스 벤치마크 산뜻한 텍스트 헤드라인 히어로 (Above the Fold 최적화) */}
        <section className="text-center max-w-3xl mx-auto pt-1 sm:pt-2 space-y-2">
          {/* 메트릭 칩 태그 인라인 정돈 */}
          <div className="inline-flex items-center gap-1.5 flex-wrap justify-center">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-200/60 shadow-xs">
              <Sparkles size={11} className="text-blue-600" />
              <span>검증 고배당 500 종목</span>
            </div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200/60 shadow-xs">
              <ShieldCheck size={11} className="stroke-[2.5]" />
              <span>실측치 100% 검증</span>
            </div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200/60 shadow-xs">
              <span>국내 {krCount} · 미국 {usCount} · 월배당 {monthlyCount}</span>
            </div>
          </div>

          <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
            매달 들어오는 배당금,{' '}
            <span className="text-blue-600 underline decoration-blue-200 underline-offset-4">배당패스</span>로 투명하게
          </h2>

          {/* 청약패스식 미니멀 1줄 인라인 투명성 배너 (Above the Fold 최적화) */}
          <div className="bg-blue-50/70 border border-blue-200/60 p-2 sm:p-2.5 rounded-xl flex items-center justify-center gap-3 sm:gap-6 text-[11px] text-slate-600 flex-wrap">
            <div className="flex items-center gap-1 font-semibold text-slate-800">
              <Flame size={13} className="text-orange-500" />
              <span>인기점수 (AUM 60%+거래 40%)</span>
              <InfoTooltip type="popularity" iconSize={12} />
            </div>
            <div className="hidden sm:inline w-1 h-1 rounded-full bg-blue-300" />
            <div className="flex items-center gap-1 font-semibold text-slate-800">
              <PieChart size={13} className="text-blue-500" />
              <span>TTM 배당률 (실지급 DPS)</span>
              <InfoTooltip type="ttm" iconSize={12} />
            </div>
            <div className="hidden sm:inline w-1 h-1 rounded-full bg-blue-300" />
            <div className="flex items-center gap-1 font-semibold text-slate-800">
              <Calendar size={13} className="text-rose-500" />
              <span>안전필터 (시총 미달 제외)</span>
              <InfoTooltip type="safety" iconSize={12} />
            </div>
          </div>
        </section>

        {/* 메인 2대 기능 탭 전환 네비게이션 */}
        <section className="sticky top-[61px] z-30 bg-white/95 backdrop-blur-md py-1.5">
          <div className="bg-slate-100 p-1 rounded-xl sm:rounded-2xl flex max-w-md mx-auto sm:max-w-none gap-1 border border-slate-200/60 shadow-xs">
            <button
              type="button"
              onClick={() => setNavTab('explorer')}
              className={`flex-1 py-2.5 px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
                navTab === 'explorer'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass size={17} />
              <span>3대 큐레이션 탐색</span>
            </button>

            <button
              type="button"
              onClick={() => setNavTab('calculator')}
              className={`flex-1 py-2.5 px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 relative ${
                navTab === 'calculator'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calculator size={17} />
              <span>파이어 역산 시뮬레이터</span>
              {portfolio.length > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-mono leading-none">
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

      {/* 모바일 전용 플로팅 담기 바 (담은 종목이 있고 탐색 탭일 때 즉시 시뮬레이터 점프) */}
      {portfolio.length > 0 && navTab === 'explorer' && (
        <aside className="sm:hidden fixed bottom-4 left-4 right-4 z-40 animate-in slide-in-from-bottom-3 duration-200">
          <div className="bg-slate-900/95 text-white p-3 rounded-2xl shadow-xl backdrop-blur-md border border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-mono text-xs flex items-center justify-center font-black shrink-0">
                {portfolio.length}
              </span>
              <div className="truncate">
                <span className="text-xs font-bold text-white">포트폴리오 {portfolio.length}개 담김</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setNavTab('calculator');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 text-xs font-bold bg-blue-600 text-white px-3.5 py-2 rounded-xl hover:bg-blue-700 active:scale-95 transition-all shrink-0 shadow-sm"
            >
              <span>배당 역산하기</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </aside>
      )}

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

      {/* 글로벌 푸터 */}
      <Footer />
    </div>
  );
}
