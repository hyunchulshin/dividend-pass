import React from 'react';
import { DividendStock } from '@/types/stock';
import { Flame, AlertTriangle, Plus, Check } from 'lucide-react';
import InfoTooltip from '@/components/InfoTooltip';

interface StockCardProps {
  stock: DividendStock;
  rank?: number;
  isInPortfolio?: boolean;
  onTogglePortfolio?: (stock: DividendStock) => void;
  onSelectStock?: (stock: DividendStock) => void;
}

export default function StockCard({
  stock,
  rank,
  isInPortfolio,
  onTogglePortfolio,
  onSelectStock,
}: StockCardProps) {
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
    <div
      onClick={() => onSelectStock && onSelectStock(stock)}
      className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer relative group"
    >
      {/* 상단: 랭크/시장/티커 + 배당주기 뱃지 + 담기 버튼 */}
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

        <div className="flex items-center gap-1.5 shrink-0">
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

          {/* 인라인 담기 버튼 */}
          {onTogglePortfolio && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onTogglePortfolio(stock);
              }}
              className={`p-1 rounded-lg border text-[11px] font-semibold flex items-center gap-0.5 transition-all ${
                isInPortfolio
                  ? 'bg-blue-600 text-white border-blue-600 hover:bg-rose-600 hover:border-rose-600'
                  : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'
              }`}
              title={isInPortfolio ? '포트폴리오에서 제거' : '포트폴리오에 담기'}
            >
              {isInPortfolio ? (
                <Check size={12} className="stroke-[3]" />
              ) : (
                <Plus size={12} className="stroke-[3]" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* 중단: 종목명 */}
      <div className="mt-2 mb-3">
        <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1 group-hover:text-blue-600 transition-colors">
          {stock.name}
        </h3>
      </div>

      {/* 하단 그리드: 배당수익률, 주가, DPS, 인기점수 */}
      <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-slate-100 text-center">
        {/* 배당수익률 */}
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
