'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DividendStock, PortfolioItem } from '@/types/stock';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StockExplorer from '@/components/StockExplorer';
import EtfModal from '@/components/EtfModal';
import FireCalculator from '@/components/FireCalculator';
import InfoTooltip from '@/components/InfoTooltip';
import AdSenseSlot from '@/components/AdSenseSlot';
import { ALL_GUIDE_SUMMARIES } from '@/lib/guideArticles';
import {
  Sparkles,
  ShieldCheck,
  Flame,
  PieChart,
  Calendar,
  Calculator,
  Compass,
  ArrowRight,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface MainAppProps {
  initialStocks: DividendStock[];
}

const HOME_FAQS = [
  {
    q: '배당패스의 배당수익률(TTM)은 증권사 앱의 예상 배당률과 어떻게 다른가요?',
    a: '많은 증권사나 포털이 아직 지급되지 않은 미래 추정치나 가장 최근 1회분 배당금을 단순히 12배로 곱한 연환산 수치를 표기해 투자자에게 착시를 일으킵니다. 배당패스는 최근 12개월(Trailing Twelve Months, TTM) 동안 실제로 주주에게 지급 완료된 주당 배당금(DPS) 합계를 현재 주가로 나눈 정직한 실측 수익률을 기본 원칙으로 제공합니다.',
  },
  {
    q: '고위험 배당트랩(Dividend Trap) 종목은 어떤 기준으로 걸러내나요?',
    a: '일회성 부동산·자산 매각 차익으로 특정 연도에만 비정상적인 폭탄 배당을 지급했거나, 주가가 폭락하여 표면 배당수익률이 연 20%를 초과하는 자본잠식·실적 악화 의심 종목, 그리고 국내 시가총액 1,000억 원 미만·미국 시가총액 5억 달러($500M) 미만의 저유동성 종목을 3대 안전 필터링으로 엄격히 배제합니다.',
  },
  {
    q: '파이어(FIRE) 역산 시뮬레이터는 세금을 어떻게 반영하나요?',
    a: '투자자가 입력한 목표 월 배당금(세후 실수령액 기준)을 달성하기 위해 국내 상장 주식·ETF에는 배당소득세 15.4%(소득세 14% + 지방소득세 1.4%), 미국 직투 주식·ETF에는 한미조세조약에 따른 현지 원천징수세율 15.0%를 각각 개별 적용하여 실제 필요한 주당 세후 배당금과 매수 주식 수(단주 올림), 필요 투자 원금을 정밀 역산합니다.',
  },
  {
    q: '연간 배당금이 2,000만 원을 초과하면 어떤 세금·건보료 문제가 발생하나요?',
    a: '일반 증권 계좌에서 수령하는 연간 세전 이자·배당소득 합계액이 2,000만 원을 초과하면 15.4% 분리과세로 끝나지 않고 다른 근로·사업소득과 합산되어 최고 49.5%의 누진세율(금융소득종합과세)이 적용될 수 있습니다. 또한 건강보험 피부양자 자격이 박탈되어 지역가입자로 전환될 수 있으므로 중개형 ISA 및 연금저축·IRP 계좌로 자산을 분산해야 합니다.',
  },
];

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

  const featuredGuides = ALL_GUIDE_SUMMARIES.slice(0, 6);

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

        {/* 에디토리얼 섹션 1: 배당 투자 실전 가이드 칼럼 큐레이션 (AdSense 콘텐츠 가치 극대화) */}
        <section className="pt-8 border-t border-slate-200/80 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200/60">
                <BookOpen size={12} />
                <span>배당패스 리서치 & 지식 센터</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900">
                실패 없는 현금흐름을 위한 배당 투자 필독 칼럼
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                월배당 ETF 선별 기준부터 파이어족 원금 역산, 배당소득세·건보료 절세 전략까지 심층 가이드를 확인하세요.
              </p>
            </div>
            <Link
              href="/guide"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 shrink-0"
            >
              <span>전체 가이드 {ALL_GUIDE_SUMMARIES.length}편 모두 보기</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredGuides.map((guide) => (
              <Link
                key={guide.id}
                href={guide.href}
                className="group p-5 rounded-2xl bg-slate-50/70 hover:bg-white border border-slate-200/80 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                      {guide.badge}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock size={11} />
                      {guide.readTime}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                    {guide.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {guide.subtitle}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-medium text-slate-500">{guide.category}</span>
                  <span className="font-bold text-blue-600 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    읽기 <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 에디토리얼 섹션 2: 배당패스 데이터 검증 방법론 & 알고리즘 해설 */}
        <section className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <CheckCircle2 size={15} className="text-emerald-600" />
              <span>배당패스 정량 분석 방법론 (Methodology)</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              왜 많은 배당 투자자들이 배당패스 데이터를 기준으로 삼을까요?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">
                1. 미래 희망치가 아닌 100% TTM 실측 배당
              </h3>
              <p>
                운용사의 마케팅용 목표 분배율이나 단순 최근 분배금 연환산 수치에 의존하지 않습니다.
                과거 1년간 실제로 지급된 배당금 누적치(TTM DPS)를 기준으로 삼아, 계절적 변동이나 일회성 착시를 제거한 보수적이고 정직한 수익률을 산출합니다.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">
                2. 시총·거래대금 복합 인기 점수 (60:40)
              </h3>
              <p>
                단순히 배당률 숫자만 높은 소형 테마주가 상단에 노출되어 투자자를 현혹하는 것을 막기 위해,
                시가총액(AUM) 백분위 60%와 일일 거래대금 백분위 40%를 결합한 객관적인 알고리즘 인기 점수로 시장에서 검증된 대표 자산을 우선 큐레이션합니다.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">
                3. 한·미 세법 분기 및 단주 올림 정밀 역산
              </h3>
              <p>
                국내 자산(15.4% 원천징수)과 미국 자산(15.0% 현지 원천징수, 기준환율 적용)의 세율 차이를 종목별로 분리 계산하며,
                소수점 주식이 아닌 실제 매수 가능한 정수 주식 수(Math.ceil) 기준으로 목표 월 배당금 달성 원금과 금융소득종합과세 위험을 시뮬레이션합니다.
              </p>
            </div>
          </div>
        </section>

        {/* 에디토리얼 섹션 3: 배당패스 핵심 FAQ */}
        <section className="space-y-4 pb-4">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <HelpCircle size={20} className="text-blue-600" />
            <span>배당 투자 & 시뮬레이터 자주 묻는 질문 (FAQ)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {HOME_FAQS.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2"
              >
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-start gap-2">
                  <span className="text-blue-600 font-mono font-black shrink-0">Q{idx + 1}.</span>
                  <span>{item.q}</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 메인 화면 하단 반응형 광고 슬롯 */}
        <AdSenseSlot slotId="main-bottom" />
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
