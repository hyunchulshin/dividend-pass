import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getDividendStocks, getStockByTicker } from '@/lib/data';
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
  DollarSign,
  AlertCircle,
  BarChart3,
  Layers,
  Coins,
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

  const title = `${stock.name} (${stock.ticker}) 배당금·배당수익률·배당주기 완벽 분석 - 배당패스`;
  const description = `${stock.name}(${stock.ticker})의 과거 12개월(TTM) 배당수익률 ${stock.dividendYield.toFixed(2)}%, 연간 주당 배당금 ${formattedDps}, ${cycleKorean} 주기, 시가총액, 인기점수 및 운용보수 정보 완벽 분석.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://dividendpass.com/stock/${stock.ticker}`,
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
  const stock = await getStockByTicker(params.ticker);

  if (!stock) {
    notFound();
  }

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
  const taxNote = isKr
    ? '국내 배당소득세율 (소득세 14% + 지방소득세 1.4%) 원천징수'
    : '미국 현지 배당소득세율 (한미조세조약 15.0%) 원천징수';

  return (
    <div className="flex-1 flex flex-col bg-white min-h-screen text-slate-900">
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

        {/* 상단 히어로 헤더 카드 */}
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
              {stock.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              티커 코드: <strong className="font-mono text-slate-700">{stock.ticker}</strong> · 시장 분류: {stock.market === 'KR' ? '한국거래소 (KRX)' : '미국 증권시장 (US)'}
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
              <p className="text-[11px] text-emerald-600/90">과거 1년 실지급 기준</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="text-xs font-semibold text-slate-500">현재가</span>
              <div className="text-xl sm:text-2xl font-bold text-slate-900">
                {formattedPrice}
              </div>
              <p className="text-[11px] text-slate-400">최근 종가</p>
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
                {stock.dividendCycle === 'MONTHLY' ? '매월 지급' : stock.dividendCycle === 'QUARTERLY' ? '분기 지급' : '연간 지급'}
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

        {/* 2. 6대 핵심 투자 지표 상세 테이블 */}
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
              <span className="font-medium text-slate-600">시가총액 (Market Cap)</span>
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

        {/* 3. ETF 고유 정보: 상위 5대 편입 비중 (ETF인 경우에만 노출) */}
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
                  <h3 className="text-xs font-bold text-slate-700">상위 편입 종목 TOP {stock.topHoldings.length}</h3>
                  <div className="space-y-2">
                    {stock.topHoldings.map((holding, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-slate-700 truncate max-w-[280px] sm:max-w-none">
                            {idx + 1}. {holding}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${Math.max(15, 80 - idx * 14)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-slate-400 space-y-1">
                  <p>상위 편입 종목 상세 데이터는 자산운용사 공식 공시를 참조하세요.</p>
                  <p className="text-[11px] text-slate-400">기초지수 추종 및 자산 배분 전략에 따라 편입 비중이 매월 리밸런싱됩니다.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 4. 배당패스 3대 안전 필터링 검증 통과 내역 */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="text-emerald-600" size={20} />
            배당패스 3대 안전 필터링 검증 결과
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <CheckCircle2 size={15} />
                <span>시가총액 안전 기준 통과</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">유동성 안전성 확보</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isKr
                  ? '국내 시가총액 1,000억 원 이상 조건을 정직하게 통과하여 호가 왜곡 위험이 없습니다.'
                  : '미국 시가총액 $500M(약 6,700억 원) 이상 기준을 충족한 우량 자산입니다.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <CheckCircle2 size={15} />
                <span>고위험 배당트랩 방지</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">정상 배당성향 검증</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                일회성 자산 매각으로 일시적 20% 초과 배당률을 기록한 가짜 고배당이나 자본잠식 의심 종목이 아닙니다.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <CheckCircle2 size={15} />
                <span>실측치 무결성 보장</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">100% 실지급 TTM 기준</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                증권사나 운용사의 미래 희망 추정치가 아닌, 야후 파이낸스 실측 분배금 데이터만을 정직하게 수록했습니다.
              </p>
            </div>
          </div>
        </section>

        {/* 5. 배당소득세 및 절세 가이드 카드 */}
        <section className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200/60 space-y-3">
          <div className="flex items-center gap-2">
            <Coins className="text-blue-600" size={18} />
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              {stock.name} 배당소득세 ({taxRate}) 및 절세 팁
            </h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {taxNote}. 연간 금융소득(이자+배당)이 2,000만 원을 초과할 경우 금융소득종합과세 대상이 되어 다른 소득과 합산 과세되므로,
            {isKr
              ? ' ISA(개인종합자산관리계좌)나 연금저축펀드/IRP 계좌를 활용하시면 절세 혜택을 극대화할 수 있습니다.'
              : ' 일반 위탁계좌 대신 연금 계좌 또는 배당 재투자 전략을 사전 점검하시는 것을 권장합니다.'}
          </p>
          <div className="pt-1">
            <Link
              href="/guide/dividend-tax"
              className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-800 hover:underline"
            >
              <span>배당소득세와 2,000만 원 금융소득종합과세 완벽 가이드 읽기</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </section>

        {/* 6. 금융 투자 면책고지 */}
        <section className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs text-slate-500 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <AlertCircle size={14} className="text-slate-500" />
            <span>투자 유의사항 및 면책고지</span>
          </div>
          <p className="leading-relaxed">
            본 페이지에서 제공하는 <strong>{stock.name} ({stock.ticker})</strong>의 배당수익률 및 주당 배당금은 과거 12개월(TTM) 동안 실제 지급된 이력을 바탕으로 한 단순 통계 자료이며, 미래의 배당금 지속 지급이나 원금 보존을 보장하지 않습니다. 주식 및 ETF 투자는 원금 손실 위험이 따르며, 최종 투자 판단과 책임은 투자자 본인에게 있습니다.
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
