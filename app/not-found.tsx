import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
      <div className="max-w-md p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <span className="text-3xl font-black text-blue-600">404</span>
        <h1 className="text-lg font-bold text-slate-900">페이지를 찾을 수 없습니다</h1>
        <p className="text-xs text-slate-500">
          요청하신 페이지가 존재하지 않거나 주소가 변경되었습니다.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors"
        >
          배당패스 홈으로 가기
        </Link>
      </div>
    </div>
  );
}
