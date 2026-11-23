'use client';

import React, { useEffect } from 'react';

interface AdSenseSlotProps {
  slotId?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  responsive?: boolean;
  className?: string;
}

export default function AdSenseSlot({
  slotId,
  format = 'auto',
  responsive = true,
  className = '',
}: AdSenseSlotProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const isValidSlot = Boolean(slotId && /^\d+$/.test(slotId));

  useEffect(() => {
    if (clientId && isValidSlot) {
      try {
        // @ts-expect-error window.adsbygoogle global
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        // 구글 애드블록 또는 스크립트 미로드 시 안전 예외 처리
        console.debug('AdSense script error:', err);
      }
    }
  }, [clientId, isValidSlot]);

  // 애드센스 클라이언트 ID 미등록 또는 유효한 순수 숫자 slotId(/^\d+$/)가 아닌 더미 문자열일 경우 null 반환
  if (!clientId || !isValidSlot) {
    return null;
  }

  return (
    <aside
      aria-label="스폰서 광고"
      className={`w-full overflow-hidden my-6 flex flex-col items-center justify-center ${className}`}
    >
      <div className="text-[10px] text-slate-400 font-medium mb-1 tracking-wider uppercase">
        ADVERTISEMENT
      </div>
      <div className="w-full text-center min-h-[90px] bg-slate-50/50 rounded-xl border border-slate-100 flex items-center justify-center overflow-hidden">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client={clientId}
          {...(slotId ? { 'data-ad-slot': slotId } : {})}
          data-ad-format={format}
          data-full-width-responsive={responsive ? 'true' : 'false'}
        />
      </div>
    </aside>
  );
}
