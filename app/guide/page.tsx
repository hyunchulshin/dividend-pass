import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ALL_GUIDE_SUMMARIES } from '@/lib/guideArticles';
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Calculator,
} from 'lucide-react';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: '배당 투자 실전 가이드 센터 (13대 심층 칼럼) - 배당패스 (Dividend Pass)',
  description:
    '월배당 ETF 선별법, 파이어족 월 100만·300만 원 로드맵, SCHD vs JEPI 비교, 배당소득세 15.4%와 2,000만 원 금융소득종합과세·건보료 방어 전략, 리츠·배당귀족주 분석법을 총망라한 배당 투자 전문 지식 센터입니다.',
  alternates: {
    canonical: '/guide',
  },
  openGraph: {
    title: '배당 투자 실전 가이드 센터 (13대 심층 칼럼) - 배당패스',
    description:
      '가짜 고배당트랩을 피하고 평생 마르지 않는 현금흐름을 구축하는 13편의 배당 투자 심층 리서치 가이드를 무료로 제공합니다.',
    url: `${SITE_URL}/guide`,
    siteName: '배당패스 (Dividend Pass)',
  },
};

export default function GuideIndexPage() {
  return (
    <div className="flex-1 flex flex-col bg-white min-h-screen text-slate-900">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* 상단 헤더 */}
        <section className="space-y-4 border-b border-slate-200/80 pb-8">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200/60 shadow-xs">
              <BookOpen size={13} className="text-blue-600" />
              <span>Dividend Research & Guide Center</span>
            </div>
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200/60">
              <ShieldCheck size={13} />
              <span>전문 에디토리얼 칼럼 {ALL_GUIDE_SUMMARIES.length}편 수록</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            배당 투자 실전 가이드 & 리서치 센터
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
            단순히 표면적인 배당수익률 숫자만 쫓다가는 원금 손실(배당 트랩)과 세금·건강보험료 폭탄을 맞기 쉽습니다.
            배당패스 리서치팀이 한국·미국 증시 실측 데이터와 세법을 바탕으로 집필한{' '}
            <strong>{ALL_GUIDE_SUMMARIES.length}편의 핵심 투자 가이드</strong>를 통해 흔들리지 않는 현금흐름 파이프라인을 설계하세요.
          </p>

          {/* 4대 핵심 학습 영역 요약 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="text-[11px] font-bold text-blue-600">PART 01</span>
              <div className="text-xs sm:text-sm font-bold text-slate-900">파이어족 로드맵</div>
              <p className="text-[11px] text-slate-500">월 100·300만 원 역산 및 DRIP 복리·하락장 방어</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="text-[11px] font-bold text-emerald-600">PART 02</span>
              <div className="text-xs sm:text-sm font-bold text-slate-900">월배당 & ETF 분석</div>
              <p className="text-[11px] text-slate-500">SCHD·JEPI·JEPQ 비교 및 2세대 커버드콜·환율</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="text-[11px] font-bold text-amber-600">PART 03</span>
              <div className="text-xs sm:text-sm font-bold text-slate-900">세금 & 건보료 절세</div>
              <p className="text-[11px] text-slate-500">15.4% 원천징수, 종합과세 2,000만 원, ISA·연금, 건보료</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
              <span className="text-[11px] font-bold text-rose-600">PART 04</span>
              <div className="text-xs sm:text-sm font-bold text-slate-900">배당주 실전 기법</div>
              <p className="text-[11px] text-slate-500">배당락일, 코리아 밸류업, 미국 배당킹, 리츠 FFO</p>
            </div>
          </div>
        </section>

        {/* 전체 아티클 카드 목록 */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              전체 심층 가이드 아티클 ({ALL_GUIDE_SUMMARIES.length}선)
            </h2>
            <span className="text-xs text-slate-400">전 칼럼 무료 열람 가능</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ALL_GUIDE_SUMMARIES.map((guide, idx) => {
              const numStr = idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`;
              return (
                <Link
                  key={guide.id}
                  href={guide.href}
                  className="group flex flex-col justify-between p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 hover:border-blue-400 hover:shadow-md transition-all duration-200 space-y-4"
                >
                  <div className="space-y-3">
                    {/* 상단 카테고리 / 뱃지 / 시간 */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                          {guide.badge}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          {guide.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock size={12} />
                        <span>{guide.readTime}</span>
                      </div>
                    </div>

                    {/* 제목 & 서브타이틀 */}
                    <div className="space-y-1.5">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-start gap-2 leading-snug">
                        <span className="text-blue-600 font-mono font-black text-sm sm:text-base shrink-0 pt-0.5">
                          {numStr}.
                        </span>
                        <span>{guide.title}</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6 sm:pl-7 line-clamp-2">
                        {guide.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* 태그 및 바로가기 화살표 */}
                  <div className="flex items-center justify-between pt-3 pl-6 sm:pl-7 border-t border-slate-100 flex-wrap gap-2">
                    <div className="flex items-center gap-1 flex-wrap">
                      {guide.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                      <span>칼럼 읽기</span>
                      <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 배당패스 편집 원칙 안내 섹션 */}
        <section className="p-6 sm:p-7 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>배당패스 리서치 콘텐츠 집필 및 데이터 검증 원칙</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            배당패스의 모든 가이드는 특정 금융사나 종목의 협찬 없이 독립적으로 작성됩니다.
            수록된 세법 기준(국내 배당소득세 15.4%, 한미조세조약 15.0%, 금융소득종합과세 연 2,000만 원 기준, 중개형 ISA 및 연금저축 과세 체계)과
            시장 데이터는 공신력 있는 금융기관 공시 및 과거 12개월(TTM) 실측 분배금 이력을 바탕으로 검증되었습니다.
          </p>
        </section>

        {/* 메인 앱 바로가기 배너 */}
        <section className="p-6 sm:p-8 rounded-3xl bg-blue-50/70 border border-blue-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1 text-xs font-bold text-blue-700">
              <Sparkles size={13} />
              <span>실시간 데이터 & 시뮬레이터</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              가이드 원칙이 100% 반영된 500개 배당주 탐색기 & 파이어 역산기
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              국내 250개 + 미국 250개 종목의 TTM 실측치와 세후 파이어 역산기를 무료로 이용하세요.
            </p>
          </div>
          <Link
            href="/#stock-explorer"
            className="w-full sm:w-auto shrink-0 py-3.5 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold text-center flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <Calculator size={15} />
            <span>배당주 탐색 & 역산 시작하기</span>
            <ArrowRight size={14} />
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
