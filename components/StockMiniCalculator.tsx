'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { DividendStock } from '@/types/stock';
import { Calculator, ArrowRight, Sparkles, Coins, DollarSign, CheckCircle2 } from 'lucide-react';

interface StockMiniCalculatorProps {
  stock: DividendStock;
}

const PRESET_AMOUNTS = [
  { label: '월 10만', value: 100_000 },
  { label: '월 30만', value: 300_000 },
  { label: '월 50만', value: 500_000 },
  { label: '월 100만', value: 1_000_000 },
  { label: '월 200만', value: 2_000_000 },
];

export default function StockMiniCalculator({ stock }: StockMiniCalculatorProps) {
  const [monthlyTarget, setMonthlyTarget] = useState<number>(500_000); // 기본 월 50만 원
  const [exchangeRate] = useState<number>(1350); // 기본 기준환율

  const isKr = stock.market === 'KR';
  const taxRate = isKr ? 0.154 : 0.150; // 국내 15.4%, 미국 15.0%

  // 계산 로직 (실수령액 기준 역산)
  const calculation = useMemo(() => {
    // 1주당 세전 연간 배당금 (원화 환산)
    const dpsKrw = isKr ? stock.dpsTtm : stock.dpsTtm * exchangeRate;
    // 1주당 주가 (원화 환산)
    const priceKrw = isKr ? stock.price : stock.price * exchangeRate;

    if (dpsKrw <= 0 || priceKrw <= 0) {
      return {
        neededShares: 0,
        totalInvestmentKrw: 0,
        totalInvestmentUsd: 0,
        annualGrossDividendKrw: 0,
        annualNetDividendKrw: 0,
        actualMonthlyNetKrw: 0,
      };
    }

    // 목표 연간 세후 배당금
    const targetAnnualNetKrw = monthlyTarget * 12;
    // 목표 연간 세전 필요 배당금
    const targetAnnualGrossKrw = targetAnnualNetKrw / (1 - taxRate);

    // 필요 주식 수 (올림)
    const neededShares = Math.ceil(targetAnnualGrossKrw / dpsKrw);

    // 실제 총 투자 원금
    const totalInvestmentKrw = neededShares * priceKrw;
    const totalInvestmentUsd = neededShares * stock.price;

    // 실제 연간 배당금
    const annualGrossDividendKrw = neededShares * dpsKrw;
    const annualNetDividendKrw = annualGrossDividendKrw * (1 - taxRate);
    const actualMonthlyNetKrw = annualNetDividendKrw / 12;

    return {
      neededShares,
      totalInvestmentKrw,
      totalInvestmentUsd,
      annualGrossDividendKrw,
      annualNetDividendKrw,
      actualMonthlyNetKrw,
    };
  }, [stock, monthlyTarget, isKr, taxRate, exchangeRate]);

  // 원화 포맷팅 함수 (억/만 단위)
  const formatKrw = (amount: number) => {
    if (amount >= 100_000_000) {
      const eok = Math.floor(amount / 100_000_000);
      const man = Math.round((amount % 100_000_000) / 10_000);
      return man > 0 ? `${eok}억 ${man.toLocaleString()}만 원` : `${eok}억 원`;
    }
    const man = Math.round(amount / 10_000);
    return `${man.toLocaleString()}만 원`;
  };

  const cycleText =
    stock.dividendCycle === 'MONTHLY'
      ? '매달'
      : stock.dividendCycle === 'QUARTERLY'
      ? '3개월마다'
      : '매년';

  return (
    <section className="bg-white rounded-3xl border border-blue-200/80 p-5 sm:p-7 shadow-sm space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calculator size={18} />
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {stock.name} 단일 종목 목표 배당금 계산기
            </h2>
          </div>
          <p className="text-xs text-slate-500 pl-10">
            원하는 월 배당금을 설정하면 필요한 매수 수량과 예상 투자 원금을 즉시 계산합니다.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto pl-10 sm:pl-0">
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            배당소득세 {(taxRate * 100).toFixed(1)}% 반영
          </span>
          {!isKr && (
            <span className="text-[11px] font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-200/60">
              기준환율 {exchangeRate.toLocaleString()}원
            </span>
          )}
        </div>
      </div>

      {/* 목표 금액 슬라이더 및 빠른 선택 칩 */}
      <div className="space-y-3 bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/60">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="font-bold text-slate-700">희망 월 배당금 (세후 실수령 기준)</span>
          <span className="font-black text-blue-600 text-base sm:text-lg">
            월 {formatKrw(monthlyTarget)}
          </span>
        </div>

        <input
          type="range"
          min={100_000}
          max={5_000_000}
          step={50_000}
          value={monthlyTarget}
          onChange={(e) => setMonthlyTarget(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          aria-label="목표 월 배당금 슬라이더"
        />

        <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>월 10만 원</span>
          <span>월 250만 원</span>
          <span>월 500만 원</span>
        </div>

        {/* 프리셋 버튼 */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {PRESET_AMOUNTS.map((preset) => {
            const isSelected = monthlyTarget === preset.value;
            return (
              <button
                key={preset.value}
                type="button"
                onClick={() => setMonthlyTarget(preset.value)}
                className={`text-xs py-1.5 px-3 rounded-xl font-bold transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 시뮬레이션 결과 카드 (2열 그리드) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 결과 1: 필요 주식 수 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-blue-50/80 to-indigo-50/40 border border-blue-200/60 space-y-2">
          <span className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
            <Coins size={14} />
            목표 달성에 필요한 주식 수
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {calculation.neededShares.toLocaleString()}
            </span>
            <span className="text-sm font-bold text-slate-600">주</span>
          </div>
          <p className="text-[11px] text-slate-500">
            현재 주가 기준 1회 매수 시 목표 배당금 수령 조건을 충족합니다.
          </p>
        </div>

        {/* 결과 2: 예상 필요 투자 원금 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-teal-50/40 border border-emerald-200/60 space-y-2">
          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
            <DollarSign size={14} />
            예상 필요 투자 원금
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {formatKrw(calculation.totalInvestmentKrw)}
            </span>
            {!isKr && (
              <span className="text-xs font-bold text-slate-500">
                (${Math.round(calculation.totalInvestmentUsd).toLocaleString()})
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500">
            배당수익률 연 {stock.dividendYield.toFixed(2)}% (TTM 실측 기준) 역산치
          </p>
        </div>
      </div>

      {/* 상세 배당 입금 주기 요약 안내 & 포트폴리오 연계 CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs">
        <div className="space-y-0.5 text-slate-600">
          <div className="flex items-center gap-1 font-bold text-slate-800">
            <CheckCircle2 size={13} className="text-blue-600" />
            <span>실제 예상 수령액 안내:</span>
          </div>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            {cycleText} 약{' '}
            <strong className="text-slate-800">
              {Math.round(
                stock.dividendCycle === 'QUARTERLY'
                  ? calculation.actualMonthlyNetKrw * 3
                  : stock.dividendCycle === 'ANNUAL'
                  ? calculation.annualNetDividendKrw
                  : calculation.actualMonthlyNetKrw
              ).toLocaleString()}원
            </strong>
            씩 세후 계좌로 입금되며, 연간 실수령액 합계는 약{' '}
            <strong className="text-slate-800">
              {formatKrw(calculation.annualNetDividendKrw)}
            </strong>
            입니다.
          </p>
        </div>

        <Link
          href={`/?select=${stock.ticker}#fire-simulator`}
          className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shrink-0 shadow-xs cursor-pointer"
        >
          <span>포트폴리오에 담아 전체 시뮬레이션</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </section>
  );
}
