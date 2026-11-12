import React from 'react';
import Link from 'next/link';
import { Layers, Train, TrendingUp, Building2, ArrowRight } from 'lucide-react';

export function SnowmangoSuiteBanner() {
  return (
    <section className="mt-16 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/60 via-white to-violet-50/40 p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-indigo-100/80 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
            <Layers size={20} />
          </div>
          <div>
            <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
              SNOWMANGO UTILITY SUITE
            </span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              스노우망고(Snowmango) 패밀리 라이프·금융 도구 모음
            </h2>
          </div>
        </div>
        <span className="hidden sm:inline-flex text-xs font-bold text-indigo-700 bg-white border border-indigo-200/80 px-3 py-1 rounded-full shadow-2xs">
          무료 웹 유틸리티 3종
        </span>
      </div>

      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-keep">
        스노우망고는 일상생활과 금융 의사결정에 직결되는 복잡한 계산을 단 1초 만에 무료로 해결해 주는 마이크로 유틸리티 랩입니다. 
        별도의 회원가입이나 앱 설치 없이 웹 브라우저에서 즉시 활용할 수 있습니다.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        {/* 시트패스 */}
        <a
          href="https://seat.snowmango.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group p-4 rounded-xl border border-slate-200/90 bg-white hover:border-blue-300 hover:bg-blue-50/20 transition shadow-xs flex flex-col justify-between gap-3"
        >
          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <Train size={18} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition">
              시트패스 (SeatPass)
            </h3>
            <p className="text-xs text-slate-500 break-keep leading-relaxed">
              KTX-1, 산천, SRT, 청룡 햇빛 그늘석, 콘센트 위치, 1인석 명당 1초 진단
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
            <span>서비스 바로가기</span>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </a>

        {/* 청약패스 */}
        <a
          href="https://cheongyak.snowmango.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group p-4 rounded-xl border border-slate-200/90 bg-white hover:border-emerald-300 hover:bg-emerald-50/20 transition shadow-xs flex flex-col justify-between gap-3"
        >
          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Building2 size={18} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">
              청약패스 (CheongyakPass)
            </h3>
            <p className="text-xs text-slate-500 break-keep leading-relaxed">
              실시간 아파트 분양가 분석, 계약금·중도금·잔금 대출 스케줄 및 취득세 자동 시뮬레이션
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
            <span>서비스 바로가기</span>
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </a>

        {/* 배당패스 (현재) */}
        <div className="p-4 rounded-xl border border-violet-300 bg-white shadow-xs flex flex-col justify-between gap-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-violet-600 text-white text-[9px] font-black px-2 py-0.5 rounded-bl-lg">
            현재 서비스
          </div>
          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center">
              <TrendingUp size={18} />
            </div>
            <h3 className="text-sm font-bold text-slate-900">배당패스 (DividendPass)</h3>
            <p className="text-xs text-slate-500 break-keep leading-relaxed">
              국내·미국 우량 배당주 500종목 실시간 랭킹, 월 100만 원 FIRE 현금흐름 역산 시뮬레이터
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-violet-600">
            <span>dividend.snowmango.com</span>
          </div>
        </div>
      </div>
    </section>
  );
}
