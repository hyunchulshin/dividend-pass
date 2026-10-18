'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { DividendStock, PortfolioItem, SimulationResult } from '@/types/stock';
import {
  Flame,
  AlertTriangle,
  Calculator,
  Sparkles,
  RefreshCw,
  Trash2,
  Plus,
  Info,
  CheckCircle2,
  DollarSign,
  Wallet,
  Calendar,
  ArrowRight,
  ArrowUpRight,
  BarChart2,
  Sliders,
} from 'lucide-react';
import InfoTooltip from '@/components/InfoTooltip';

const DEFAULT_EXCHANGE_RATE = 1350; // 기준 환율 1,350원
const KR_TAX_RATE = 0.154; // 국내 배당소득세 15.4%
const US_TAX_RATE = 0.150; // 미국 배당소득세 15.0%

interface FireCalculatorProps {
  portfolio: PortfolioItem[];
  allStocks: DividendStock[];
  onRemoveFromPortfolio: (ticker: string) => void;
  onSetPortfolio: (items: PortfolioItem[]) => void;
  onSelectStock: (stock: DividendStock) => void;
}

export default function FireCalculator({
  portfolio,
  allStocks,
  onRemoveFromPortfolio,
  onSetPortfolio,
  onSelectStock,
}: FireCalculatorProps) {
  // 목표 월 배당금 (기본 100만 원)
  const [targetMonthly, setTargetMonthly] = useState<number>(1_000_000);
  // 환율 설정 상태 (기본 1,350원)
  const [exchangeRate, setExchangeRate] = useState<number>(DEFAULT_EXCHANGE_RATE);
  const [isEditingExchange, setIsEditingExchange] = useState<boolean>(false);

  // 포트폴리오 내 미국 종목 포함 여부
  const hasUsStock = useMemo(() => {
    return portfolio.some((p) => p.stock.market === 'US');
  }, [portfolio]);

  // 대표 추천 포트폴리오 로드
  const loadDefaultPortfolio = () => {
    const defaultTickers = ['458730', 'JEPI', 'SCHD', '088980']; // TIGER 배당다우존스, JEPI, SCHD, 맥쿼리인프라
    const matched = allStocks.filter((s) => defaultTickers.includes(s.ticker));
    const equalWeight = matched.length > 0 ? 100 / matched.length : 100;
    const items: PortfolioItem[] = matched.map((stock) => ({
      stock,
      weight: equalWeight,
    }));
    onSetPortfolio(items);
  };

  // 빠른 금액 추가 버튼
  const handleAddAmount = (addWon: number) => {
    setTargetMonthly((prev) => Math.min(prev + addWon, 10_000_000));
  };

  // 균등 비중 맞추기
  const handleEqualWeights = () => {
    if (portfolio.length === 0) return;
    const equalWeight = 100 / portfolio.length;
    const updated = portfolio.map((item) => ({
      ...item,
      weight: equalWeight,
    }));
    onSetPortfolio(updated);
  };

  // 수학적 역산 시뮬레이션 계산
  const simulation: SimulationResult = useMemo(() => {
    const targetAnnual = targetMonthly * 12;
    if (portfolio.length === 0) {
      return {
        targetMonthly,
        targetAnnual,
        totalRequiredCapital: 0,
        actualMonthlyNet: 0,
        actualAnnualNet: 0,
        totalAnnualGross: 0,
        isComprehensiveTaxTarget: false,
        itemResults: [],
      };
    }

    // 비중 정규화
    const totalWeight = portfolio.reduce((sum, item) => sum + (item.weight || 0), 0) || 100;

    let totalRequiredCapital = 0;
    let actualAnnualNet = 0;
    let totalAnnualGross = 0;

    const itemResults = portfolio.map((item) => {
      const { stock, weight } = item;
      const normalizedRatio = weight / totalWeight;
      const targetItemAnnualNet = targetAnnual * normalizedRatio;

      const isKr = stock.market === 'KR';
      const taxRate = isKr ? KR_TAX_RATE : US_TAX_RATE;
      const priceWon = isKr ? stock.price : stock.price * exchangeRate;
      const dpsGrossWon = isKr ? stock.dpsTtm : stock.dpsTtm * exchangeRate;
      const dpsNetWon = dpsGrossWon * (1 - taxRate);

      // 주 단위 절상(ceil)
      const shares = dpsNetWon > 0 ? Math.ceil(targetItemAnnualNet / dpsNetWon) : 0;
      const requiredCapital = shares * priceWon;

      const itemAnnualGrossWon = shares * dpsGrossWon;
      const itemAnnualNetWon = shares * dpsNetWon;

      totalRequiredCapital += requiredCapital;
      actualAnnualNet += itemAnnualNetWon;
      totalAnnualGross += itemAnnualGrossWon;

      return {
        stock,
        shares,
        requiredCapital,
        annualGrossDpsWon: itemAnnualGrossWon,
        annualNetDpsWon: itemAnnualNetWon,
        taxRate,
      };
    });

    const actualMonthlyNet = actualAnnualNet / 12;
    // 금융소득종합과세 기준: 연간 세전 배당소득 2,000만 원 초과
    const isComprehensiveTaxTarget = totalAnnualGross > 20_000_000;

    return {
      targetMonthly,
      targetAnnual,
      totalRequiredCapital,
      actualMonthlyNet,
      actualAnnualNet,
      totalAnnualGross,
      isComprehensiveTaxTarget,
      itemResults,
    };
  }, [portfolio, targetMonthly, exchangeRate]);

  // 1월~12월 월별 예상 배당금 계산
  const monthlyCashflow = useMemo(() => {
    const months = Array(12).fill(0);

    simulation.itemResults.forEach((res) => {
      const netAnnual = res.annualNetDpsWon;
      if (netAnnual <= 0) return;

      const cycle = res.stock.dividendCycle;
      if (cycle === 'MONTHLY') {
        // 매월 고르게 분배
        for (let i = 0; i < 12; i++) {
          months[i] += netAnnual / 12;
        }
      } else if (cycle === 'QUARTERLY') {
        // 통상 3, 6, 9, 12월 분기 지급 (0-indexed: 2, 5, 8, 11)
        [2, 5, 8, 11].forEach((m) => {
          months[m] += netAnnual / 4;
        });
      } else {
        // 연배당: 통상 4월(0-indexed: 3) 정기 주총 결산 배당금 지급
        months[3] += netAnnual;
      }
    });

    const maxMonthAmount = Math.max(...months, 1);
    return { months, maxMonthAmount };
  }, [simulation.itemResults]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* ======================================================== */}
      {/* [좌측 5열 - 고정 입력 및 요약 대시보드] */}
      {/* ======================================================== */}
      <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-5">
        {/* 목표 금액 슬라이더 카드 */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Calculator size={19} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight leading-none">
                  파이어 역산 설정
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-none">
                  목표 월 배당금 입력
                </p>
              </div>
            </div>
            <InfoTooltip type="fire" iconSize={16} />
          </div>

          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-bold text-slate-600">목표 월 실수령액</span>
              <div className="text-right">
                <span className="text-3xl font-black text-blue-600 tracking-tight">
                  {(targetMonthly / 10_000).toLocaleString()}
                </span>
                <span className="text-sm font-bold text-slate-800 ml-1">만 원</span>
                <span className="text-xs text-slate-400 block font-normal mt-0.5">
                  (연간 {((targetMonthly * 12) / 10_000).toLocaleString()}만 원)
                </span>
              </div>
            </div>

            <input
              type="range"
              min={300_000}
              max={5_000_000}
              step={100_000}
              value={targetMonthly}
              onChange={(e) => setTargetMonthly(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />

            {/* 빠른 증액 버튼 */}
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {[100_000, 500_000, 1_000_000, 3_000_000].map((addVal) => (
                <button
                  key={addVal}
                  type="button"
                  onClick={() => handleAddAmount(addVal)}
                  className="py-1.5 px-2 text-xs font-semibold bg-white border border-slate-200/80 rounded-xl text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 active:scale-95 transition-all text-center"
                >
                  +{(addVal / 10_000).toLocaleString()}만
                </button>
              ))}
            </div>

            {/* 환율 설정 툴바 (미국 주식 포함 시 또는 필요 시 환율 변경) */}
            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
              <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                <DollarSign size={12} className="text-slate-400" />
                적용 환율:
              </span>
              <div className="flex items-center gap-1">
                {[1300, 1350, 1400].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => {
                      setExchangeRate(rate);
                      setIsEditingExchange(false);
                    }}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all ${
                      exchangeRate === rate && !isEditingExchange
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {rate}원
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setIsEditingExchange((prev) => !prev)}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-bold border transition-all ${
                    isEditingExchange
                      ? 'bg-blue-50 text-blue-600 border-blue-300'
                      : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  직접
                </button>
              </div>
            </div>

            {isEditingExchange && (
              <div className="flex items-center gap-2 pt-1 animate-in fade-in duration-150">
                <span className="text-xs text-slate-500 whitespace-nowrap">환율 직접 입력:</span>
                <input
                  type="number"
                  min={1000}
                  max={2000}
                  step={10}
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(Math.max(1000, Number(e.target.value)))}
                  className="w-24 px-2 py-1 bg-white border border-blue-300 rounded-lg text-xs font-bold text-slate-800 text-right focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <span className="text-xs font-bold text-slate-600">원 / USD</span>
              </div>
            )}
          </div>

          {/* 금융소득종합과세 2,000만 원 한도 게이지 바 */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <span>금융소득종합과세 한도 게이지</span>
                <InfoTooltip type="tax" iconSize={13} />
              </div>
              <span
                className={`text-[11px] font-black px-2 py-0.5 rounded-full ${
                  simulation.isComprehensiveTaxTarget
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {simulation.isComprehensiveTaxTarget ? '주의: 2,000만 원 초과' : '안전: 분리과세 구간'}
              </span>
            </div>

            {/* 게이지 바 */}
            <div className="space-y-1">
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    simulation.isComprehensiveTaxTarget
                      ? 'bg-rose-500'
                      : simulation.totalAnnualGross >= 15_000_000
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{
                    width: `${Math.min(100, (simulation.totalAnnualGross / 20_000_000) * 100)}%`,
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                <span>연 0원</span>
                <span>
                  연 세전{' '}
                  <strong className="text-slate-700 font-bold">
                    {(simulation.totalAnnualGross / 10_000).toLocaleString(undefined, { maximumFractionDigits: 0 })}만 원
                  </strong>{' '}
                  / 2,000만 원 (
                  {Math.min(999, Math.round((simulation.totalAnnualGross / 20_000_000) * 100))}%)
                </span>
                <span>2,000만 원</span>
              </div>
            </div>

            {simulation.isComprehensiveTaxTarget ? (
              <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200/70 text-[11px] text-rose-800 leading-relaxed space-y-1">
                <p>
                  연 세전 배당금이 2,000만 원을 초과하여 타 소득과 합산 과세됩니다. ISA 또는 연금저축 계좌를 활용해 세금을 절약하세요.
                </p>
                <Link
                  href="/guide/dividend-tax"
                  className="inline-flex items-center gap-1 font-bold text-rose-700 hover:text-rose-900 underline"
                >
                  <span>2,000만 원 금융소득종합과세 절세 가이드 읽기</span>
                  <ArrowUpRight size={12} />
                </Link>
              </div>
            ) : (
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                <span>15.4%(미국 15%) 원천징수로 세금 종결</span>
                <Link
                  href="/guide/dividend-tax"
                  className="text-blue-600 hover:text-blue-700 font-bold hover:underline"
                >
                  절세 팁 보기
                </Link>
              </div>
            )}
          </div>

          {/* 핵심 요약 카드 (청약패스식 딥 슬레이트 단색) */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3.5 shadow-sm border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-medium">필요 총 투자 자본 (원화 환산)</span>
              <span className="text-[11px] bg-white/10 px-2.5 py-0.5 rounded text-blue-200 font-mono">
                환율 {exchangeRate.toLocaleString()}원
              </span>
            </div>

            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {portfolio.length > 0 ? (
                <>
                  {(simulation.totalRequiredCapital / 100_000_000).toFixed(2)}
                  <span className="text-xl font-bold text-slate-300 ml-1.5">억 원</span>
                  <span className="text-xs text-slate-400 block font-normal mt-1">
                    (약 {Math.round(simulation.totalRequiredCapital).toLocaleString()}원)
                  </span>
                </>
              ) : (
                <span className="text-base text-slate-400 font-normal">
                  종목을 담아 시뮬레이션을 시작하세요
                </span>
              )}
            </div>

            <div className="pt-3 border-t border-white/15 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 text-[11px]">예상 실제 세후 월 수령액</span>
                <div className="font-extrabold text-emerald-400 text-base mt-0.5">
                  {portfolio.length > 0
                    ? `${Math.round(simulation.actualMonthlyNet).toLocaleString()}원`
                    : '-'}
                </div>
              </div>
              <div>
                <span className="text-slate-400 text-[11px]">목표 대비 달성률</span>
                <div className="font-extrabold text-blue-300 text-base mt-0.5">
                  {portfolio.length > 0
                    ? `${((simulation.actualMonthlyNet / simulation.targetMonthly) * 100).toFixed(1)}%`
                    : '-'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* [우측 7열 - 담은 포트폴리오 목록 & 종목별 상세 결과] */}
      {/* ======================================================== */}
      <div className="lg:col-span-7 space-y-5">
        {/* 1월~12월 월별 예상 배당금 입금 캘린더 차트 (포트폴리오가 있을 때 노출) */}
        {portfolio.length > 0 && (
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-blue-200/80 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Calendar size={17} />
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900 tracking-tight">
                    1월~12월 월별 배당 입금 캘린더
                  </h4>
                </div>
                <p className="text-xs text-slate-500 pl-10">
                  선택한 종목들의 배당 주기에 따른 매월 예상 세후 입금액 흐름
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto pl-10 sm:pl-0">
                <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                  월평균 {(simulation.actualMonthlyNet / 10_000).toLocaleString(undefined, { maximumFractionDigits: 1 })}만 원
                </span>
              </div>
            </div>

            {/* 12개 월 바 차트 컨테이너 */}
            <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-100 space-y-3">
              <div className="grid grid-cols-12 gap-1 sm:gap-2 items-end h-32 sm:h-36 pt-4 pb-1">
                {monthlyCashflow.months.map((amt, idx) => {
                  const heightPercent =
                    amt > 0 ? Math.max(12, Math.round((amt / monthlyCashflow.maxMonthAmount) * 100)) : 6;
                  const isMax = amt > 0 && amt === monthlyCashflow.maxMonthAmount;

                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center justify-end h-full group relative"
                    >
                      {/* 툴팁 (금액 표시) */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-900 text-white text-[10px] font-bold py-1 px-1.5 rounded shadow-md whitespace-nowrap z-20 pointer-events-none">
                        {Math.round(amt).toLocaleString()}원
                      </div>

                      {/* 바 차트 기둥 */}
                      <div className="w-full max-w-[28px] h-full flex items-end">
                        <div
                          className={`w-full rounded-t-md transition-all duration-300 ${
                            amt === 0
                              ? 'bg-slate-200'
                              : isMax
                              ? 'bg-blue-600 group-hover:bg-blue-700 shadow-xs'
                              : 'bg-blue-400 group-hover:bg-blue-500'
                          }`}
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>

                      {/* 하단 월 라벨 */}
                      <span
                        className={`text-[10px] mt-2 font-mono font-bold ${
                          isMax ? 'text-blue-700' : 'text-slate-500'
                        }`}
                      >
                        {idx + 1}월
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200/60">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-blue-600 inline-block" />
                  <span>진한 색: 최다 입금 월</span>
                </span>
                <span>막대를 누르거나 마우스를 올리면 월별 상세 금액 확인</span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h4 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>담은 포트폴리오 종목</span>
                <span className="text-xs font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  {portfolio.length}개
                </span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                종목별 필요 주식 수 및 원금 배분 내역
              </p>
            </div>

            {portfolio.length > 0 && (
              <button
                type="button"
                onClick={handleEqualWeights}
                className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200/60 hover:bg-blue-100 transition-colors"
              >
                균등 비중 재배분
              </button>
            )}
          </div>

          {portfolio.length === 0 ? (
            /* 빈 상태 */
            <div className="py-16 px-6 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
                <Sparkles size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">
                  아직 담은 배당 종목이 없습니다
                </p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  [3대 큐레이션 탐색]에서 원하는 종목을 담거나, 검증된 대표 포트폴리오로 바로 시작해보세요.
                </p>
              </div>
              <button
                type="button"
                onClick={loadDefaultPortfolio}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all"
              >
                <Sparkles size={15} />
                <span>대표 4대 배당 포트폴리오 즉시 담기</span>
              </button>
            </div>
          ) : (
            /* 종목별 역산 상세 리스트 */
            <div className="space-y-3.5">
              {simulation.itemResults.map((res) => {
                const { stock, shares, requiredCapital, annualNetDpsWon, taxRate } = res;
                const isKr = stock.market === 'KR';

                return (
                  <div
                    key={stock.ticker}
                    className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-blue-300 transition-all space-y-3"
                  >
                    {/* 상단: 티커, 종목명, 제거 버튼 */}
                    <div className="flex items-start justify-between gap-2">
                      <div
                        className="cursor-pointer group flex-1"
                        onClick={() => onSelectStock(stock)}
                      >
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              isKr
                                ? 'bg-red-50 text-red-600 border border-red-200/60'
                                : 'bg-blue-50 text-blue-600 border border-blue-200/60'
                            }`}
                          >
                            {stock.market}
                          </span>
                          <span className="font-mono text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                            {stock.ticker}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            (세율 {(taxRate * 100).toFixed(1)}%)
                          </span>
                        </div>
                        <h5 className="text-sm font-bold text-slate-900 mt-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {stock.name}
                        </h5>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveFromPortfolio(stock.ticker)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                        title="포트폴리오에서 제거"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* 그리드: 필요 주식 수 & 필요 투자 원금 */}
                    <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-200/60 text-xs">
                      <div className="bg-white rounded-xl p-2.5 border border-slate-100">
                        <span className="text-[11px] text-slate-400 font-medium">필요 매수 주식 수</span>
                        <div className="font-black text-blue-600 text-base mt-0.5">
                          {shares.toLocaleString()}주
                        </div>
                      </div>

                      <div className="bg-white rounded-xl p-2.5 border border-slate-100">
                        <span className="text-[11px] text-slate-400 font-medium">필요 투자 원금</span>
                        <div className="font-black text-slate-800 text-base mt-0.5 truncate">
                          {(requiredCapital / 10_000).toLocaleString(undefined, { maximumFractionDigits: 0 })}만 원
                        </div>
                      </div>
                    </div>

                    {/* 세후 월 배당 수령액 */}
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-0.5">
                      <span>예상 세후 실수령:</span>
                      <span className="font-bold text-emerald-600">
                        월 {Math.round(annualNetDpsWon / 12).toLocaleString()}원 (연 {Math.round(annualNetDpsWon).toLocaleString()}원)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
