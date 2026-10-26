import { MetadataRoute } from 'next';
import { getDividendStocks } from '@/lib/data';
import { ALL_GUIDE_SUMMARIES } from '@/lib/guideArticles';
import { SITE_URL } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;
  const now = new Date();

  // 1. 기본 핵심 정적 페이지 (6개)
  const coreStaticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/guide`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // 2. 13대 전문 배당 투자 가이드 아티클 전체 등록 (에디토리얼 핵심 자산)
  const guidePages: MetadataRoute.Sitemap = ALL_GUIDE_SUMMARIES.map((guide) => ({
    url: `${baseUrl}${guide.href}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  // 3. 인기점수 상위 대표 종목(85점 이상 핵심 66선) 심층 리포트만 사이트맵에 정예 등록하여
  // 대량 단순 페이지로 인한 애드센스 '가치가 별로 없는 콘텐츠' 및 중복 색인 이슈 원천 해소
  try {
    const stocks = await getDividendStocks();
    const flagshipStocks = stocks.filter((stock) => stock.popularityScore >= 85);
    const stockPages: MetadataRoute.Sitemap = flagshipStocks.map((stock) => ({
      url: `${baseUrl}/stock/${stock.ticker}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    return [...coreStaticPages, ...guidePages, ...stockPages];
  } catch (error) {
    console.error('Failed to generate stock sitemaps', error);
    return [...coreStaticPages, ...guidePages];
  }
}
