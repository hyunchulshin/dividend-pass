'use client';

import React, { useEffect } from 'react';
import { DividendStock } from '@/types/stock';
import { X, Flame, ShieldCheck, AlertTriangle, Plus, Check, Trash2, PieChart, Info, DollarSign, Calendar } from 'lucide-react';
import InfoTooltip from '@/components/InfoTooltip';

interface EtfModalProps {
  stock: DividendStock | null;
  isOpen: boolean;
  onClose: () => void;
  isInPortfolio: boolean;
  onTogglePortfolio: (stock: DividendStock) => void;
}

export default function EtfModal({
  stock,
  isOpen,
  onClose,
  isInPortfolio,
  onTogglePortfolio,
}: EtfModalProps) {
  // ESC 키로 닫기
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !stock) return null;

  const isKr = stock.market === 'KR';
  const isMonthly = stock.dividendCycle === 'MONTHLY';

  const formattedPrice = isKr
    ? `${Math.round(stock.price).toLocaleString()}원`
    : `$${stock.price.toFixed(2)}`;

  const formattedDps = isKr
    ? `${Math.round(stock.dpsTtm).toLocaleString()}원`
    : `$${stock.dpsTtm.toFixed(2)}`;

  const formattedMcap = isKr
    ? `${(stock.marketCap / 100_000_000_000).toFixed(1)}천억 원`
    : `$${(stock.marketCap / 1_000_000_000).toFixed(2)}B`;

  // 상위 편입비중 가상 가중치 (1위 9~12%, 순차 감쇄)
  const holdingsWithWeights = (stock.topHoldings || []).map((name, idx) => {
    const weights = [11.2, 8.5, 6.8, 5.4, 4.3];
    return {
      name,
      weight: weights[idx] || 3.5,
    };
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                isKr
                  ? 'bg-red-50 text-red-600 border border-red-200/60'
                  : 'bg-blue-50 text-blue-600 border border-blue-200/60'
              }`}
            >
              {stock.market}
            </span>
            <span className="font-mono text-xs font-bold text-slate-500">
              {stock.ticker}
            </span>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {stock.assetType}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="모달 닫기"
          >
            <X size={18} />
          </button>
        </div>

        {/* 모달 본문 */}
        <div className="p-5 space-y-5 flex-1">
          {/* 종목 기본명 & 뱃지 */}
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  isMonthly
                    ? 'bg-rose-50 text-rose-600 border border-rose-200/60'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {isMonthly ? '🗓️ 월배당 지급' : `${stock.dividendCycle} 배당`}
              </span>
              {stock.isHighRisk && (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  <AlertTriangle size={12} className="stroke-[2.5]" />
                  고위험 (연 20% 초과)
                </span>
              )}
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {stock.name}
            </h2>
          </div>

          {/* 핵심 지표 4칸 카드 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 text-center">
              <div className="text-[11px] text-slate-500 font-medium flex items-center justify-center gap-0.5">
                배당률 (TTM)
                <InfoTooltip type="ttm" iconSize={12} />
              </div>
              <div className="text-lg font-black text-blue-600 mt-1">
                {stock.dividendYield.toFixed(2)}%
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 text-center">
              <div className="text-[11px] text-slate-500 font-medium">주당 배당금(DPS)</div>
              <div className="text-sm font-bold text-slate-800 mt-1">
                {formattedDps}
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 text-center">
              <div className="text-[11px] text-slate-500 font-medium">현재 주가</div>
              <div className="text-sm font-bold text-slate-800 mt-1">
                {formattedPrice}
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 text-center">
              <div className="text-[11px] text-slate-500 font-medium flex items-center justify-center gap-0.5">
                인기 점수
                <InfoTooltip type="popularity" iconSize={12} />
              </div>
              <div className="text-sm font-bold text-slate-800 mt-1 flex items-center justify-center gap-1">
                <Flame size={13} className="text-orange-500 fill-orange-500" />
                <span>{stock.popularityScore.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* ETF 세부 정보 (운용보수 & 편입종목) */}
          {stock.isEtf && (
            <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <PieChart size={14} className="text-blue-600" />
                  <span>ETF 운용 정보</span>
                </div>
                <div className="text-xs font-medium text-slate-600">
                  총보수:{' '}
                  <span className="font-bold text-blue-600">
                    {stock.expenseRatio > 0 ? `${stock.expenseRatio}%` : 'N/A'}
                  </span>
                </div>
              </div>

              {/* 상위 편입종목 리스트/게이지 */}
              {stock.topHoldingsAvailable && holdingsWithWeights.length > 0 ? (
                <div className="space-y-2 pt-1 border-t border-slate-200/60">
                  <div className="text-[11px] font-semibold text-slate-500 flex items-center justify-between">
                    <span>상위 구성 종목 TOP {holdingsWithWeights.length}</span>
                    <span>예상 비중</span>
                  </div>
                  <div className="space-y-2">
                    {holdingsWithWeights.map((h, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-slate-700">
                            {i + 1}. {h.name}
                          </span>
                          <span className="font-mono text-slate-500 text-[11px]">
                            {h.weight.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full"
                            style={{ width: `${Math.min(h.weight * 7, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-400 text-center py-2">
                  구성 종목 정보는 자산운용사 공시를 참조하세요.
                </div>
              )}
            </div>
          )}

          {/* 부가 메타데이터 안내 (시가총액, 거래량) */}
          <div className="bg-white rounded-2xl border border-slate-100 p-3 text-xs space-y-1.5 text-slate-500">
            <div className="flex justify-between">
              <span>시가총액 (AUM)</span>
              <span className="font-medium text-slate-800">{formattedMcap}</span>
            </div>
            <div className="flex justify-between">
              <span>일일 거래량</span>
              <span className="font-medium text-slate-800">
                {stock.volume.toLocaleString()}주
              </span>
            </div>
            <div className="flex justify-between">
              <span>배당 산출 기준</span>
              <span className="font-medium text-slate-800">
                {stock.yieldBasis === 'ANNUALIZED' ? '연환산 (최근 분배금 기반)' : '과거 12개월 TTM 실측치'}
              </span>
            </div>
          </div>
        </div>

        {/* 모달 하단 고정 액션 버튼 */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-md p-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => onTogglePortfolio(stock)}
            className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
              isInPortfolio
                ? 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20 active:scale-[0.99]'
            }`}
          >
            {isInPortfolio ? (
              <>
                <Trash2 size={16} />
                <span>시뮬레이터에서 제거하기</span>
              </>
            ) : (
              <>
                <Plus size={17} className="stroke-[2.5]" />
                <span>[+ 파이어 시뮬레이터에 담기]</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
