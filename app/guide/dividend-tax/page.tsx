import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Percent,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ShieldAlert,
  Calculator,
  Coins,
  Building2,
  Lock,
} from 'lucide-react';

export const metadata: Metadata = {
  title: '배당소득세 15.4%와 2,000만 원 금융소득종합과세 완벽 가이드 - 배당패스',
  description: '국내 배당소득세 15.4%와 미국 배당세 15.0% 원천징수 원리, 2,000만 원 초과 시 금융소득종합과세 누진세율 및 건보료 폭탄 방지, ISA·연금 절세 계좌 전략을 완벽 해설합니다.',
  openGraph: {
    title: '배당소득세 15.4%와 2,000만 원 금융소득종합과세 완벽 가이드 - 배당패스',
    description: '배당 투자자의 최대 적인 세금과 건보료를 지키는 실전 절세 가이드! 배당패스에서 확인하세요.',
    url: 'https://dividendpass.com/guide/dividend-tax',
    siteName: '배당패스 (Dividend Pass)',
  },
};

export default function DividendTaxGuidePage() {
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
          <span className="font-semibold text-slate-700">배당소득세 & 종합과세</span>
        </nav>

        {/* 상단 타이틀 */}
        <section className="space-y-3 border-b border-slate-200/80 pb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/70 shadow-xs">
            <Percent size={13} className="text-emerald-700" />
            <span>실전 배당 절세 완벽 해설</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            배당소득세 15.4%와 2,000만 원 금융소득종합과세 완벽 가이드
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            세전 100만 원은 내 통장에 100만 원으로 들어오지 않습니다.
            원천징수세율의 차이부터 <strong>연 2,000만 원 초과 시의 금융소득종합과세 폭탄</strong>을 피하는 필수 절세 계좌 전략을 공개합니다.
          </p>
        </section>

        {/* 1. 세전 vs 세후 배당금의 기본 공식 */}
        <section className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            01. 배당금의 진실: 세전이 아닌 ‘세후 실수령액’이 진짜 내 돈
          </h2>
          <p>
            배당 투자를 시작할 때 많은 분이 <strong>‘연 배당금 1,000만 원’</strong>을 목표로 삼습니다.
            하지만 주식 배당금이나 ETF 분배금이 증권 계좌에 입금될 때는 이미 세금이 떼인 <strong>‘세후 금액’</strong>만 들어옵니다.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1 text-xs sm:text-sm">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="font-bold text-slate-900 text-sm">🇰🇷 국내 상장 주식 / ETF</span>
              <div className="text-xl font-black text-rose-600">15.4% 원천징수</div>
              <p className="text-slate-600 leading-relaxed">
                배당소득세 14.0% + 지방소득세 1.4% = 총 15.4%가 즉시 차감됩니다. (100만 원 배당 시 실수령액 84만 6천 원)
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="font-bold text-slate-900 text-sm">🇺🇸 미국 직투 주식 / ETF</span>
              <div className="text-xl font-black text-blue-600">15.0% 현지 원천징수</div>
              <p className="text-slate-600 leading-relaxed">
                한미 조세조약에 따라 미국 국세청(IRS)에서 15.0%를 징수합니다. (한국 배당세율 14%보다 높으므로 국내 추가 징수는 없음)
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            💡 배당패스의 <strong>FIRE 역산 시뮬레이터</strong>는 사용자가 국내 종목과 미국 종목을 섞어서 담아도, 종목별 세율(15.4% vs 15.0%)을 자동으로 가중 분기하여 오차 0원의 세후 목표 배당금을 역산합니다.
          </p>
        </section>

        {/* 2. 금융소득종합과세 2,000만 원 기준 */}
        <section className="space-y-4 p-6 sm:p-7 rounded-3xl bg-amber-50/50 border border-amber-200/80">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100/70 px-2.5 py-1 rounded-full border border-amber-300">
            <ShieldAlert size={13} />
            <span>핵심 위험 경고</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            02. 연간 2,000만 원 초과 시: 금융소득종합과세 & 건보료 폭탄
          </h2>
          <div className="text-sm text-slate-700 space-y-3 leading-relaxed">
            <p>
              개인 투자자가 1년 동안 수령한 금융소득(이자소득 + 배당소득)의 합계가 <strong>연 2,000만 원</strong> 이하일 때는 15.4% 분리과세로 세금 의무가 종결됩니다.
              하지만 <strong>1원이라도 2,000만 원을 초과</strong>하는 순간 엄청난 불이익이 발생합니다:
            </p>
            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl bg-white border border-amber-200 space-y-1">
                <span className="font-bold text-slate-900">1) 다른 소득과 합산하여 누진세율 적용 (최대 49.5%)</span>
                <p className="text-slate-600">
                  근로소득, 사업소득, 연금소득과 합산되어 종합소득세율 구간(6.6% ~ 49.5%)에 따라 과세되므로, 고소득 직장인의 경우 절반 가까이 세금으로 날아갈 수 있습니다.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-amber-200 space-y-1">
                <span className="font-bold text-slate-900">2) 건강보험료 피부양자 자격 박탈 (월 수십만 원 건보료 부과)</span>
                <p className="text-slate-600">
                  직장인 자녀 밑에 피부양자로 등록되어 있던 은퇴자 부모님의 금융소득이 연 2,000만 원(또는 총소득 2,000만 원)을 넘으면, 지역가입자로 전환되어 재산과 소득에 대한 건강보험료가 부과됩니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. 절세 3대 계좌 활용 전략 */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="text-blue-600" size={22} />
            03. 금융소득종합과세를 피하는 3대 절세 계좌 전략
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            일반 위탁계좌 대신 정부가 세제 혜택을 부여한 3대 절세 계좌를 활용하면, 합법적으로 세금을 0원 또는 최저세율로 줄일 수 있습니다:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1 text-xs sm:text-sm">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">01. ISA 계좌</span>
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">필수 1순위</span>
              </div>
              <h3 className="text-sm font-bold text-blue-700">비과세 200~400만 + 9.9%</h3>
              <p className="text-slate-500 leading-relaxed text-xs">
                순이익 200만 원(서민형 400만 원)까지 배당소득세 0원. 초과분은 9.9% 분리과세되며 금융소득종합과세 대상에서 전액 제외됩니다.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">02. 연금저축펀드</span>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">과세이연</span>
              </div>
              <h3 className="text-sm font-bold text-emerald-700">배당소득세 0% + 연금소득세</h3>
              <p className="text-slate-500 leading-relaxed text-xs">
                수령 전까지 배당세가 전혀 징수되지 않고 100% 재투자됩니다. 만 55세 이후 연금 수령 시 3.3%~5.5%의 초저율 과세만 납부합니다.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">03. 개인형 IRP</span>
                <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">세액공제</span>
              </div>
              <h3 className="text-sm font-bold text-indigo-700">연간 최대 900만 원 공제</h3>
              <p className="text-slate-500 leading-relaxed text-xs">
                연금저축과 합산하여 연 최대 900만 원까지 세액공제를 받으면서, 월배당 ETF를 담아 은퇴 파이프라인을 구축할 수 있습니다.
              </p>
            </div>
          </div>
        </section>

        {/* 4. 배당패스 시뮬레이터 CTA */}
        <section className="p-6 sm:p-8 rounded-3xl bg-blue-50/70 border border-blue-200/70 space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-blue-700">실시간 역산 엔진</span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              세후 실수령액 기준 파이어 역산 시뮬레이션
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              원하는 목표 월배당금(예: 월 200만 원)을 입력하면, 배당소득세 차감 후 딱 맞아떨어지는 필요 투자 원금을 3초 만에 산출해 드립니다.
            </p>
          </div>
          <div className="pt-1">
            <Link
              href="/#fire-simulator"
              className="inline-flex items-center gap-1.5 py-3 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition-colors shadow-xs"
            >
              <Calculator size={16} />
              <span>💰 세후 실수령 파이어 역산기 바로가기</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* 하단 네비게이션 */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200/80">
          <Link
            href="/guide/monthly-etf-top10"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>이전 가이드: 월배당 ETF 선별 3대 기준</span>
          </Link>
          <Link
            href="/guide/ttm-payout-ratio"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>다음 가이드: TTM 배당률과 배당성향</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
