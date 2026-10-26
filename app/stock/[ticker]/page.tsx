import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StockMiniCalculator from '@/components/StockMiniCalculator';
import AdSenseSlot from '@/components/AdSenseSlot';
import { getDividendStocks, getStockByTicker, getRelatedStocks } from '@/lib/data';
import { generateStockDeepAnalysis, formatWonHuman } from '@/lib/stockAnalysis';
import { SITE_URL } from '@/lib/site';
import {
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Flame,
  PieChart,
  Calendar,
  Calculator,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Coins,
  FileText,
  HelpCircle,
  BookOpen,
} from 'lucide-react';

interface StockPageProps {
  params: {
    ticker: string;
  };
}

// 500개 종목 SSG 정적 파라미터 생성
export async function generateStaticParams() {
  const stocks = await getDividendStocks();
  return stocks.map((stock) => ({
    ticker: stock.ticker,
  }));
}

// SEO 메타데이터 동적 생성
export async function generateMetadata({ params }: StockPageProps): Promise<Metadata> {
  const stock = await getStockByTicker(params.ticker);
  if (!stock) {
    return {
      title: '종목을 찾을 수 없습니다 - 배당패스',
    };
  }

  const isKr = stock.market === 'KR';
  const formattedDps = isKr
    ? `${Math.round(stock.dpsTtm).toLocaleString()}원`
    : `$${stock.dpsTtm.toFixed(2)}`;

  const cycleKorean =
    stock.dividendCycle === 'MONTHLY'
      ? '월배당'
      : stock.dividendCycle === 'QUARTERLY'
      ? '분기배당'
      : '연배당';

  const title = `${stock.name} (${stock.ticker}) 배당금·배당수익률·월배당 역산 분석 리포트 - 배당패스`;
  const description = `${stock.name}(${stock.ticker})의 과거 12개월(TTM) 배당수익률 ${stock.dividendYield.toFixed(2)}%, 연간 주당 배당금 ${formattedDps}, ${cycleKorean} 주기, 월 30만·100만 원 배당 달성 필요 원금 및 절세 계좌 시뮬레이션 리포트.`;

  // 인기점수 상위 핵심 대표 종목(85점 이상)만 검색엔진 색인 허용하여
  // 대량 프로그래매틱 페이지로 인한 중복/저품질(Thin Content) 판정 원천 차단
  const isFlagshipStock = stock.popularityScore >= 85;

  return {
    title,
    description,
    alternates: {
      canonical: `/stock/${stock.ticker}`,
    },
    robots: {
      index: isFlagshipStock,
      follow: true,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${SITE_URL}/stock/${stock.ticker}`,
      siteName: '배당패스 (Dividend Pass)',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function StockDetailPage({ params }: StockPageProps) {
  const allStocks = await getDividendStocks();
  const stock = await getStockByTicker(params.ticker);

  if (!stock) {
    notFound();
  }

  // 유사 배당률 및 동일 배당주기 추천 종목 4선 로드
  const relatedStocks = await getRelatedStocks(stock, 4);

  // 종목별 고유 정량 분석 리포트 및 시뮬레이션 생성
  const deepAnalysis = generateStockDeepAnalysis(stock, allStocks);

  const isKr = stock.market === 'KR';
  const isMonthly = stock.dividendCycle === 'MONTHLY';

  // 가격 포맷팅
  const formattedPrice = isKr
    ? `${Math.round(stock.price).toLocaleString()}원`
    : `$${stock.price.toFixed(2)}`;

  // 연간 배당금 포맷팅
  const formattedDps = isKr
    ? `${Math.round(stock.dpsTtm).toLocaleString()}원`
    : `$${stock.dpsTtm.toFixed(2)}`;

  // 시가총액 포맷팅
  const formattedMcap = isKr
    ? stock.marketCap >= 1_000_000_000_000
      ? `${(stock.marketCap / 1_000_000_000_000).toFixed(2)}조 원`
      : `${(stock.marketCap / 100_000_000).toFixed(0)}억 원`
    : stock.marketCap >= 1_000_000_000
    ? `$${(stock.marketCap / 1_000_000_000).toFixed(2)}B`
    : `$${(stock.marketCap / 1_000_000).toFixed(1)}M`;

  // 배당 주기 한국어 변환
  const cycleKorean =
    stock.dividendCycle === 'MONTHLY'
      ? '매월 (월배당)'
      : stock.dividendCycle === 'QUARTERLY'
      ? '분기별 (3·6·9·12월)'
      : '연 1회 (연배당)';

  // 세율 안내
  const taxRate = isKr ? '15.4%' : '15.0%';

  // FAQ JSON-LD 구조화 데이터
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: deepAnalysis.faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <div className="flex-1 flex flex-col bg-white min-h-screen text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* 브레드크럼 네비게이션 */}
        <nav aria-label="브레드크럼" className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            홈
          </Link>
          <span className="text-slate-300">/</span>
          <Link href="/#stock-explorer" className="hover:text-blue-600 transition-colors">
            배당주 탐색
          </Link>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-700 truncate max-w-[200px] sm:max-w-none">
            {stock.name} ({stock.ticker})
          </span>
        </nav>

        {/* 1. 상단 히어로 헤더 카드 */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* 뱃지 그룹 */}
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  isKr
                    ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                    : 'bg-blue-50 text-blue-700 border border-blue-200/60'
                }`}
              >
                {isKr ? '🇰🇷 한국' : '🇺🇸 미국'}
              </span>
              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                {stock.ticker}
              </span>
              <span className="text-xs font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
                {stock.assetType === 'ETF' ? '상장지수펀드 (ETF)' : '일반 주식'}
              </span>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200/60">
                {deepAnalysis.yieldTierBadge}
              </span>
              {isMonthly ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/70">
                  <Calendar size={12} className="text-emerald-600" />
                  <span>인기 월배당</span>
                </span>
              ) : (
                <span className="text-xs font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
                  {cycleKorean}
                </span>
              )}
            </div>

            {/* 인기 점수 */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50/80 text-blue-700 text-xs font-bold border border-blue-200/60">
              <Flame size={13} className="text-blue-600" />
              <span>인기 점수 {stock.popularityScore.toFixed(1)}점</span>
            </div>
          </div>

          {/* 종목명 및 핵심 시세 */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {stock.name} ({stock.ticker}) 배당 분석 리포트
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              시장 분류: {stock.market === 'KR' ? '한국거래소 (KRX)' : '미국 증권시장 (US)'} ·{' '}
              {isKr ? '국내' : '미국'} 배당률 순위{' '}
              <strong className="text-slate-800">
                {deepAnalysis.metrics.marketYieldRank}위 / {deepAnalysis.metrics.marketStocksCount}개 (상위 {deepAnalysis.metrics.yieldPercentile}%)
              </strong>
            </p>
          </div>

          {/* 핵심 요약 그리드 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 space-y-1">
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <TrendingUp size={13} />
                배당수익률 (TTM)
              </span>
              <div className="text-xl sm:text-2xl font-black text-emerald-700">
                {stock.dividendYield.toFixed(2)}%
              </div>
              <p className="text-[11px] text-emerald-600/90">
                시장 평균({deepAnalysis.metrics.marketAvgYield.toFixed(2)}%) 대비{' '}
                {deepAnalysis.metrics.yieldDiffFromAvg >= 0
                  ? `+${deepAnalysis.metrics.yieldDiffFromAvg.toFixed(2)}%p`
                  : `${deepAnalysis.metrics.yieldDiffFromAvg.toFixed(2)}%p`}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="text-xs font-semibold text-slate-500">현재가</span>
              <div className="text-xl sm:text-2xl font-bold text-slate-900">
                {formattedPrice}
              </div>
              <p className="text-[11px] text-slate-400">최근 종가 기준</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="text-xs font-semibold text-slate-500">연간 주당 배당금</span>
              <div className="text-xl sm:text-2xl font-bold text-slate-900">
                {formattedDps}
              </div>
              <p className="text-[11px] text-slate-400">1주당 연간 누적</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="text-xs font-semibold text-slate-500">배당 주기</span>
              <div className="text-xl sm:text-2xl font-bold text-slate-900">
                {stock.dividendCycle === 'MONTHLY'
                  ? '매월 지급'
                  : stock.dividendCycle === 'QUARTERLY'
                  ? '분기 지급'
                  : '연간 지급'}
              </div>
              <p className="text-[11px] text-slate-400">{cycleKorean}</p>
            </div>
          </div>

          {/* 메인 앱 연동 CTA 바 */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <Link
              href={`/?select=${stock.ticker}#fire-simulator`}
              className="flex-1 py-3.5 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm text-center flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
            >
              <Calculator size={17} />
              <span>메인 앱에서 이 종목으로 파이어 역산하기</span>
              <ArrowRight size={15} />
            </Link>
            <Link
              href={`/?select=${stock.ticker}`}
              className="py-3.5 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm text-center flex items-center justify-center gap-1.5 transition-colors"
            >
              <Coins size={16} className="text-slate-600" />
              <span>포트폴리오에 담기</span>
            </Link>
          </div>
        </section>

        {/* 2. 종목별 심층 정량 분석 리포트 (고유 해설 섹션) */}
        <section className="p-6 sm:p-7 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-5">
          <div className="flex items-center justify-between gap-2 flex-wrap border-b border-slate-200/80 pb-4">
            <div className="flex items-center gap-2">
              <FileText size={20} className="text-blue-600" />
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {stock.name} 심층 배당 프로파일 & 포지셔닝 분석
              </h2>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60">
              {deepAnalysis.yieldTierTitle}
            </span>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-1.5">
              <h3 className="font-bold text-slate-900 text-sm">
                01. 시장 내 배당수익률 랭킹 및 밸류에이션 위치
              </h3>
              <p>{deepAnalysis.positioningSummary}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-1.5">
              <h3 className="font-bold text-slate-900 text-sm">
                02. 배당 재원 구조 및 지속가능성 진단
              </h3>
              <p>{deepAnalysis.sustainabilityAnalysis}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-1.5">
              <h3 className="font-bold text-slate-900 text-sm">
                03. 배당 지급 주기({cycleKorean}) 활용 현금흐름 전략
              </h3>
              <p>{deepAnalysis.cycleStrategyAnalysis}</p>
            </div>
          </div>
        </section>

        {/* 3. 단일 종목 실시간 목표 배당금 계산기 */}
        <StockMiniCalculator stock={stock} />

        {/* 4. 목표 월 배당금 단계별(10만~200만 원) 필요 원금 & 세금 정밀 시뮬레이션 표 */}
        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="text-blue-600" size={20} />
              <span>{stock.name} 목표 월 배당금별 필요 주식 수 & 투자 원금 조견표</span>
            </h2>
            <p className="text-xs text-slate-500">
              {isKr ? '국내 배당소득세(15.4%)' : '미국 현지 배당소득세(15.0%, 환율 1,350원 기준)'} 차감 후 실제 통장에 입금되는 세후 월평균 수령액 기준 역산 결과입니다.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-800">
                  <th className="p-3 sm:p-3.5 font-bold whitespace-nowrap">목표 세후 현금흐름</th>
                  <th className="p-3 sm:p-3.5 font-bold whitespace-nowrap">필요 주식 수</th>
                  <th className="p-3 sm:p-3.5 font-bold whitespace-nowrap">필요 투자 원금</th>
                  <th className="p-3 sm:p-3.5 font-bold whitespace-nowrap">세전 연 배당금</th>
                  <th className="p-3 sm:p-3.5 font-bold whitespace-nowrap">원천징수 세금({taxRate})</th>
                  <th className="p-3 sm:p-3.5 font-bold whitespace-nowrap">과세 구간 판정</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deepAnalysis.scenarios.map((sc) => (
                  <tr key={sc.targetMonthlyNetWon} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3 sm:p-3.5 font-bold text-slate-900 whitespace-nowrap bg-slate-50/40">
                      {sc.label}
                    </td>
                    <td className="p-3 sm:p-3.5 font-mono font-bold text-blue-600 whitespace-nowrap">
                      {sc.requiredShares.toLocaleString()}주
                    </td>
                    <td className="p-3 sm:p-3.5 font-bold text-slate-900 whitespace-nowrap">
                      약 {formatWonHuman(sc.requiredCapitalWon)}
                    </td>
                    <td className="p-3 sm:p-3.5 text-slate-700 whitespace-nowrap">
                      연 {formatWonHuman(sc.annualGrossWon)}
                    </td>
                    <td className="p-3 sm:p-3.5 text-rose-600 whitespace-nowrap">
                      -{formatWonHuman(sc.annualTaxWon)}
                    </td>
                    <td className="p-3 sm:p-3.5 whitespace-nowrap">
                      {sc.isComprehensiveTaxWarning ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/70">
                          ⚠️ 종합과세 대상 (ISA·분산 권장)
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                          ✓ 분리과세 안전
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 상단 반응형 광고 슬롯 */}
        <AdSenseSlot slotId="stock-detail-top" />

        {/* 5. 핵심 투자 지표 상세 테이블 */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="text-blue-600" size={20} />
            핵심 배당 및 펀더멘털 지표 상세
          </h2>

          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden divide-y divide-slate-100 text-sm">
            <div className="flex items-center justify-between p-4 bg-slate-50/50">
              <span className="font-medium text-slate-600">배당수익률 (Dividend Yield)</span>
              <span className="font-bold text-emerald-600 text-base">{stock.dividendYield.toFixed(2)}% (TTM)</span>
            </div>
            <div className="flex items-center justify-between p-4">
              <span className="font-medium text-slate-600">연간 주당 배당금 (DPS)</span>
              <span className="font-semibold text-slate-900">{formattedDps}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50/50">
              <span className="font-medium text-slate-600">배당 주기 (Dividend Frequency)</span>
              <span className="font-semibold text-slate-900">{cycleKorean}</span>
            </div>
            <div className="flex items-center justify-between p-4">
              <span className="font-medium text-slate-600">시가총액 (Market Cap · 시장 내 {deepAnalysis.metrics.marketCapRank}위)</span>
              <span className="font-semibold text-slate-900">{formattedMcap}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50/50">
              <span className="font-medium text-slate-600">일일 거래량 (Trading Volume)</span>
              <span className="font-semibold text-slate-900">{stock.volume.toLocaleString()}주</span>
            </div>
            <div className="flex items-center justify-between p-4">
              <span className="font-medium text-slate-600">알고리즘 인기 점수 (AUM 60% + 거래 40%)</span>
              <span className="font-bold text-blue-600">{stock.popularityScore.toFixed(1)}점 / 100점</span>
            </div>
            {stock.isEtf && (
              <div className="flex items-center justify-between p-4 bg-slate-50/50">
                <span className="font-medium text-slate-600">ETF 연간 총보수율 (Expense Ratio)</span>
                <span className="font-semibold text-slate-900">{stock.expenseRatio.toFixed(2)}%</span>
              </div>
            )}
            <div className="flex items-center justify-between p-4">
              <span className="font-medium text-slate-600">배당 데이터 산출 기준</span>
              <span className="font-semibold text-slate-900">
                {stock.yieldBasis === 'ANNUALIZED' ? '연환산 (최근 분배금 기준)' : '과거 12개월(TTM) 실제 지급 누적치'}
              </span>
            </div>
          </div>
        </section>

        {/* 6. ETF 고유 정보: 상위 편입 비중 (ETF인 경우 노출) */}
        {stock.isEtf && (
          <section className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <PieChart className="text-blue-600" size={20} />
              ETF 상위 편입 비중 및 포트폴리오 구성
            </h2>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-semibold text-slate-500">운용 총보수</span>
                <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                  연 {stock.expenseRatio.toFixed(2)}%
                </span>
              </div>

              {stock.topHoldings && stock.topHoldings.length > 0 ? (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-700">
                      상위 편입 종목 TOP {stock.topHoldings.length} (공시 비중순)
                    </h3>
                    <span className="text-[10px] text-slate-400">자산운용사 최신 공시 기준</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {stock.topHoldings.map((holding, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/60 text-xs"
                      >
                        <span className="shrink-0 w-5 h-5 rounded-md bg-blue-50 text-blue-600 font-bold text-[10px] flex items-center justify-center border border-blue-100">
                          #{idx + 1}
                        </span>
                        <span className="font-semibold text-slate-800 truncate">
                          {holding}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-slate-400 space-y-1">
                  <p>상위 편입 종목 상세 데이터는 자산운용사 공식 공시를 참조하세요.</p>
                  <p className="text-[11px] text-slate-400">
                    기초지수 추종 및 자산 배분 전략에 따라 편입 비중이 정기 리밸런싱됩니다.
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 7. 5,000만 원 투자 시 세금 시뮬레이션 및 절세 가이드 카드 */}
        <section className="p-6 rounded-3xl bg-blue-50/60 border border-blue-200/60 space-y-4">
          <div className="flex items-center gap-2">
            <Coins className="text-blue-600" size={19} />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {stock.name} 5,000만 원 거치 시 세금({taxRate}) 시뮬레이션 & 절세 전략
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {deepAnalysis.taxAccountAnalysis}
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href="/guide/dividend-tax"
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-800 hover:underline"
            >
              <BookOpen size={13} />
              <span>배당소득세 15.4%와 2,000만 원 종합과세 가이드 읽기</span>
              <ArrowRight size={13} />
            </Link>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <Link
              href="/guide/isa-pension-account-strategy"
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
            >
              <ShieldCheck size={13} />
              <span>ISA·연금저축 절세 계좌 200% 활용법 보기</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </section>

        {/* 중간 반응형 광고 슬롯 */}
        <AdSenseSlot slotId="stock-detail-mid" />

        {/* 8. 종목별 자주 묻는 질문 (FAQ 4문 4답) */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="text-blue-600" size={20} />
            <span>{stock.name} ({stock.ticker}) 투자자 자주 묻는 질문 (FAQ)</span>
          </h2>

          <div className="space-y-3">
            {deepAnalysis.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2"
              >
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-start gap-2">
                  <span className="text-blue-600 font-mono font-black shrink-0">Q{idx + 1}.</span>
                  <span>{faq.question}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 9. 유사 배당률 및 동일 배당주기 추천 종목 4선 */}
        {relatedStocks && relatedStocks.length > 0 && (
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="text-blue-600" size={20} />
                <span>{stock.name}과(와) 비교해 볼 만한 유사 배당주 4선</span>
              </h2>
              <span className="text-xs text-slate-400">
                동일 {cycleKorean} 및 유사 배당률 기준 4선
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {relatedStocks.map((rel) => {
                const relIsKr = rel.market === 'KR';
                const relDps = relIsKr
                  ? `${Math.round(rel.dpsTtm).toLocaleString()}원`
                  : `$${rel.dpsTtm.toFixed(2)}`;
                const relCycle =
                  rel.dividendCycle === 'MONTHLY'
                    ? '월배당'
                    : rel.dividendCycle === 'QUARTERLY'
                    ? '분기배당'
                    : '연배당';

                return (
                  <Link
                    key={rel.ticker}
                    href={`/stock/${rel.ticker}`}
                    className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between group space-y-3 cursor-pointer"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            relIsKr
                              ? 'bg-rose-50 text-rose-600 border border-rose-200/60'
                              : 'bg-blue-50 text-blue-600 border border-blue-200/60'
                          }`}
                        >
                          {relIsKr ? '🇰🇷 국내' : '🇺🇸 미국'}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-slate-400">
                          {rel.ticker}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {rel.name}
                      </h3>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-500">배당수익률</span>
                        <span className="text-sm font-black text-emerald-600">
                          {rel.dividendYield.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>배당주기</span>
                        <span className="font-medium text-slate-600">{relCycle}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>연 DPS</span>
                        <span className="font-medium text-slate-600">{relDps}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* 10. 금융 투자 면책고지 */}
        <section className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs text-slate-500 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <AlertCircle size={14} className="text-slate-500" />
            <span>투자 유의사항 및 면책고지</span>
          </div>
          <p className="leading-relaxed">
            본 리포트에서 제공하는 <strong>{stock.name} ({stock.ticker})</strong>의 배당수익률, 주당 배당금 및 역산 시뮬레이션은 과거 12개월(TTM) 동안 실제 지급된 이력을 바탕으로 한 정보 제공 목적의 자료이며, 미래의 배당금 지속 지급이나 원금 보존을 보장하지 않습니다. 최종 투자 판단과 책임은 투자자 본인에게 있습니다.
          </p>
        </section>

        {/* 하단 네비게이션 버튼 */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200/80">
          <Link
            href="/#stock-explorer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>500개 배당주 탐색으로 돌아가기</span>
          </Link>
          <Link
            href={`/?select=${stock.ticker}#fire-simulator`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>이 종목으로 파이어 역산하기</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
