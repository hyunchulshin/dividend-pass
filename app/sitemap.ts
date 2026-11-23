import { MetadataRoute } from 'next';
import { ALL_GUIDE_SUMMARIES } from '@/lib/guideArticles';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
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

  // 2. 14편 심층 배당 투자 가이드 아티클 전체 등록 (에디토리얼 핵심 자산)
  const guidePages: MetadataRoute.Sitemap = ALL_GUIDE_SUMMARIES.map((guide) => ({
    url: `${baseUrl}${guide.href}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  return [...coreStaticPages, ...guidePages];
}
