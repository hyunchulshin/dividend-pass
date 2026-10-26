import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdSenseSlot from '@/components/AdSenseSlot';
import {
  DYNAMIC_GUIDE_ARTICLES,
  ALL_GUIDE_SUMMARIES,
  getGuideArticleBySlug,
} from '@/lib/guideArticles';
import { getDividendStocks } from '@/lib/data';
import { SITE_URL } from '@/lib/site';
import {
  BookOpen,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Clock,
  HelpCircle,
  TrendingUp,
  Layers,
  Calculator,
} from 'lucide-react';

interface GuideSlugPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return DYNAMIC_GUIDE_ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: GuideSlugPageProps): Promise<Metadata> {
  const article = getGuideArticleBySlug(params.slug);
  if (!article) {
    return {
      title: '가이드를 찾을 수 없습니다 - 배당패스',
    };
  }

  return {
    title: `${article.title} - 배당패스`,
    description: article.description,
    keywords: [...article.tags, '배당패스', '배당주 투자', '파이어족'],
    alternates: {
      canonical: `/guide/${article.slug}`,
    },
    openGraph: {
      title: `${article.title} - 배당패스`,
      description: article.description,
      type: 'article',
      publishedTime: article.publishedAt,
      url: `${SITE_URL}/guide/${article.slug}`,
      siteName: '배당패스 (Dividend Pass)',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${article.title} - 배당패스`,
      description: article.description,
    },
  };
}

export default async function GuideArticleDetailPage({ params }: GuideSlugPageProps) {
  const article = getGuideArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const allStocks = await getDividendStocks();
  const relatedStockItems = article.relatedTickers
    .map((ticker) => allStocks.find((s) => s.ticker.toLowerCase() === ticker.toLowerCase()))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const currentIdx = ALL_GUIDE_SUMMARIES.findIndex((g) => g.id === article.slug);
  const prevGuide =
    currentIdx > 0 ? ALL_GUIDE_SUMMARIES[currentIdx - 1] : ALL_GUIDE_SUMMARIES[ALL_GUIDE_SUMMARIES.length - 1];
  const nextGuide =
    currentIdx >= 0 && currentIdx < ALL_GUIDE_SUMMARIES.length - 1
      ? ALL_GUIDE_SUMMARIES[currentIdx + 1]
      : ALL_GUIDE_SUMMARIES[0];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: {
      '@type': 'Organization',
      name: '배당패스 리서치팀 (RainShine Team)',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: '배당패스 (Dividend Pass)',
      url: SITE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/guide/${article.slug}`,
    },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: article.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="flex-1 flex flex-col bg-white min-h-screen text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* 브레드크럼 */}
        <nav aria-label="브레드크럼" className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            홈
          </Link>
          <span className="text-slate-300">/</span>
          <Link href="/guide" className="hover:text-blue-600 transition-colors">
            배당 가이드 센터
          </Link>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-700 truncate max-w-[220px] sm:max-w-none">
            {article.title}
          </span>
        </nav>

        {/* 아티클 헤더 */}
        <header className="space-y-4 border-b border-slate-200/80 pb-8">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200/60 shadow-xs">
                <BookOpen size={13} className="text-blue-600" />
                <span>{article.badge}</span>
              </span>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                {article.category}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1">
                <Clock size={12} />
                {article.readTime}
              </span>
              <span>·</span>
              <span>발행: {article.publishedAt}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            {article.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {article.subtitle}
          </p>

          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200/60"
              >
                #{tag}
              </span>
            ))}
          </div>
        </header>

        {/* 3줄 핵심 요약 박스 (Key Takeaways) */}
        <section className="p-5 sm:p-6 rounded-3xl bg-emerald-50/70 border border-emerald-200/70 space-y-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-emerald-800">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>바쁜 투자자를 위한 3줄 핵심 요약 (Key Takeaways)</span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-800 leading-relaxed">
            {article.keyTakeaways.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="font-mono font-bold text-emerald-700 shrink-0">0{idx + 1}.</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 도입부 본문 */}
        <section className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
          {article.introParagraphs.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </section>

        {/* 본문 심층 섹션 렌더링 */}
        <div className="space-y-8">
          {article.sections.map((sec, idx) => (
            <section
              key={idx}
              className="p-6 sm:p-7 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4"
            >
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/60">
                <Layers size={13} />
                <span>{sec.badge}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                {sec.title}
              </h2>

              <div className="space-y-3 text-sm sm:text-base text-slate-700 leading-relaxed">
                {sec.paragraphs.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>

              {/* 비교 테이블 */}
              {sec.comparisonTable && (
                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs my-3">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-800">
                        {sec.comparisonTable.headers.map((header, hIdx) => (
                          <th key={hIdx} className="p-3 sm:p-3.5 font-bold whitespace-nowrap">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sec.comparisonTable.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50/70 transition-colors">
                          {row.map((cell, cIdx) => (
                            <td
                              key={cIdx}
                              className={`p-3 sm:p-3.5 leading-relaxed ${
                                cIdx === 0 ? 'font-bold text-slate-900 whitespace-nowrap bg-slate-50/40' : 'text-slate-700'
                              }`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 불릿 리스트 */}
              {sec.bullets && sec.bullets.length > 0 && (
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2.5">
                  {sec.bulletTitle && (
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                      {sec.bulletTitle}
                    </h3>
                  )}
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {sec.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold shrink-0 mt-0.5">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 팁 박스 */}
              {sec.tipBox && (
                <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/80 border border-blue-200/70 space-y-1.5 text-xs sm:text-sm">
                  <div className="font-bold text-blue-900">{sec.tipBox.title}</div>
                  <p className="text-slate-700 leading-relaxed">{sec.tipBox.content}</p>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* 아티클 연계 실전 종목 카드 */}
        {relatedStockItems.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-600" />
                <span>이 칼럼과 연관된 대표 배당 종목 실측 데이터</span>
              </h2>
              <span className="text-xs text-slate-500">클릭 시 종목별 심층 분석 및 계산기로 이동</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {relatedStockItems.map((stk) => {
                const isKr = stk.market === 'KR';
                return (
                  <Link
                    key={stk.ticker}
                    href={`/stock/${stk.ticker}`}
                    className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between group space-y-3"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isKr
                              ? 'bg-rose-50 text-rose-600 border border-rose-200/60'
                              : 'bg-blue-50 text-blue-600 border border-blue-200/60'
                          }`}
                        >
                          {isKr ? '🇰🇷 국내' : '🇺🇸 미국'}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-slate-400">
                          {stk.ticker}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {stk.name}
                      </h3>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">TTM 배당률</span>
                      <span className="text-sm font-black text-emerald-600">
                        {stk.dividendYield.toFixed(2)}%
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* 자주 묻는 질문 (FAQ) */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle size={20} className="text-blue-600" />
            <span>자주 묻는 질문 (FAQ)</span>
          </h2>
          <div className="space-y-3">
            {article.faqs.map((faq, fIdx) => (
              <div
                key={fIdx}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2"
              >
                <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-start gap-2">
                  <span className="text-blue-600 font-mono font-black shrink-0">Q.</span>
                  <span>{faq.question}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 시뮬레이터 연결 CTA */}
        <section className="p-6 sm:p-8 rounded-3xl bg-blue-50/70 border border-blue-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1 text-xs font-bold text-blue-700">
              <Sparkles size={13} />
              <span>배당패스 파이어 시뮬레이터</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              내 목표 월 배당금에 필요한 원금을 지금 바로 역산해 보세요
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              국내 15.4%·미국 15.0% 배당소득세와 2,000만 원 종합과세 경고를 반영한 세후 정밀 역산기를 무료로 제공합니다.
            </p>
          </div>
          <Link
            href="/#fire-simulator"
            className="w-full sm:w-auto shrink-0 py-3.5 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold text-center flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <Calculator size={15} />
            <span>배당금 역산 시뮬레이터 실행</span>
            <ArrowRight size={14} />
          </Link>
        </section>

        <AdSenseSlot slotId={`guide-${article.slug}-bottom`} />

        {/* 이전/다음 가이드 네비게이션 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-200/80">
          <Link
            href={prevGuide.href}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 transition-colors flex flex-col gap-1"
          >
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <ArrowLeft size={12} /> 이전 가이드
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1">
              {prevGuide.title}
            </span>
          </Link>

          <Link
            href={nextGuide.href}
            className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 transition-colors flex flex-col items-end text-right gap-1"
          >
            <span className="text-[11px] font-semibold text-blue-600 flex items-center gap-1">
              다음 가이드 <ArrowRight size={12} />
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1">
              {nextGuide.title}
            </span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
