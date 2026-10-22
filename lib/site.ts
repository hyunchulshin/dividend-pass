/**
 * 사이트 기본 URL 설정
 * 1. NEXT_PUBLIC_SITE_URL 환경변수 (우선순위 1)
 * 2. Vercel 프로덕션 배포 URL (우선순위 2)
 * 3. 기본값: https://dividend-pass.vercel.app
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://dividend-pass.vercel.app');

export const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-7329867453845073';

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';

