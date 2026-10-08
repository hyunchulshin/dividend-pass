import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '배당패스 - 검증된 고배당주 & ETF 큐레이션',
  description: '국내 250개 + 미국 250개 총 500개의 고배당주/ETF 데이터 파이프라인 및 파이어 역산 시뮬레이터',
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
      <body className="min-h-screen bg-white text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden max-w-full w-full">
        <div className="min-h-screen flex flex-col bg-white overflow-x-hidden w-full max-w-full">
          {children}
        </div>
      </body>
    </html>
  );
}
