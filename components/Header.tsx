import React from 'react';
import { TrendingUp, ShieldCheck, Sparkles } from 'lucide-react';
import InfoTooltip from '@/components/InfoTooltip';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* 로고 & 타이틀 */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
            <TrendingUp size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                배당패스
              </h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200/60 leading-none">
                500
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1 leading-none hidden sm:block">
              국내 250개 + 미국 250개 검증 고배당주 & ETF 포트폴리오
            </p>
          </div>
        </div>

        {/* 우측 뱃지 & 안내 시스템 */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200/80">
            <Sparkles size={13} className="text-amber-500" />
            <span>실측 데이터 100%</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200/60 shadow-xs">
            <ShieldCheck size={14} className="stroke-[2.5]" />
            <span className="hidden sm:inline">안전 필터 통과</span>
            <span className="sm:hidden">안전필터</span>
          </div>

          <InfoTooltip type="safety" iconSize={16} />
        </div>
      </div>
    </header>
  );
}
