'use client';

import React, { useState } from 'react';
import { DividendStock, PortfolioItem } from '@/types/stock';
import Header from '@/components/Header';
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
    <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
      <Header />

      {/* 전체 풀 반응형 메인 컨테이너 (모바일 375px ~ 데스크탑 1280px+ max-w-7xl) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* 상단 핀테크 히어로 배너 (데스크탑 와이드 반응형) */}
        <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-500/15 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-blue-100 border border-white/20">
                  <Sparkles size={13} className="text-amber-300" />
                  <span>검증된 고배당 500 데이터셋</span>
                </div>
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/60 shadow-xs">
                  <ShieldCheck size={13} className="stroke-[2.5]" />
                  <span>실측 데이터 100% 검증</span>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                매달 들어오는 배당금,<br />
                <span className="text-blue-200">배당패스</span>로 투명하게 설계하세요
              </h2>

              <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-normal">
                위조 없는 순수 실측치 500개 종목을 기반으로, 인기 순위와 배당률을 한눈에 비교하고 목표 은퇴 자본을 정밀하게 역산합니다.
              </p>
            </div>

            {/* 우측 메트릭 대시보드 카드 */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4 bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/15 text-center shrink-0 lg:min-w-[340px]">
              <div>
                <div className="text-[11px] text-blue-200 font-medium">총 검증 종목</div>
                <div className="text-lg sm:text-2xl font-black text-white mt-0.5">{initialStocks.length}개</div>
              </div>
              <div className="border-x border-white/15 px-2">
                <div className="text-[11px] text-blue-200 font-medium">국내 / 미국</div>
                <div className="text-lg sm:text-2xl font-black text-white mt-0.5">{krCount} / {usCount}</div>
              </div>
              <div>
                <div className="text-[11px] text-blue-200 font-medium">월배당 ETF 풀</div>
                <div className="text-lg sm:text-2xl font-black text-white mt-0.5">{monthlyCount}개</div>
              </div>
            </div>
          </div>
        </section>

        {/* 투명성 3대 산출 기준 가이드 카드 */}
        <section className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-emerald-600 stroke-[2.5]" />
              배당패스 3대 산출 기준 & 투명성 가이드
            </h3>
            <span className="text-xs font-medium text-slate-400">물음표 터치/호버 시 상세 안내</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 text-center">
            <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-100 flex flex-col items-center justify-center">
              <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                <Flame size={14} className="text-orange-500" />
                인기 점수
                <InfoTooltip type="popularity" iconSize={14} />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">시가총액 60% + 거래대금 40% 순수 공식</p>
            </div>

            <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-100 flex flex-col items-center justify-center">
              <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                <PieChart size={14} className="text-blue-500" />
                TTM 배당수익률
                <InfoTooltip type="ttm" iconSize={14} />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">최근 12개월 과거 실지급 DPS 누적 기준</p>
            </div>

            <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-100 flex flex-col items-center justify-center">
              <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                <Calendar size={14} className="text-rose-500" />
                안전 필터링
                <InfoTooltip type="safety" iconSize={14} />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">국내 1천억 / 미국 $500M 미만 제외 & 고위험</p>
            </div>
          </div>
        </section>

        {/* 메인 2대 기능 탭 전환 네비게이션 */}
        <section className="sticky top-[65px] z-30 bg-slate-50/95 backdrop-blur-md pt-2 pb-2">
          <div className="bg-slate-200/80 p-1.5 rounded-2xl flex max-w-md mx-auto sm:max-w-none gap-1 shadow-xs">
            <button
              type="button"
              onClick={() => setNavTab('explorer')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 ${
                navTab === 'explorer'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Compass size={17} />
              <span>3대 큐레이션 탐색</span>
            </button>

            <button
              type="button"
              onClick={() => setNavTab('calculator')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 relative ${
                navTab === 'calculator'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
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

      {/* 푸터 (데스크탑 와이드 정렬) */}
      <footer className="mt-12 border-t border-slate-200/80 bg-white px-4 sm:px-6 lg:px-8 py-8 text-center text-xs text-slate-400 space-y-2">
        <div className="max-w-7xl mx-auto space-y-2">
          <p className="font-bold text-slate-600 text-sm">배당패스 (Dividend Pass)</p>
          <p className="text-xs leading-relaxed max-w-2xl mx-auto">
            본 서비스에서 제공하는 배당수익률 및 지표는 과거 12개월(TTM) 실측치 기반이며, 미래 수익을 보장하지 않습니다.
            투자 결과에 대한 책임은 본인에게 있습니다.
          </p>
          <p className="text-[11px] text-slate-400">© 2026 Dividend Pass. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
