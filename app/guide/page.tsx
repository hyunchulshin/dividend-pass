import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  BookOpen,
  Sparkles,
  TrendingUp,
  Percent,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Flame,
  Calculator,
  Clock,
  Compass,
} from 'lucide-react';

export const metadata: Metadata = {
  title: '배당 투자 실전 가이드 센터 - 배당패스 (Dividend Pass)',
  description: '월배당 ETF 선별법, 배당소득세 15.4%와 2,000만 원 금융소득종합과세 절세 전략, TTM 배당수익률과 배당성향 분석법을 망라한 배당 투자 가이드입니다.',
  openGraph: {
    title: '배당 투자 실전 가이드 센터 - 배당패스',
    description: '실패 없는 배당 투자를 위한 3대 핵심 실전 가이드와 분석 기준을 무료로 제공합니다.',
    url: 'https://dividendpass.com/guide',
    siteName: '배당패스 (Dividend Pass)',
  },
};

const GUIDES = [
  {
    id: 'monthly-etf-top10',
    href: '/guide/monthly-etf-top10',
    title: '2026 지금 가장 핫한 월배당 ETF 고르는 3가지 기준',
    subtitle: '커버드콜 옵션 프리미엄의 함정, 총보수율, 기초지수 우량성을 낱낱이 파헤칩니다.',
    category: '월배당 ETF 분석',
    readTime: '4분 소요',
    badge: '🔥 인기 필독',
    icon: Calendar,
    accentColor: 'blue',
    tags: ['커버드콜', '제살깎아먹기', '총보수율', '월배당TOP10'],
  },
  {
    id: 'dividend-tax',
    href: '/guide/dividend-tax',
    title: '배당소득세 15.4%와 2,000만 원 금융소득종합과세 완벽 가이드',
    subtitle: '국내 vs 미국 원천징수세율 차이와 건보료 폭탄 방지 및 ISA·연금 절세 계좌 전략.',
    category: '세금 & 절세 전략',
    readTime: '5분 소요',
    badge: '💰 절세 필수',
    icon: Percent,
    accentColor: 'emerald',
    tags: ['15.4%', '2,000만원종합과세', 'ISA계좌', '세후실수령'],
  },
  {
    id: 'ttm-payout-ratio',
    href: '/guide/ttm-payout-ratio',
    title: 'TTM 배당수익률과 배당성향(Payout Ratio) 제대로 읽는 법',
    subtitle: '표기 배당률의 착시 현상, 배당 삭감(Cut) 신호 3가지와 지속 가능한 배당주 선별법.',
    category: '배당주 분석 기법',
    readTime: '4분 소요',
    badge: '🏛️ 안전 필터링',
    icon: TrendingUp,
    accentColor: 'indigo',
    tags: ['TTM실측치', '배당트랩', '배당성향', 'FCF현금흐름'],
  },
];

export default function GuideIndexPage() {
  return (
    <div className="flex-1 flex flex-col bg-white min-h-screen text-slate-900">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* 상단 헤더 */}
        <section className="space-y-3 border-b border-slate-200/80 pb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200/60 shadow-xs">
            <BookOpen size={13} className="text-blue-600" />
            <span>Dividend Investment Guide Center</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            배당 투자 실전 가이드 센터
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            가짜 고배당트랩을 피하고 평생 마르지 않는 현금흐름을 구축할 수 있도록,
            배당패스가 엄선한 <strong>3대 핵심 실전 가이드</strong>를 제공합니다.
          </p>
        </section>

        {/* 3대 아티클 카드 목록 */}
        <section className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {GUIDES.map((guide, idx) => {
              const Icon = guide.icon;
              return (
                <Link
                  key={guide.id}
                  href={guide.href}
                  className="group block p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                >
                  <div className="space-y-3.5">
                    {/* 상단 카테고리 / 뱃지 / 시간 */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                          {guide.badge}
                        </span>
                        <span className="text-xs font-medium text-slate-500">
                          {guide.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock size={12} />
                        <span>{guide.readTime}</span>
                      </div>
                    </div>

                    {/* 제목 & 서브타이틀 */}
                    <div className="space-y-1.5">
                      <h2 className="text-lg sm:text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-start gap-2.5">
                        <span className="text-blue-600 font-mono font-black text-base sm:text-xl shrink-0 pt-0.5">
                          0{idx + 1}.
                        </span>
                        <span>{guide.title}</span>
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-7 sm:pl-8">
                        {guide.subtitle}
                      </p>
                    </div>

                    {/* 태그 및 바로가기 화살표 */}
                    <div className="flex items-center justify-between pt-2 pl-7 sm:pl-8 border-t border-slate-100 flex-wrap gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {guide.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                        <span>아티클 읽기</span>
                        <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 메인 앱 바로가기 배너 */}
        <section className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1 text-xs font-bold text-blue-700">
              <Sparkles size={13} />
              <span>실시간 데이터 툴</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              가이드 원칙이 100% 반영된 500개 배당주 탐색기
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              국내 250개 + 미국 250개 종목의 TTM 실측치와 파이어 역산기를 무료로 이용하세요.
            </p>
          </div>
          <Link
            href="/#stock-explorer"
            className="w-full sm:w-auto shrink-0 py-3 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold text-center flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <span>배당주 탐색 시작하기</span>
            <ArrowRight size={14} />
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
