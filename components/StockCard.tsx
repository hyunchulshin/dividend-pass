import React from 'react';
import { DividendStock } from '@/types/stock';
import { Flame, AlertTriangle } from 'lucide-react';
import InfoTooltip from '@/components/InfoTooltip';

interface StockCardProps {
  stock: DividendStock;
  rank?: number;
}

export default function StockCard({ stock, rank }: StockCardProps) {
  const isMonthly = stock.dividendCycle === 'MONTHLY';
  const isKr = stock.market === 'KR';

  // 가격 포맷
  const formattedPrice = isKr
    ? `${Math.round(stock.price).toLocaleString()}원`
    : `$${stock.price.toFixed(2)}`;

  // 배당금 포맷
  const formattedDps = isKr
    ? `${Math.round(stock.dpsTtm).toLocaleString()}원`
    : `$${stock.dpsTtm.toFixed(2)}`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md transition-all duration-200">
      {/* 상단: 랭크/시장/티커 + 배당주기 뱃지 */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {rank !== undefined && (
            <span className="text-xs font-bold text-slate-400 w-5">
              #{rank}
            </span>
          )}
          <span
            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              isKr
                ? 'bg-red-50 text-red-600 border border-red-200/60'
                : 'bg-blue-50 text-blue-600 border border-blue-200/60'
            }`}
          >
            {stock.market}
          </span>
          <span className="text-xs font-mono font-bold text-slate-700">
            {stock.ticker}
          </span>
          <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
            {stock.assetType}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {stock.isHighRisk && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              <AlertTriangle size={11} className="stroke-[2.5]" />
              고위험
            </span>
          )}
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isMonthly
                ? 'bg-rose-50 text-rose-600 border border-rose-200/60'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {isMonthly ? '🗓️ 월배당' : stock.dividendCycle}
          </span>
        </div>
      </div>

      {/* 중단: 종목명 */}
      <div className="mt-2 mb-3">
        <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1">
          {stock.name}
        </h3>
      </div>

      {/* 하단 그리드: 배당수익률, 주가, DPS, 인기점수 */}
      <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-slate-100 text-center">
        {/* 배당수익률 (가장 강조) */}
        <div className="bg-slate-50/70 rounded-xl p-2">
          <div className="text-[10px] text-slate-500 font-medium flex items-center justify-center gap-0.5">
            배당률
            <InfoTooltip type="ttm" iconSize={12} />
          </div>
          <div className="text-base font-extrabold text-blue-600 tracking-tight mt-0.5">
            {stock.dividendYield.toFixed(2)}%
          </div>
        </div>

        {/* 현재가 / 연간 DPS */}
        <div className="bg-slate-50/70 rounded-xl p-2">
          <div className="text-[10px] text-slate-500 font-medium">현재가</div>
          <div className="text-xs font-bold text-slate-800 mt-1 truncate">
            {formattedPrice}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 truncate">
            연 {formattedDps}
          </div>
        </div>

        {/* 인기 점수 */}
        <div className="bg-slate-50/70 rounded-xl p-2">
          <div className="text-[10px] text-slate-500 font-medium flex items-center justify-center gap-0.5">
            인기점수
            <InfoTooltip type="popularity" iconSize={12} />
          </div>
          <div className="text-xs font-bold text-slate-800 mt-1 flex items-center justify-center gap-0.5">
            <Flame size={12} className="text-orange-500 fill-orange-500" />
            <span>{stock.popularityScore.toFixed(1)}</span>
          </div>
          {stock.isEtf && stock.expenseRatio > 0 && (
            <div className="text-[10px] text-slate-400 mt-0.5">
              보수 {stock.expenseRatio}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
