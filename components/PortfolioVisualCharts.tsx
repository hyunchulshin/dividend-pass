'use client';

import React, { useMemo } from 'react';
import { PortfolioItem } from '@/types/stock';
import { DEFAULT_USD_KRW_RATE } from '@/lib/stockAnalysis';
import { BarChart3, TrendingUp } from 'lucide-react';

interface PortfolioVisualChartsProps {
  portfolio: PortfolioItem[];
}

const MONTH_LABELS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
const KR_TAX_RATE = 0.154;
const US_TAX_RATE = 0.15;
const BASE_CAPITAL_KRW = 100_000_000; // 1억 원 기준

/**
 * 보유/시뮬레이션 포트폴리오 기준 1~12월 예상 월배당 분포 SVG 바 차트 및 10년 DRIP 복리 성장 SVG 차트
 */
export default function PortfolioVisualCharts({ portfolio }: PortfolioVisualChartsProps) {
  const { monthlyAfterTax, weightedAfterTaxYield, dripPoints, simplePoints } = useMemo(() => {
    const months = Array(12).fill(0) as number[];
    const totalWeight = portfolio.reduce((acc, item) => acc + (item.weight || 0), 0);
    const safeItems = portfolio.length > 0 ? portfolio : [];

    let totalAnnualNetOnBase = 0;

    safeItems.forEach((item) => {
      const normalizedWeight =
        totalWeight > 0 ? (item.weight || 0) / totalWeight : 1 / Math.max(safeItems.length, 1);
      const allocatedKrw = BASE_CAPITAL_KRW * normalizedWeight;
      const taxRate = item.stock.market === 'KR' ? KR_TAX_RATE : US_TAX_RATE;
      const annualNet = allocatedKrw * (item.stock.dividendYield / 100) * (1 - taxRate);
      totalAnnualNetOnBase += annualNet;

      const cycle = item.stock.dividendCycle;
      if (cycle === 'MONTHLY') {
        for (let m = 0; m < 12; m += 1) {
          months[m] += annualNet / 12;
        }
      } else if (cycle === 'QUARTERLY') {
        // 3, 6, 9, 12월 대표 분기 배당 기준 분포
        [2, 5, 8, 11].forEach((mIdx) => {
          months[mIdx] += annualNet / 4;
        });
      } else if (cycle === 'SEMI_ANNUAL') {
        // 6, 12월 반기 배당 기준 분포
        [5, 11].forEach((mIdx) => {
          months[mIdx] += annualNet / 2;
        });
      } else {
        // 연 배당: 국내 4월 결산배당, 미국 12월 기준 분포
        const annualMonthIdx = item.stock.market === 'KR' ? 3 : 11;
        months[annualMonthIdx] += annualNet;
      }
    });

    const netYieldRate = totalAnnualNetOnBase / BASE_CAPITAL_KRW;
    const priceGrowthRate = 0.03; // 보수적 연 3% 주가/배당 성장 가정

    // 10년 배당 재투자(DRIP) vs 단순 현금 수령 누적 총자산 (만 원 단위)
    const drip: { year: number; totalMan: number }[] = [];
    const simple: { year: number; totalMan: number }[] = [];

    let dripPrincipal = BASE_CAPITAL_KRW;
    let simpleCumulativeDiv = 0;

    for (let yr = 0; yr <= 10; yr += 1) {
      if (yr === 0) {
        drip.push({ year: 0, totalMan: Math.round(BASE_CAPITAL_KRW / 10_000) });
        simple.push({ year: 0, totalMan: Math.round(BASE_CAPITAL_KRW / 10_000) });
      } else {
        dripPrincipal = dripPrincipal * (1 + netYieldRate + priceGrowthRate);
        const simpleAssetValue = BASE_CAPITAL_KRW * Math.pow(1 + priceGrowthRate, yr);
        simpleCumulativeDiv += BASE_CAPITAL_KRW * Math.pow(1 + priceGrowthRate, yr - 1) * netYieldRate;
        drip.push({ year: yr, totalMan: Math.round(dripPrincipal / 10_000) });
        simple.push({ year: yr, totalMan: Math.round((simpleAssetValue + simpleCumulativeDiv) / 10_000) });
      }
    }

    return {
      monthlyAfterTax: months,
      weightedAfterTaxYield: netYieldRate * 100,
      dripPoints: drip,
      simplePoints: simple,
    };
  }, [portfolio]);

  const maxMonthVal = Math.max(...monthlyAfterTax, 100_000);
  const totalAnnualNet = monthlyAfterTax.reduce((a, b) => a + b, 0);

  // SVG 2 (DRIP 라인 차트) 좌표 계산
  const chartW = 580;
  const chartH = 190;
  const padL = 52;
  const padR = 20;
  const padT = 18;
  const padB = 28;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padT - padB;

  const minMan = 10_000;
  const maxMan = Math.max(...dripPoints.map((d) => d.totalMan), 15_000);
  const spanMan = Math.max(maxMan - minMan, 2_000);

  const toX = (yr: number) => padL + (yr / 10) * plotW;
  const toY = (valMan: number) => padT + plotH - ((valMan - minMan) / spanMan) * plotH;

  const dripPolyline = dripPoints.map((p) => `${toX(p.year).toFixed(1)},${toY(p.totalMan).toFixed(1)}`).join(' ');
  const simplePolyline = simplePoints.map((p) => `${toX(p.year).toFixed(1)},${toY(p.totalMan).toFixed(1)}`).join(' ');

  const dripYear10 = dripPoints[10]?.totalMan ?? 10_000;
  const simpleYear10 = simplePoints[10]?.totalMan ?? 10_000;

  return (
    <section
      aria-label="포트폴리오 배당 현금흐름 및 DRIP 복리 시각화"
      className="grid grid-cols-1 lg:grid-cols-2 gap-4"
    >
      {/* 차트 1: 1~12월 월별 예상 세후 배당금 분포 SVG 바 차트 */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-600">
              <BarChart3 size={14} />
              <span>1억 원 분산투자 기준 · 세후 연 {Math.round(totalAnnualNet / 10_000).toLocaleString()}만 원</span>
            </div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5">
              1~12월 월별 예상 세후 배당금 분포
            </h2>
          </div>
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 shrink-0">
            기준환율 {DEFAULT_USD_KRW_RATE.toLocaleString()}원
          </span>
        </div>

        <div className="w-full overflow-x-auto">
          <svg
            viewBox="0 0 580 205"
            className="w-full h-auto min-w-[360px]"
            role="img"
            aria-label="1월부터 12월까지 포트폴리오 예상 월별 세후 배당금 막대 차트"
          >
            <title>1~12월 월별 예상 세후 배당금 분포 차트</title>
            {/* 수평 기준선 */}
            {[0, 0.5, 1].map((ratio, idx) => {
              const yPos = 165 - ratio * 130;
              const labelVal = Math.round((maxMonthVal * ratio) / 10_000);
              return (
                <g key={idx}>
                  <line
                    x1={44}
                    y1={yPos}
                    x2={564}
                    y2={yPos}
                    stroke="#e2e8f0"
                    strokeDasharray={ratio === 0 ? undefined : '3 3'}
                    strokeWidth={1}
                  />
                  <text
                    x={38}
                    y={yPos + 4}
                    textAnchor="end"
                    fontSize={10}
                    fill="#64748b"
                  >
                    {labelVal}만
                  </text>
                </g>
              );
            })}

            {/* 12개월 바 */}
            {monthlyAfterTax.map((val, mIdx) => {
              const barH = Math.max((val / maxMonthVal) * 130, 3);
              const x = 52 + mIdx * 42.5;
              const y = 165 - barH;
              const isPeak = val >= maxMonthVal * 0.85;
              return (
                <g key={mIdx}>
                  <rect
                    x={x}
                    y={y}
                    width={28}
                    height={barH}
                    rx={5}
                    fill={isPeak ? '#2563eb' : '#60a5fa'}
                  />
                  <text
                    x={x + 14}
                    y={y - 5}
                    textAnchor="middle"
                    fontSize={9}
                    fontWeight={700}
                    fill="#1e293b"
                  >
                    {Math.round(val / 10_000)}
                  </text>
                  <text
                    x={x + 14}
                    y={184}
                    textAnchor="middle"
                    fontSize={10}
                    fontWeight={600}
                    fill="#475569"
                  >
                    {MONTH_LABELS[mIdx]}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <p className="text-[11px] text-slate-500 leading-relaxed">
          현재 포트폴리오 {portfolio.length}개 종목 동일 비중(세후 실수령률 연 {weightedAfterTaxYield.toFixed(2)}%, 국내 15.4%·미국 15.0% 원천징수 차감) 기준입니다. 분기·반기 배당은 3·6·9·12월 대표 지급월로 모델링했습니다.
        </p>
      </div>

      {/* 차트 2: 10년 배당 재투자(DRIP) vs 단순 수령 복리 성장 SVG 차트 */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
              <TrendingUp size={14} />
              <span>10년 차 DRIP 총자산 {(dripYear10 / 10_000).toFixed(2)}억 원</span>
            </div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5">
              10년 배당 재투자(DRIP) vs 단순 수령 복리 성장
            </h2>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/70 shrink-0">
            복리 격차 +{(dripYear10 - simpleYear10).toLocaleString()}만
          </span>
        </div>

        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartW} ${chartH}`}
            className="w-full h-auto min-w-[360px]"
            role="img"
            aria-label="10년 배당 재투자(DRIP)와 단순 현금 수령의 누적 자산 성장 비교 선 차트"
          >
            <title>10년 배당 재투자(DRIP) 복리 성장 차트</title>
            {/* 기준 가로선 */}
            {[0, 0.5, 1].map((r, i) => {
              const val = Math.round(minMan + spanMan * r);
              const y = toY(val);
              return (
                <g key={i}>
                  <line
                    x1={padL}
                    y1={y}
                    x2={chartW - padR}
                    y2={y}
                    stroke="#e2e8f0"
                    strokeDasharray={r === 0 ? undefined : '3 3'}
                    strokeWidth={1}
                  />
                  <text x={padL - 6} y={y + 4} textAnchor="end" fontSize={10} fill="#64748b">
                    {(val / 10_000).toFixed(1)}억
                  </text>
                </g>
              );
            })}

            {/* X축 연도 라벨 */}
            {[0, 2, 4, 6, 8, 10].map((yr) => (
              <text
                key={yr}
                x={toX(yr)}
                y={chartH - 8}
                textAnchor="middle"
                fontSize={10}
                fill="#475569"
              >
                {yr}년
              </text>
            ))}

            {/* 단순 현금 수령 (슬레이트 점선) */}
            <polyline
              fill="none"
              stroke="#94a3b8"
              strokeWidth={2.5}
              strokeDasharray="5 4"
              points={simplePolyline}
            />

            {/* DRIP 재투자 (에메랄드 실선) */}
            <polyline
              fill="none"
              stroke="#059669"
              strokeWidth={3}
              points={dripPolyline}
            />

            {/* 포인트 마커 */}
            {dripPoints.filter((_, idx) => idx % 2 === 0).map((pt) => (
              <circle
                key={`drip-${pt.year}`}
                cx={toX(pt.year)}
                cy={toY(pt.totalMan)}
                r={3.5}
                fill="#059669"
                stroke="#ffffff"
                strokeWidth={1.5}
              />
            ))}

            {/* 범례 */}
            <g transform={`translate(${padL + 10}, 12)`}>
              <line x1={0} y1={5} x2={16} y2={5} stroke="#059669" strokeWidth={3} />
              <text x={22} y={9} fontSize={10} fontWeight={700} fill="#065f46">
                세후 배당 재투자(DRIP)
              </text>
              <line x1={150} y1={5} x2={166} y2={5} stroke="#94a3b8" strokeWidth={2.5} strokeDasharray="4 3" />
              <text x={172} y={9} fontSize={10} fontWeight={600} fill="#475569">
                배당 단순 현금 수령
              </text>
            </g>
          </svg>
        </div>

        <p className="text-[11px] text-slate-500 leading-relaxed">
          초기 자본 1억 원 · 연 3.0% 완만한 주가 성장 가정 하에 세후 배당금 전액을 동일 포트폴리오에 재투자(DRIP)한 경우와 현금 인출한 경우의 10년 누적 총자산 비교입니다.
        </p>
      </div>
    </section>
  );
}
