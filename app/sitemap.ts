import { MetadataRoute } from 'next';
import { ALL_GUIDE_SUMMARIES } from '@/lib/guideArticles';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;
  const staticLastModified = new Date('2026-11-24T00:00:00+09:00');

  // 1. 기본 핵심 정적 페이지 (6개)
  const coreStaticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: staticLastModified,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/guide`,
      lastModified: staticLastModified,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: staticLastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: staticLastModified,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: staticLastModified,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: staticLastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // 2. 16편 심층 배당 투자 가이드 아티클 전체 등록 (각 가이드 실제 발행일 반영)
  const guidePages: MetadataRoute.Sitemap = ALL_GUIDE_SUMMARIES.map((guide) => ({
    url: `${baseUrl}${guide.href}`,
    lastModified: new Date(`${guide.publishedAt}T00:00:00+09:00`),
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  return [...coreStaticPages, ...guidePages];
}
