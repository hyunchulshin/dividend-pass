'use client';

import React, { useState, useMemo } from 'react';
import { DividendStock, PortfolioItem, SimulationResult } from '@/types/stock';
import { Flame, AlertTriangle, Calculator, Sparkles, RefreshCw, Trash2, Plus, Info, CheckCircle2, DollarSign, Wallet } from 'lucide-react';
import InfoTooltip from '@/components/InfoTooltip';

const USD_KRW_EXCHANGE_RATE = 1350; // 기획서 고정 환율 1,350원
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
      const priceWon = isKr ? stock.price : stock.price * USD_KRW_EXCHANGE_RATE;
      const dpsGrossWon = isKr ? stock.dpsTtm : stock.dpsTtm * USD_KRW_EXCHANGE_RATE;
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
  }, [portfolio, targetMonthly]);

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
          </div>

          {/* 종합과세 경고 배너 */}
          {simulation.isComprehensiveTaxTarget && (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <span>⚠️ 금융소득종합과세 대상 안내</span>
                  <InfoTooltip type="tax" iconSize={13} />
                </div>
                <p className="text-amber-800 mt-1 text-[11px]">
                  연간 세전 배당금이 <strong className="font-extrabold underline">{Math.round(simulation.totalAnnualGross).toLocaleString()}원</strong>으로 2,000만 원을 초과합니다. 2,000만 원 초과분은 근로·사업 등 타 소득과 합산되어 누진세율이 적용됩니다.
                </p>
              </div>
            </div>
          )}

          {/* 핵심 요약 카드 (청약패스식 딥 슬레이트 단색) */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3.5 shadow-sm border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-medium">필요 총 투자 자본 (원화 환산)</span>
              <span className="text-[11px] bg-white/10 px-2.5 py-0.5 rounded text-blue-200 font-mono">
                환율 1,350원
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
