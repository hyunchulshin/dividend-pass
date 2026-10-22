import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import { SITE_URL, ADSENSE_CLIENT_ID, GA_TRACKING_ID } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  title: {
    default: '배당패스 - 검증된 고배당주 & ETF 큐레이션',
    template: '%s | 배당패스',
  },
  description:
    '국내 250개 + 미국 250개 총 500개의 고배당주/ETF 데이터 파이프라인 및 파이어(FIRE) 배당 역산 시뮬레이터',
  keywords: [
    '배당패스',
    '고배당주',
    '배당 ETF',
    '월배당 ETF',
    'SCHD',
    'JEPI',
    '배당 계산기',
    '파이어족',
    '배당소득세',
  ],
  authors: [{ name: 'RainShine Team' }],
  openGraph: {
    title: '배당패스 - 검증된 고배당주 & ETF 큐레이션',
    description:
      '국내 250개 + 미국 250개 총 500개 고배당주/ETF 실측치 및 파이어 배당 역산기',
    url: SITE_URL,
    siteName: '배당패스',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '배당패스 - 검증된 고배당주 & ETF 큐레이션',
    description:
      '국내 250개 + 미국 250개 총 500개 고배당주/ETF 실측치 및 파이어 배당 역산기',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 'mXJRQUrNsyIWU9wFg_GKqfaaAK1arXoB5I1zDe9XNW8',
    other: {
      'naver-site-verification': 'ab316e4138cc8603ff5eeea240b8ce69dd031ed9',
    },
  },
  other: {
    'google-adsense-account': ADSENSE_CLIENT_ID,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="overflow-x-hidden max-w-full">
      <head>
        <meta
          name="google-site-verification"
          content="mXJRQUrNsyIWU9wFg_GKqfaaAK1arXoB5I1zDe9XNW8"
        />
        <meta
          name="naver-site-verification"
          content="ab316e4138cc8603ff5eeea240b8ce69dd031ed9"
        />
        <meta name="google-adsense-account" content={ADSENSE_CLIENT_ID} />
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-white text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden max-w-full w-full">
        <div className="min-h-screen flex flex-col bg-white overflow-x-hidden w-full max-w-full">
          {children}
        </div>
        {GA_TRACKING_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_TRACKING_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}
