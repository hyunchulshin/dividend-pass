import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, MessageSquare, Send, HelpCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '문의하기 - 배당패스 (Dividend Pass)',
  description: '배당패스 운영진에게 데이터 오류 제보, 신규 배당 ETF 건의, 제휴 및 피드백을 전달할 수 있는 공식 문의 채널입니다.',
};

export default function ContactPage() {
  return (
    <div className="flex-1 flex flex-col bg-white min-h-screen text-slate-900">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* 상단 헤더 */}
        <section className="space-y-3 border-b border-slate-200/80 pb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200/60 shadow-xs">
            <Mail size={13} className="text-blue-600" />
            <span>Contact & Feedback</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            문의하기 및 피드백
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            배당패스는 이용자 여러분의 소중한 피드백과 함께 발전합니다.
            데이터 오류 제보, 신규 배당 ETF 편입 건의, 기능 개선 아이디어, 제휴 문의 등 무엇이든 편하게 남겨주세요.
          </p>
        </section>

        {/* 1. 공식 소통 채널 카드 */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Mail size={20} />
            </div>
            <h2 className="text-base font-bold text-slate-900">공식 이메일 문의</h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              가장 빠르고 정확하게 운영진에게 전달되는 공식 창구입니다. 주말 및 공휴일을 제외하고 보통 24시간 이내에 회신드립니다.
            </p>
            <div className="pt-2">
              <a
                href="mailto:contact@dividendpass.com"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200/80 text-blue-600 font-bold text-xs sm:text-sm hover:border-blue-400 hover:shadow-xs transition-all"
              >
                <span>contact@dividendpass.com</span>
                <Send size={14} />
              </a>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <MessageSquare size={20} />
            </div>
            <h2 className="text-base font-bold text-slate-900">데이터 제보 및 종목 건의</h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              분배금 변동, 신규 상장된 유망 월배당 ETF 편입 요청, 데이터 오기 제보는 이메일 제목에 [데이터 제보] 말머리를 달아주시면 우선 처리됩니다.
            </p>
            <div className="pt-2 text-xs text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-500" />
              <span>실시간 크롤링 및 파이프라인 검증 반영</span>
            </div>
          </div>
        </section>

        {/* 2. 자주 묻는 질문 (FAQ) */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle size={20} className="text-blue-600" />
            자주 묻는 질문 (FAQ)
          </h2>
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1.5">
              <h3 className="font-bold text-xs sm:text-sm text-slate-900">
                Q. 배당 데이터는 얼마나 자주 갱신되나요?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                배당패스의 백엔드 파이프라인(GitHub Actions)은 매일 새벽 Yahoo Finance 등 공신력 있는 금융 시장 데이터를 통해 전자동 무인 갱신됩니다.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1.5">
              <h3 className="font-bold text-xs sm:text-sm text-slate-900">
                Q. 서비스 이용료나 유료 기능이 있나요?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                배당패스는 모든 500개 종목 탐색, ETF 세부 내역, 파이어 역산 시뮬레이터 기능을 회원가입 없이 100% 무료로 개방하고 있습니다.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1.5">
              <h3 className="font-bold text-xs sm:text-sm text-slate-900">
                Q. 특정 종목 추천이나 리딩 서비스를 제공하나요?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                아닙니다. 배당패스는 투자자문이나 종목 추천을 일체 수행하지 않으며, 오직 공개된 과거 실측치 데이터에 기반한 정보 시각화 도구만을 제공합니다.
              </p>
            </div>
          </div>
        </section>

        {/* 하단 홈으로 이동 */}
        <section className="pt-2 text-center">
          <Link
            href="/"
            className="text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            ← 메인 서비스로 돌아가기
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
