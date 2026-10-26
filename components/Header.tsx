import React from 'react';
import Link from 'next/link';
import { TrendingUp, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';
import InfoTooltip from '@/components/InfoTooltip';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-2">
        {/* 로고 & 타이틀: 클릭 시 메인으로 이동 */}
        <Link
          href="/"
          className="flex items-center gap-2.5 sm:gap-3 group cursor-pointer select-none shrink-0"
          title="배당패스 홈으로 이동"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs shrink-0 group-hover:bg-blue-700 transition-colors">
            <TrendingUp size={19} className="stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 leading-none group-hover:text-blue-600 transition-colors">
                배당패스
              </h1>
              <span className="text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200/60 leading-none">
                500
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1 leading-none hidden md:block">
              국내 250개 + 미국 250개 검증 고배당주 & ETF 리서치
            </p>
          </div>
        </Link>

        {/* 중앙 & 우측 네비게이션 메뉴 및 안전필터 안내 */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <nav aria-label="주요 메뉴" className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/guide"
              className="inline-flex items-center gap-1 text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/70 transition-colors"
            >
              <BookOpen size={13} className="text-blue-600 shrink-0" />
              <span>배당 가이드</span>
            </Link>
            <Link
              href="/about"
              className="hidden sm:inline-flex items-center text-xs font-semibold px-2.5 py-1.5 rounded-full text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors"
            >
              서비스 소개
            </Link>
          </nav>

          <div className="hidden lg:flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200/80">
            <Sparkles size={13} className="text-amber-500" />
            <span>실측 데이터 100%</span>
          </div>

          <div className="flex items-center gap-1 text-xs font-semibold bg-emerald-50 text-emerald-700 px-2.5 sm:px-3 py-1 rounded-full border border-emerald-200/60 shadow-xs">
            <ShieldCheck size={13} className="stroke-[2.5] shrink-0" />
            <span className="hidden sm:inline">안전 필터 통과</span>
            <span className="sm:hidden text-[11px]">안전필터</span>
          </div>

          <InfoTooltip type="safety" iconSize={16} />
        </div>
      </div>
    </header>
  );
}
