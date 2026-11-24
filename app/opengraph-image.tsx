import { ImageResponse } from 'next/og';

export const alt = '배당패스 (Dividend Pass) - 국내외 고배당주 500선 & FIRE 시뮬레이터';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 58%, #0284c7 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '30px',
                fontWeight: 900,
                color: '#ffffff',
              }}
            >
              D
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-0.5px' }}>
                DIVIDEND PASS
              </span>
              <span style={{ fontSize: '15px', color: '#bae6fd', fontWeight: 600 }}>
                dividend.snowmango.com
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              padding: '10px 22px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.14)',
              color: '#e0f2fe',
              fontSize: '18px',
              fontWeight: 700,
            }}
          >
            KR 250 · US 250 · TTM Analytics
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div
            style={{
              fontSize: '62px',
              fontWeight: 900,
              lineHeight: 1.12,
              letterSpacing: '-1.5px',
            }}
          >
            Dividend Pass 500 &amp; FIRE Simulator
          </div>
          <div style={{ fontSize: '26px', color: '#cbd5e1', fontWeight: 600 }}>
            Monthly Cashflow Chart · 10Y DRIP Compounding · After-Tax Calculator
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          {[
            { label: '1,400 KRW/USD Unified', bg: '#2563eb' },
            { label: 'TTM Real Payout Data', bg: '#059669' },
            { label: '15.4% KR / 15.0% US Tax', bg: '#0284c7' },
          ].map((tag) => (
            <div
              key={tag.label}
              style={{
                display: 'flex',
                padding: '12px 22px',
                borderRadius: '14px',
                background: tag.bg,
                fontSize: '19px',
                fontWeight: 800,
              }}
            >
              {tag.label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
