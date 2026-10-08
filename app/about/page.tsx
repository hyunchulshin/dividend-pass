import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Sparkles, Database, ShieldCheck, Flame, PieChart, Layers, Target, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '서비스 소개 - 배당패스 (Dividend Pass)',
  description: '배당패스의 기획 의도, 500개 고배당주 실측 데이터 파이프라인, 인기 점수 알고리즘 및 투명성 기준을 소개합니다.',
};

export default function AboutPage() {
  return (
    <div className="flex-1 flex flex-col bg-white min-h-screen text-slate-900">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* 상단 헤더 */}
        <section className="space-y-3 border-b border-slate-200/80 pb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200/60 shadow-xs">
            <Sparkles size={13} className="text-blue-600" />
            <span>About Dividend Pass</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            배당패스 (Dividend Pass) 소개
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            복잡하고 왜곡된 배당 데이터에서 벗어나, <strong>과거 12개월(TTM) 실제 분배금 실측치</strong>만을 기반으로
            투자자가 3초 만에 알짜 배당주를 찾고 은퇴 포트폴리오를 역산할 수 있는 모던 핀테크 서비스입니다.
          </p>
        </section>

        {/* 1. 기획 의도 및 핵심 가치 */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Target className="text-blue-600" size={22} />
            기획 의도 및 핵심 가치
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            시중의 수많은 배당 정보는 일회성 특수 배당이 섞이거나 미래 추정치가 과장되어 개인 투자자에게 원금 손실 위험을 안겨줍니다.
            배당패스는 다음 세 가지 원칙 아래 개발되었습니다:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <span className="text-xs font-bold text-blue-600">01. 100% 무결성 실측치</span>
              <h3 className="text-sm font-bold text-slate-900">과거 실지급 분배금 기준</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                미래 희망 배당률이 아닌, 최근 1년(TTM) 동안 주주에게 실제 입금된 현금 DPS 누적치를 기준으로 계산합니다.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <span className="text-xs font-bold text-blue-600">02. 수학적 투명성</span>
              <h3 className="text-sm font-bold text-slate-900">편향 없는 순수 공식</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                인위적 가산점이나 광고성 부스팅 없이, 시가총액과 거래대금 기반의 공정한 알고리즘으로 랭킹을 산출합니다.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <span className="text-xs font-bold text-blue-600">03. 실전 파이어 역산</span>
              <h3 className="text-sm font-bold text-slate-900">세후 실수령액 중심</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                국내(15.4%)와 미국(15.0%) 배당소득세율 분기 및 금융소득종합과세(2,000만 원) 기준을 반영해 실제 필요 자본을 도출합니다.
              </p>
            </div>
          </div>
        </section>

        {/* 2. 데이터 수집 파이프라인 */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Database className="text-emerald-600" size={22} />
            데이터 출처 및 파이프라인
          </h2>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3 leading-relaxed text-sm text-slate-600">
            <p>
              배당패스는 글로벌 공신력을 갖춘 <strong>Yahoo Finance 실측 데이터 파이프라인</strong>을 구축하여 운영됩니다:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm pl-1">
              <li><strong>국내 250개 종목:</strong> 삼성전자, 맥쿼리인프라, 금융지주 및 TIGER/KODEX/SOL/ACE 대표 배당 ETF</li>
              <li><strong>미국 250개 종목:</strong> SCHD, JEPI, JEPQ, O, MAIN 및 배당귀족주(Dividend Aristocrats)</li>
              <li><strong>일 1회 무인 자동 동기화:</strong> GitHub Actions 워크플로우를 통해 매일 새벽 최신 종가와 배당률 데이터를 무인 갱신</li>
              <li><strong>무결성 게이트키핑:</strong> 자동 검증 스크립트(QA Gatekeeper)의 전 항목 통과 시에만 배포되는 엄격한 파이프라인 유지</li>
            </ul>
          </div>
        </section>

        {/* 3. 알고리즘 투명성 및 안전 기준 */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="text-orange-500" size={22} />
            알고리즘 산출 공식 & 안전 필터
          </h2>
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                <Flame size={16} className="text-orange-500" />
                <span>인기 점수 (Popularity Score)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                인기 점수는 <strong className="text-slate-800">[시가총액(AUM) 순위 60% + 일평균 거래대금 순위 40%]</strong> 가중 점수로
                0~100점 스케일로 정규화됩니다. 시총이 커서 안전하고 거래량이 풍부해 유동성이 뛰어난 우량 종목이 자연스럽게 최상위에 랭크됩니다.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                <PieChart size={16} className="text-blue-500" />
                <span>TTM 배당수익률 (Trailing Twelve Months)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                최근 12개월간 실제로 지급 완료된 1주당 분배금(DPS)의 누적 합계를 현재 주가로 나누어 산출합니다.
                일회성 특수배당이나 장부상 이익 조작의 영향을 최소화한 객관적 척도입니다.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                <Layers size={16} className="text-rose-500" />
                <span>안전 필터링 & 고위험 경고 플래그</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                유동성 결핍 종목을 방지하기 위해 <strong>국내 시총 1,000억 원 미만</strong> 및 <strong>미국 시총 $500M(약 6,700억 원) 미만</strong>은
                데이터셋에서 사전 제외됩니다. 또한 연 환산 배당률이 20%를 초과하는 고레버리지·초고배당 상품은 원금 손실 위험 고지를 위해
                <strong>[고위험]</strong> 뱃지를 자동 부착합니다.
              </p>
            </div>
          </div>
        </section>

        {/* 하단 홈으로 이동 CTA */}
        <section className="pt-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 active:scale-95 transition-all shadow-xs"
          >
            <span>배당패스 500개 종목 지금 탐색하기</span>
            <ArrowRight size={15} />
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
