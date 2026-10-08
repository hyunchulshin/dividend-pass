import { MetadataRoute } from 'next';
import { getDividendStocks } from '@/lib/data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://dividendpass.com';
  const now = new Date();

  // 기본 정적 페이지 목록 (9개)
  const staticPages: MetadataRoute.Sitemap = [
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
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guide/monthly-etf-top10`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guide/dividend-tax`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guide/ttm-payout-ratio`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
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

  // 500개 종목 개별 상세 페이지 사이트맵 자동 등록
  try {
    const stocks = await getDividendStocks();
    const stockPages: MetadataRoute.Sitemap = stocks.map((stock) => ({
      url: `${baseUrl}/stock/${stock.ticker}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: stock.popularityScore >= 80 ? 0.8 : 0.6,
    }));

    return [...staticPages, ...stockPages];
  } catch (error) {
    console.error('Failed to generate stock sitemaps', error);
    return staticPages;
  }
}
