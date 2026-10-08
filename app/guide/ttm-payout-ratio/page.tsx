import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  TrendingUp,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  PieChart,
  ShieldCheck,
  Search,
  Database,
  Layers,
  Flame,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'TTM 배당수익률과 배당성향(Payout Ratio) 제대로 읽는 법 - 배당패스',
  description: 'Forward 배당률의 함정과 TTM 실측치 분석, 적정 배당성향(40~60%) 판별법, 배당 삭감(Dividend Cut) 위험 신호 3가지와 지속 가능한 고배당주 선별 가이드.',
  openGraph: {
    title: 'TTM 배당수익률과 배당성향(Payout Ratio) 제대로 읽는 법 - 배당패스',
    description: '높은 배당수익률 뒤에 숨겨진 함정을 피하고 지속 가능한 알짜 배당주를 찾는 펀더멘털 분석 가이드.',
    url: 'https://dividendpass.com/guide/ttm-payout-ratio',
    siteName: '배당패스 (Dividend Pass)',
  },
};

export default function TtmPayoutRatioGuidePage() {
  return (
    <div className="flex-1 flex flex-col bg-white min-h-screen text-slate-900">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* 브레드크럼 */}
        <nav aria-label="브레드크럼" className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            홈
          </Link>
          <span className="text-slate-300">/</span>
          <Link href="/guide" className="hover:text-blue-600 transition-colors">
            배당 가이드
          </Link>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-700">TTM 배당률 & 배당성향 분석</span>
        </nav>

        {/* 상단 타이틀 */}
        <section className="space-y-3 border-b border-slate-200/80 pb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200/60 shadow-xs">
            <TrendingUp size={13} className="text-indigo-600" />
            <span>배당 펀더멘털 정밀 분석</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            TTM 배당수익률과 배당성향(Payout Ratio) 제대로 읽는 법
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            배당수익률 15%라는 숫자에 현혹되지 마세요.
            선행(Forward) 지표의 착시 현상과 <strong>배당 삭감(Dividend Cut) 위험 신호 3가지</strong>를 구별하는 실전 테크닉을 소개합니다.
          </p>
        </section>

        {/* 1. Forward vs TTM 배당률의 치명적 차이 */}
        <section className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            01. Forward(선행) vs TTM(과거 12개월 실측치)의 차이점
          </h2>
          <p>
            증권사 HTS나 해외 주식 사이트에서 흔히 보는 배당수익률은 대개 두 가지 방식 중 하나로 계산됩니다:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1 text-xs sm:text-sm">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="font-bold text-rose-600 text-sm">Forward 배당률 (선행 추정치)</span>
              <p className="text-slate-600 leading-relaxed">
                가장 최근에 지급된 배당금에 4(분기) 또는 12(월)를 곱해 단순 연환산한 수치입니다.
                일회성 특별 배당이 발생했거나 기업이 앞으로 배당을 삭감할 예정인 경우, <strong>극심한 과대평가 착시</strong>를 유발합니다.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200/70 space-y-2">
              <span className="font-bold text-blue-700 text-sm">TTM 배당률 (Trailing Twelve Months)</span>
              <p className="text-slate-700 leading-relaxed">
                직전 12개월 동안 주주 계좌에 <strong>실제로 입금된 현금 DPS 총합</strong>을 현재가로 나눈 수치입니다.
                추정치가 아닌 검증된 실측치이므로 배당패스가 채택한 신뢰의 기준입니다.
              </p>
            </div>
          </div>
        </section>

        {/* 2. 배당성향 (Payout Ratio)의 적정선 */}
        <section className="space-y-4 p-6 sm:p-7 rounded-3xl bg-slate-50 border border-slate-200/80">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/60">
            <PieChart size={13} />
            <span>핵심 지표</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            02. 배당성향(Payout Ratio)으로 기업의 건강 상태 진단하기
          </h2>
          <div className="text-sm text-slate-700 space-y-3 leading-relaxed">
            <p>
              배당성향이란 기업이 벌어들인 순이익(당기순이익) 중에서 얼마만큼을 주주에게 배당금으로 지급했는지를 나타내는 비율입니다.
              <code className="bg-slate-200/80 px-2 py-0.5 rounded text-xs font-mono font-bold text-slate-800 ml-1">
                배당성향(%) = (총배당금 ÷ 당기순이익) × 100
              </code>
            </p>
            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-white border border-emerald-200 space-y-1">
                <span className="font-bold text-emerald-700">🟢 40% ~ 60% : 가장 이상적인 황금 구간</span>
                <p className="text-slate-600">
                  벌어들인 돈의 절반은 미래 사업에 재투자하고, 나머지 절반은 주주에게 환원합니다. 불황이 와도 배당금을 줄이지 않고 버틸 수 있는 체력을 갖춘 우량 기업입니다.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-amber-200 space-y-1">
                <span className="font-bold text-amber-700">🟡 70% ~ 90% : 고배당 성숙기 기업</span>
                <p className="text-slate-600">
                  통신주, 유틸리티, 담배 회사처럼 설비 투자가 일단락된 성숙기 기업의 구간입니다. 현금흐름이 안정적이라면 유지 가능하지만 성장 여력은 제한적입니다.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-rose-200 space-y-1">
                <span className="font-bold text-rose-700">🔴 100% 초과 : 위험한 배당 트랩 (Dividend Trap)</span>
                <p className="text-slate-600">
                  기업이 번 돈보다 더 많은 배당금을 뿌리고 있는 상태입니다. 빚을 내거나 회사 곳간(이익잉여금)을 털어 배당을 주고 있으므로, <strong>조만간 배당 삭감(Dividend Cut)</strong>이 단행될 확률이 매우 높습니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. 배당 삭감 위험 신호 3가지 */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="text-rose-600" size={22} />
            03. 배당 삭감(Cut)을 예고하는 3대 위험 신호
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            배당 투자의 가장 큰 재앙은 배당 삭감입니다. 배당금이 줄어들면 매월 들어오던 현금흐름이 끊길 뿐만 아니라, 실망 매물로 인해 주가가 30~50% 폭락하기 때문입니다:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1 text-xs sm:text-sm">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="font-bold text-rose-600">위험 신호 01</span>
              <h3 className="text-sm font-bold text-slate-900">영업이익·순이익의 역성장</h3>
              <p className="text-slate-500 leading-relaxed text-xs">
                매출과 영업이익이 2년 연속 감소세를 보이는데도 배당금을 유지하고 있다면, 조만간 배당 삭감 압박에 직면합니다.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="font-bold text-rose-600">위험 신호 02</span>
              <h3 className="text-sm font-bold text-slate-900">잉여현금흐름(FCF) 적자</h3>
              <p className="text-slate-500 leading-relaxed text-xs">
                회계상 당기순이익이 흑자라도, 실제 사업 활동으로 유입된 현금(FCF)이 마이너스라면 배당금을 현금으로 지급할 수 없습니다.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="font-bold text-rose-600">위험 신호 03</span>
              <h3 className="text-sm font-bold text-slate-900">부채비율 급증 및 이자부담</h3>
              <p className="text-slate-500 leading-relaxed text-xs">
                고금리 환경에서 부채비율이 200%를 넘고 이자보상배율이 1배 미만으로 떨어진 기업은 채권자 압박으로 배당을 축소합니다.
              </p>
            </div>
          </div>
        </section>

        {/* 4. 배당패스의 안전 스크리닝 원칙 */}
        <section className="p-6 sm:p-8 rounded-3xl bg-blue-50/70 border border-blue-200/70 space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-blue-700">배당패스의 철학</span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              배당트랩 0%를 위한 자동 스크리닝 알고리즘
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              배당패스는 단순 배당수익률 순으로 줄 세우지 않습니다.
              시가총액 1,000억 원 이상, 일일 유동성 검증, 일시적 특수 배당 제외 등 3대 안전 필터를 통과한 <strong>500개 검증된 종목</strong>만을 서비스에 수록합니다.
            </p>
          </div>
          <div className="pt-1">
            <Link
              href="/#stock-explorer"
              className="inline-flex items-center gap-1.5 py-3 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition-colors shadow-xs"
            >
              <Search size={15} />
              <span>검증된 500개 우량 배당주 전체 탐색하기</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* 하단 네비게이션 */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200/80">
          <Link
            href="/guide/dividend-tax"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>이전 가이드: 배당소득세와 종합과세</span>
          </Link>
          <Link
            href="/guide"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>가이드 센터 목록</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
