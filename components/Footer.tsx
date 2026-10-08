import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white py-8 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
      <div className="max-w-7xl mx-auto space-y-3.5">
        {/* 네비게이션 링크 4종 */}
        <nav aria-label="하단 메뉴" className="flex items-center justify-center flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-slate-600">
          <Link
            href="/about"
            className="hover:text-blue-600 transition-colors"
          >
            서비스 소개
          </Link>
          <span className="text-slate-300">·</span>
          <Link
            href="/privacy"
            className="hover:text-blue-600 transition-colors font-semibold"
          >
            개인정보처리방침
          </Link>
          <span className="text-slate-300">·</span>
          <Link
            href="/terms"
            className="hover:text-blue-600 transition-colors"
          >
            이용약관 및 면책고지
          </Link>
          <span className="text-slate-300">·</span>
          <Link
            href="/contact"
            className="hover:text-blue-600 transition-colors"
          >
            문의하기
          </Link>
        </nav>

        {/* 금융 면책고지 한 줄 요약 */}
        <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed max-w-2xl mx-auto">
          본 서비스에서 제공하는 배당률 및 시뮬레이션 결과는 단순 참고용 모의 계산이며, 특정 종목 매수/매도 권유나 투자 자문이 아닙니다.
          실제 투자에 대한 모든 판단과 책임은 투자자 본인에게 있습니다.
        </p>

        {/* 저작권 표기 */}
        <p className="text-[11px] text-slate-400 font-mono">
          © 2026 Dividend Pass. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
