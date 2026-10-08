'use client';

import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { TooltipType } from '@/types/stock';

interface TooltipContent {
  title: string;
  description: string;
  detail?: string;
}

const TOOLTIP_DATA: Record<TooltipType, TooltipContent> = {
  popularity: {
    title: '인기 점수 (Popularity Score)',
    description: '시가총액(순자산 AUM) 순위 60% + 일평균 거래대금 순위 40%를 가중 합산하여 0~100점으로 정규화한 신뢰 지표입니다.',
    detail: '인위적 가산점 없이 순수 시장 지표만으로 계산되어 대형 우량 자산과 활성 거래 종목이 상위에 배치됩니다.',
  },
  ttm: {
    title: 'TTM 배당수익률 (Trailing 12 Months)',
    description: '최근 12개월간 실제로 주주/투자자에게 지급된 과거 분배금(DPS)의 누적 합계를 현재 주가로 나눈 실측 배당률입니다.',
    detail: '일회성 특수배당이나 미래 추정치가 아닌, 실제 지급된 현금 흐름을 기준으로 산출됩니다.',
  },
  safety: {
    title: '안전 필터링 기준',
    description: '유동성 및 재무 안정성을 위해 국내 시총 1,000억 원 미만, 미국 시총 $500M(약 6,700억 원) 미만 종목은 데이터셋에서 엄격히 제외됩니다.',
    detail: 'TTM 배당률이 20%를 초과하는 초고배당 상품은 원금 손실 위험 방지를 위해 [고위험] 플래그가 자동 부착됩니다.',
  },
  cycle: {
    title: '배당 지급 주기',
    description: '분배금 지급 빈도를 나타냅니다. 월배당(MONTHLY), 분기배당(QUARTERLY), 연배당(ANNUAL)으로 분류됩니다.',
    detail: '월배당 ETF는 은퇴자 및 정기 현금흐름 선호 투자자에게 적합한 구조를 갖추고 있습니다.',
  },
  risk: {
    title: '고위험 종목 안내',
    description: '연간 환산 배당률이 20%를 초과하는 커버드콜 또는 고레버리지 자산입니다.',
    detail: '높은 분배금 대비 주가 원금 하락(제자리걸음 또는 원금 잠식) 위험이 있으므로 투자 시 주의가 필요합니다.',
  },
  tax: {
    title: '배당소득세 및 금융소득종합과세',
    description: '국내 배당은 15.4%(소득세 14% + 지방소득세 1.4%), 미국 배당은 15.0% 원천징수 세율이 적용됩니다.',
    detail: '이자 및 배당 등 금융소득 합계가 연 2,000만 원을 초과하면 타 소득(근로, 사업 등)과 합산되어 누진세율이 적용됩니다.',
  },
  fire: {
    title: '파이어(FIRE) 배당 역산',
    description: '원하는 월 배당 실수령액을 얻기 위해 각 종목별로 매수해야 하는 최소 주식 수와 필요 자본을 수학적으로 역산합니다.',
    detail: '미국 종목은 환율 1,350원 기준 원화 환산 및 15.0% 세율이 정밀 적용됩니다.',
  },
};

interface InfoTooltipProps {
  type?: TooltipType;
  title?: string;
  content?: string;
  detail?: string;
  className?: string;
  iconSize?: number;
}

export default function InfoTooltip({
  type,
  title: customTitle,
  content: customContent,
  detail: customDetail,
  className = '',
  iconSize = 15,
}: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const data: TooltipContent = type
    ? TOOLTIP_DATA[type]
    : {
        title: customTitle || '안내',
        description: customContent || '',
        detail: customDetail,
      };

  // 모바일/데스크톱 외부 탭 시 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // 데스크톱 호버 핸들러 (0.1초 딜레이)
  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setIsOpen(true);
    }, 100);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  // 모바일 터치 토글
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center align-middle ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        onClick={handleClick}
        aria-label={`${data.title} 정보 보기`}
        aria-expanded={isOpen}
        className="p-0.5 text-slate-400 hover:text-blue-600 active:text-blue-700 transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      >
        <HelpCircle size={iconSize} className="stroke-[2.2]" />
      </button>

      {/* 팝오버 / 툴팁 창 */}
      {isOpen && (
        <div
          role="tooltip"
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 max-w-[calc(100vw-32px)] p-3.5 bg-slate-900/95 text-white rounded-xl shadow-xl backdrop-blur-sm border border-slate-700/60 text-xs leading-relaxed transition-all animate-in fade-in zoom-in-95 duration-150"
        >
          {/* 말꼬리 화살표 */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-solid border-t-slate-900/95 border-t-[6px] border-x-transparent border-x-[6px] border-b-0" />

          <div className="flex items-start justify-between gap-2 pb-1.5 border-b border-slate-700/70 mb-1.5">
            <span className="font-semibold text-white tracking-tight flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400" />
              {data.title}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="text-slate-400 hover:text-white sm:hidden p-0.5 -mr-1"
              aria-label="닫기"
            >
              <X size={13} />
            </button>
          </div>

          <p className="text-slate-200 font-normal">{data.description}</p>

          {data.detail && (
            <p className="mt-1.5 pt-1.5 border-t border-slate-800 text-[11px] text-slate-400">
              💡 {data.detail}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
