import React from 'react';
import { TrendingUp, ShieldCheck, Sparkles } from 'lucide-react';
import InfoTooltip from '@/components/InfoTooltip';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* 로고 & 타이틀 */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <TrendingUp size={20} className="stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-none">
                배당패스
              </h1>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200/60 leading-none">
                500
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-none">
              국내·미국 500개 검증 고배당주 & ETF
            </p>
          </div>
        </div>

        {/* 우측 뱃지 & 안내 */}
        <div className="flex items-center gap-1.5">
          <div className="hidden sm:flex items-center gap-1 text-[11px] font-medium bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200/60">
            <ShieldCheck size={13} className="stroke-[2.2]" />
            <span>안전 필터 통과</span>
          </div>
          <InfoTooltip type="safety" />
        </div>
      </div>
    </header>
  );
}
