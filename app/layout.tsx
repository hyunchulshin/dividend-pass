import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://dividendpass.com'),
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
  authors: [{ name: 'Dividend Pass Team' }],
  openGraph: {
    title: '배당패스 - 검증된 고배당주 & ETF 큐레이션',
    description:
      '국내 250개 + 미국 250개 총 500개 고배당주/ETF 실측치 및 파이어 배당 역산기',
    url: 'https://dividendpass.com',
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
    other: {
      'naver-site-verification': 'ab316e4138cc8603ff5eeea240b8ce69dd031ed9',
    },
  },
  other: {
    'google-adsense-account': 'ca-pub-7329867453845073',
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
          name="naver-site-verification"
          content="ab316e4138cc8603ff5eeea240b8ce69dd031ed9"
        />
        <meta name="google-adsense-account" content="ca-pub-7329867453845073" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7329867453845073"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-white text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden max-w-full w-full">
        <div className="min-h-screen flex flex-col bg-white overflow-x-hidden w-full max-w-full">
          {children}
        </div>
      </body>
    </html>
  );
}
