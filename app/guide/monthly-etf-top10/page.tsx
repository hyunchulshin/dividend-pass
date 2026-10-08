import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Calendar,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Flame,
  ShieldCheck,
  Layers,
  Coins,
} from 'lucide-react';

export const metadata: Metadata = {
  title: '2026 지금 가장 핫한 월배당 ETF 고르는 3가지 기준 - 배당패스',
  description: '월급 대체 현금흐름을 만드는 월배당 ETF! 커버드콜 옵션 프리미엄의 양날의 검, 총보수율과 숨은 기타비용, 기초자산 성장성을 점검하는 3대 선별 기준.',
  openGraph: {
    title: '2026 지금 가장 핫한 월배당 ETF 고르는 3가지 기준 - 배당패스',
    description: '월배당 ETF 투자 시 원금 갉아먹기 배당트랩을 피하고 우량 종목을 고르는 3대 핵심 기준을 완벽 분석합니다.',
    url: 'https://dividendpass.com/guide/monthly-etf-top10',
    siteName: '배당패스 (Dividend Pass)',
  },
};

export default function MonthlyEtfGuidePage() {
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
          <span className="font-semibold text-slate-700">월배당 ETF 선별 기준</span>
        </nav>

        {/* 상단 타이틀 */}
        <section className="space-y-3 border-b border-slate-200/80 pb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200/60 shadow-xs">
            <Calendar size={13} className="text-blue-600" />
            <span>2026 월배당 ETF 실전 투자 분석</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            2026 지금 가장 핫한 월배당 ETF 고르는 3가지 기준
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            매월 꼬박꼬박 들어오는 제2의 월급! 그러나 두 자릿수 고배당률 뒤에 숨겨진 <strong>‘원금 갉아먹기(NAV 잠식)’</strong>를 모르면 은퇴 자금이 순식간에 녹아내립니다.
          </p>
        </section>

        {/* 서론: 월배당 ETF 열풍과 주의점 */}
        <section className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
          <p>
            2026년 대한민국 증시와 미국 증시에서 가장 뜨거운 키워드는 단연 <strong>‘월배당 ETF(Monthly Dividend ETF)’</strong>입니다.
            분기별 또는 연 1회 지급받던 배당금과 달리, 매달 고정적으로 통장에 입금되는 분배금은 즉각적인 생활비 충당과 복리 재투자의 즐거움을 선사하기 때문입니다.
          </p>
          <p>
            하지만 단순히 증권사 앱 화면에 표시된 <strong>‘연 10%~12%’</strong>라는 숫자만 보고 덜컥 매수했다가는,
            주가가 계속 하락하여 받은 배당금보다 원금 손실이 더 큰 <strong>‘배당 트랩(Dividend Trap)’</strong>에 빠지기 십상입니다.
            지속 가능한 월배당 포트폴리오를 만들기 위해 반드시 확인해야 할 3가지 기준을 정리해 드립니다.
          </p>
        </section>

        {/* 기준 1: 커버드콜 옵션 프리미엄의 양날의 검 */}
        <section className="space-y-4 p-6 sm:p-7 rounded-3xl bg-slate-50 border border-slate-200/80">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200/60">
            <AlertTriangle size={13} />
            <span>기준 01. 옵션 프리미엄의 양날의 검</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            커버드콜 ETF의 ‘제 살 깎아 먹기(NAV 침식)’ 경계하기
          </h2>
          <div className="text-sm text-slate-700 space-y-3 leading-relaxed">
            <p>
              시중에서 연 8% 이상의 고배당을 지급하는 월배당 ETF의 상당수는 <strong>‘커버드콜(Covered Call)’</strong> 전략을 사용합니다.
              커버드콜은 기초자산(예: 미국 나스닥 100, S&P 500)을 매수하면서 동시에 콜옵션을 매도하여 얻은 옵션 프리미엄으로 배당금을 지급하는 구조입니다.
            </p>
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 space-y-2 text-xs sm:text-sm">
              <span className="font-bold text-slate-900">⚠️ 커버드콜의 핵심 리스크: 상방 제한 + 하방 완전 노출</span>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><strong>상승장:</strong> 주가가 폭등해도 옵션 행사가격 이상의 시세 차익을 누리지 못합니다.</li>
                <li><strong>하락장:</strong> 주가가 급락할 때는 옵션 프리미엄만큼만 방어되고 원금 하락을 그대로 맞습니다.</li>
                <li><strong>결과:</strong> 장기 우상향하는 시장에서 기초지수가 2배 오를 때 커버드콜 ETF는 원금이 깎여 배당금 지급액도 함께 줄어들 수 있습니다.</li>
              </ul>
            </div>
            <p>
              따라서 원금 보존이 중요한 투자자라면, 무조건적인 전통 커버드콜보다는 <strong>‘배당성장형 ETF(예: 미국 배당다우존스 SCHD, TIGER 배당다우존스)’</strong>와
              <strong>‘옵션 비중을 10~30%로 제한한 타깃 프리미엄 ETF’</strong>를 적절한 비중으로 분산하는 것이 현명합니다.
            </p>
          </div>
        </section>

        {/* 기준 2: 총보수율과 숨겨진 기타비용 */}
        <section className="space-y-4 p-6 sm:p-7 rounded-3xl bg-slate-50 border border-slate-200/80">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/60">
            <Coins size={13} />
            <span>기준 02. 수수료의 마법</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            공시된 총보수 이면에 숨은 ‘실제 총비용(TER)’ 체크
          </h2>
          <div className="text-sm text-slate-700 space-y-3 leading-relaxed">
            <p>
              자산운용사 홈페이지나 광고 배너에는 <strong>‘운용보수 연 0.01%’</strong>처럼 초저보수를 강조하는 경우가 많습니다.
              하지만 ETF에는 운용보수 외에도 <strong>‘기타비용(회계 감사비, 지수 사용료)’</strong>과 <strong>‘매매 중개수수료율’</strong>이 존재합니다.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-white border border-slate-200">
                <span className="font-bold text-slate-800">명목 운용보수</span>
                <p className="text-slate-500 mt-1">자산운용사가 수취하는 대가. 눈에 띄게 낮게 책정되는 경향이 있습니다.</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200">
                <span className="font-bold text-blue-700">실질 총비용 부담률 (TER)</span>
                <p className="text-slate-500 mt-1">운용보수 + 기타비용 + 매매수수료. 금융투자협회 공시를 통해 매달 실측해야 합니다.</p>
              </div>
            </div>
            <p>
              동일한 기초지수를 추종하는 국내 상장 월배당 ETF라면, 금융투자협회 전자공시 서비스(KOFIA)의 <strong>‘ETF 실질 총보수비용’</strong>을 반드시 비교해 보고 매수하세요.
            </p>
          </div>
        </section>

        {/* 기준 3: 기초자산 성장성과 배당 지속 가능성 */}
        <section className="space-y-4 p-6 sm:p-7 rounded-3xl bg-slate-50 border border-slate-200/80">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
            <TrendingUp size={13} />
            <span>기준 03. 유동성과 펀더멘털</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            시가총액(AUM) 1,000억 원 이상 & 풍부한 거래대금
          </h2>
          <div className="text-sm text-slate-700 space-y-3 leading-relaxed">
            <p>
              ETF의 순자산총액(AUM)이 너무 작으면 다음과 같은 치명적인 문제가 발생합니다:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600 text-xs sm:text-sm">
              <li><strong>호가 스프레드 확대:</strong> 매수 호가와 매도 호가의 간격이 벌어져 살 때 비싸게 사고 팔 때 싸게 파는 손실 발생</li>
              <li><strong>상장폐지 위험:</strong> 순자산총액 50억 원 미만 상태가 지속되면 강제 상장폐지 절차에 돌입</li>
              <li><strong>LP 유동성 공급 부족:</strong> 시장 변동성이 커질 때 제값에 매도하기 어려움</li>
            </ul>
            <p>
              배당패스는 이러한 원칙에 따라 <strong>국내 시총 1,000억 원 미만, 미국 시총 $500M 미만</strong> 종목을 데이터 수집 단계부터 엄격하게 배제합니다.
            </p>
          </div>
        </section>

        {/* 실전 배당패스 활용 가이드 */}
        <section className="p-6 sm:p-8 rounded-3xl bg-blue-50/70 border border-blue-200/70 space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-blue-700">배당패스 3초 추천</span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              실시간 검증된 인기 월배당 TOP 10 확인하기
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              시가총액 60% + 일일 거래대금 40% 기반으로 산출된 편향 없는 랭킹으로 최고의 월배당 ETF를 한눈에 비교해 보세요.
            </p>
          </div>
          <div className="pt-1">
            <Link
              href="/#stock-explorer"
              className="inline-flex items-center gap-1.5 py-3 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition-colors shadow-xs"
            >
              <span>🔥 인기 월배당 TOP 10 실시간 랭킹 보러가기</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* 하단 네비게이션 */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200/80">
          <Link
            href="/guide"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>가이드 센터 목록</span>
          </Link>
          <Link
            href="/guide/dividend-tax"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>다음 가이드: 배당소득세와 금융소득종합과세</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
