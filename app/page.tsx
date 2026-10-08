import React from 'react';
import Header from '@/components/Header';
import StockCard from '@/components/StockCard';
import InfoTooltip from '@/components/InfoTooltip';
import { getDividendStocks } from '@/lib/data';
import { Sparkles, Calendar, ShieldCheck, Flame, PieChart } from 'lucide-react';

export default async function HomePage() {
  const stocks = await getDividendStocks();

  // 상위 인기 월배당 ETF
  const monthlyEtfs = stocks
    .filter((s) => s.assetType === 'ETF' && s.dividendCycle === 'MONTHLY')
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, 5);

  // 대표 고배당주 샘플
  const featuredStocks = stocks
    .filter((s) => s.assetType === 'STOCK' && ['005930', '005380', 'KO', 'O', 'MAIN'].includes(s.ticker))
    .slice(0, 5);

  const krCount = stocks.filter((s) => s.market === 'KR').length;
  const usCount = stocks.filter((s) => s.market === 'US').length;

  return (
    <div className="flex-1 flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 px-4 py-5 space-y-6">
        {/* 상단 핀테크 히어로 배너 */}
        <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 rounded-3xl p-5 text-white shadow-lg shadow-blue-500/15 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-semibold text-blue-100 border border-white/20">
                <Sparkles size={12} className="text-amber-300" />
                <span>Phase 2 디자인 시스템 가동</span>
              </div>
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200/60 shadow-sm">
                <ShieldCheck size={12} className="stroke-[2.5]" />
                <span>실측 데이터 100% 검증</span>
              </div>
            </div>

            <h2 className="text-xl font-bold tracking-tight leading-snug">
              매달 들어오는 배당금,<br />
              <span className="text-blue-200">배당패스</span>로 투명하게 설계하세요
            </h2>

            <p className="mt-2 text-xs text-blue-100/90 leading-relaxed font-normal">
              위조 없는 순수 실측 데이터 500개 종목을 기반으로, 인기 순위와 배당률을 한눈에 비교합니다.
            </p>

            {/* 메트릭 요약 배지 */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-3.5 border-t border-white/15 text-center">
              <div>
                <div className="text-[10px] text-blue-200">총 검증 종목</div>
                <div className="text-sm font-extrabold text-white mt-0.5">{stocks.length}개</div>
              </div>
              <div>
                <div className="text-[10px] text-blue-200">국내 / 미국</div>
                <div className="text-sm font-extrabold text-white mt-0.5">{krCount} / {usCount}</div>
              </div>
              <div>
                <div className="text-[10px] text-blue-200">월배당 ETF 풀</div>
                <div className="text-sm font-extrabold text-white mt-0.5">
                  {stocks.filter((s) => s.assetType === 'ETF' && s.dividendCycle === 'MONTHLY').length}개
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 툴팁 & 투명성 가이드 카드 */}
        <section className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600 stroke-[2.5]" />
              배당패스 투명성 & 산출 기준
            </h3>
            <span className="text-[10px] font-medium text-slate-400">물음표 터치/호버</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex flex-col items-center justify-center">
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
                <Flame size={12} className="text-orange-500" />
                인기 점수
                <InfoTooltip type="popularity" />
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">시총60% + 대금40%</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex flex-col items-center justify-center">
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
                <PieChart size={12} className="text-blue-500" />
                TTM 배당률
                <InfoTooltip type="ttm" />
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">12개월 실지급 기준</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex flex-col items-center justify-center">
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
                <Calendar size={12} className="text-rose-500" />
                안전 필터
                <InfoTooltip type="safety" />
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">시총하한 + 고위험</p>
            </div>
          </div>
        </section>

        {/* 인기 월배당 ETF TOP 5 */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <span className="text-base">🔥</span>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                인기 월배당 ETF TOP 5
              </h3>
              <InfoTooltip type="popularity" />
            </div>
            <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              MONTHLY
            </span>
          </div>

          <div className="space-y-2.5">
            {monthlyEtfs.map((stock, idx) => (
              <StockCard key={stock.ticker} stock={stock} rank={idx + 1} />
            ))}
          </div>
        </section>

        {/* 대표 우량 배당주 샘플 */}
        <section className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <span className="text-base">🏛️</span>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                시장 대표 우량 배당주
              </h3>
              <InfoTooltip type="safety" />
            </div>
            <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
              STOCK
            </span>
          </div>

          <div className="space-y-2.5">
            {featuredStocks.map((stock) => (
              <StockCard key={stock.ticker} stock={stock} />
            ))}
          </div>
        </section>
      </main>

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
